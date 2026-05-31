"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function submitComplaint(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необходима авторизация" };

  const orderId = formData.get("orderId") as string;
  const reason = formData.get("reason") as string;
  const photos = JSON.parse(formData.get("photos") as string) as string[];

  if (!reason) return { error: "Опишите причину жалобы" };

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { complaint: true },
  });

  if (!order || order.clientId !== session.user.id) return { error: "Заказ не найден" };
  if (order.complaint) return { error: "Жалоба уже подана" };

  await db.complaint.create({
    data: {
      orderId,
      clientId: session.user.id,
      masterId: order.masterId,
      reason,
      photos,
    },
  });

  revalidatePath(`/orders/${orderId}`);
  return { success: true };
}