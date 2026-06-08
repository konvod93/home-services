"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

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