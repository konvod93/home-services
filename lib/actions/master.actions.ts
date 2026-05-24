"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необходима авторизация" };
  if (session.user.role !== "MASTER") return { error: "Нет доступа" };

  await db.order.update({
    where: { id: orderId },
    data: { status: status as OrderStatus },
  });

  revalidatePath("/master");
}