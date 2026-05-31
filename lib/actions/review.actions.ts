"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function createReview(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необходима авторизация" };

  const orderId = formData.get("orderId") as string;
  const rating = parseInt(formData.get("rating") as string);
  const comment = formData.get("comment") as string;
  const photos = JSON.parse(formData.get("photos") as string) as string[];

  if (!rating || rating < 1 || rating > 5) return { error: "Некорректная оценка" };

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { review: true },
  });

  if (!order || order.clientId !== session.user.id) return { error: "Заказ не найден" };
  if (order.status !== "DONE") return { error: "Заказ ещё не завершён" };
  if (order.review) return { error: "Отзыв уже оставлен" };

  await db.review.create({
    data: { orderId, rating, comment: comment || null, photos },
  });

  const reviews = await db.review.findMany({
    where: { order: { masterId: order.masterId } },
    select: { rating: true },
  });

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await db.master.update({
    where: { id: order.masterId },
    data: { rating: avg, reviewCount: reviews.length },
  });

  redirect(`/orders/${orderId}`);
}