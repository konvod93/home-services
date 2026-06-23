"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { sendComplaintNotificationToAdmin } from "@/lib/email";

export async function submitComplaint(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необхідна авторизація" };

  const orderId = formData.get("orderId") as string;
  const reason = formData.get("reason") as string;
  const photos = JSON.parse(formData.get("photos") as string) as string[];

  if (!reason) return { error: "Опишіть причину скарги" };

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      complaint: true,
      client: { select: { name: true } },
      master: { include: { user: { select: { name: true } } } },
      items: { include: { service: true } },
    },
  });

  if (!order || order.clientId !== session.user.id) return { error: "Замовлення не знайдено" };
  if (order.complaint) return { error: "Скарга вже подана" };

  await db.complaint.create({
    data: {
      orderId,
      clientId: session.user.id,
      masterId: order.masterId,
      reason,
      photos,
    },
  });

  // Меняем статус платежа на DISPUTED
  if (order.paymentStatus === "HELD") {
    await db.order.update({
      where: { id: orderId },
      data: { paymentStatus: "DISPUTED" },
    });
  }

  // Находим админа и отправляем уведомление
  const admin = await db.user.findFirst({
    where: { role: "ADMIN" },
    select: { email: true },
  });

  if (admin?.email) {
    await sendComplaintNotificationToAdmin({
      adminEmail: admin.email,
      clientName: order.client.name,
      masterName: order.master.user.name,
      serviceName: order.items[0]?.service.name ?? "Послуга",
      reason,
    });
  }

  revalidatePath(`/orders/${orderId}`);
  return { success: true };
}