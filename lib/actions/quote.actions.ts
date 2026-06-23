"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

interface QuoteItem {
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

export async function saveQuote({
  orderId,
  items,
  comment,
  totalPrice,
}: {
  orderId: string;
  items: QuoteItem[];
  comment: string;
  totalPrice: number;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необхідна авторизація" };
  if (session.user.role !== "MASTER") return { error: "Немає доступу" };

  await db.quote.upsert({
  where: { orderId },
  create: { orderId, items: items as unknown as Prisma.InputJsonValue, totalPrice, comment: comment || null },
  update: { items: items as unknown as Prisma.InputJsonValue, totalPrice, comment: comment || null },
})

  // Оновлюємо totalPrice в замовленні
  await db.order.update({
    where: { id: orderId },
    data: { totalPrice },
  });

  revalidatePath(`/master/orders/${orderId}/quote`);
  revalidatePath(`/orders/${orderId}`);
  redirect("/master");
}