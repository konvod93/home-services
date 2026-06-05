"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";
import { sendOrderStatusUpdate } from "@/lib/email";

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необходима авторизация" };
  if (session.user.role !== "MASTER") return { error: "Нет доступа" };

  const order = await db.order.update({
    where: { id: orderId },
    data: { status: status as OrderStatus },
    include: {
      client: { select: { name: true, email: true } },
      items: { include: { service: true } },
    },
  });

  // Отправляем email клиенту
  if (order.client.email) {
    await sendOrderStatusUpdate({
      clientEmail: order.client.email,
      clientName: order.client.name,
      serviceName: order.items[0]?.service.name ?? "Услуга",
      status,
      orderId,
    });
  }

  revalidatePath("/master");
}