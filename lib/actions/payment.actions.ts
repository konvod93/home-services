"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendComplaintNotificationToAdmin } from "@/lib/email";

export async function confirmOrderPayment(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необходима авторизация" };

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { complaint: true },
  });

  if (!order || order.clientId !== session.user.id) return { error: "Замовлення не знайдено" };
  if (order.paymentStatus !== "HELD") return { error: "Некоректний статус оплати" };
  if (order.complaint) return { error: "Є активна скарга" };

  // В реальном проекте здесь был бы вызов LiqPay API для разморозки
  // В sandbox просто меняем статус
  await db.order.update({
    where: { id: orderId },
    data: { paymentStatus: "RELEASED" },
  });

  revalidatePath(`/orders/${orderId}`);
  return { success: true };
}

export async function disputeOrderPayment(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необходима авторизация" };

  const order = await db.order.findUnique({ where: { id: orderId } });

  if (!order || order.clientId !== session.user.id) return { error: "Замовлення не знайдено" };
  if (order.paymentStatus !== "HELD") return { error: "Некоректний статус оплати" };

  await db.order.update({
    where: { id: orderId },
    data: { paymentStatus: "DISPUTED" },
  });

  revalidatePath(`/orders/${orderId}`);
  return { success: true };
}

export async function resolvePaymentDispute(orderId: string, refund: boolean) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Нет доступа" };

  await db.order.update({
    where: { id: orderId },
    data: { paymentStatus: refund ? "REFUNDED" : "RELEASED" },
  });

  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function cancelOrderByClient(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необходима авторизация" };

  const order = await db.order.findUnique({ where: { id: orderId } });

  if (!order || order.clientId !== session.user.id) return { error: "Замовлення не знайдено" };
  if (order.paymentStatus !== "HELD") return { error: "Некоректний статус" };
  if (order.status === "IN_PROGRESS") return { error: "Не можна скасувати — майстер вже виконує роботу" };

  await db.order.update({
    where: { id: orderId },
    data: {
      status: "CANCELLED",
      paymentStatus: "REFUNDED",
    },
  });

  revalidatePath(`/orders/${orderId}`);
  redirect(`/orders/${orderId}`);
}

export async function cancelOrderByMaster(orderId: string, reason: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необходима авторизация" };
  if (session.user.role !== "MASTER") return { error: "Нет доступа" };

  const master = await db.master.findUnique({
    where: { userId: session.user.id },
  });

  if (!master) return { error: "Майстра не знайдено" };

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { client: { select: { name: true, email: true } } },
  });

  if (!order) return { error: "Замовлення не знайдено" };

  await db.order.update({
    where: { id: orderId },
    data: {
      status: "CANCELLED",
      paymentStatus: "DISPUTED",
    },
  });

  // Сохраняем причину как жалобу от мастера
  const existingComplaint = await db.complaint.findUnique({
    where: { orderId },
  });

  if (!existingComplaint) {
    await db.complaint.create({
      data: {
        orderId,
        clientId: order.clientId,
        masterId: master.id,
        reason: `⚠️ Форс-мажор від майстра: ${reason}`,
        photos: [],
      },
    });
  }

  const admin = await db.user.findFirst({
    where: { role: "ADMIN" },
    select: { email: true },
  });

  if (admin?.email) {
    await sendComplaintNotificationToAdmin({
      adminEmail: admin.email,
      clientName: order.client.name,
      masterName: session.user.name ?? "Майстер",
      serviceName: "Форс-мажор",
      reason,
    });
  }

  revalidatePath("/master");
  redirect("/master");
}