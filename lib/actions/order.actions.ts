"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function createOrder(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необходима авторизация" };

  const serviceId = formData.get("serviceId") as string;
  const masterId = formData.get("masterId") as string;
  const slotId = formData.get("slotId") as string;
  const address = formData.get("address") as string;
  const comment = formData.get("comment") as string;
  const price = parseFloat(formData.get("price") as string);

  if (!address) return { error: "Укажите адрес" };

  const slot = await db.slot.findUnique({ where: { id: slotId } });
  if (!slot || slot.isBusy) return { error: "Слот уже занят" };

  const order = await db.order.create({
    data: {
      clientId: session.user.id,
      masterId,
      slotId,
      address,
      comment: comment || null,
      totalPrice: price,
      items: {
        create: {
          serviceId,
          quantity: 1,
          price,
        },
      },
    },
  });

  await db.slot.update({
    where: { id: slotId },
    data: { isBusy: true },
  });

  redirect(`/orders/${order.id}`);
}