"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { sendOrderConfirmation, sendNewOrderNotificationToMaster } from "@/lib/email";

export async function createOrder(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необхідна авторизація" };

  const serviceId = formData.get("serviceId") as string;
  const masterId = formData.get("masterId") as string;
  const slotId = formData.get("slotId") as string;
  const address = formData.get("address") as string;
  const comment = formData.get("comment") as string;
  const price = parseFloat(formData.get("price") as string);

  if (!address) return { error: "Вкажіть адресу" };

  const slot = await db.slot.findUnique({ where: { id: slotId } });
  if (!slot || slot.isBusy) return { error: "Слот вже зайнятий" };

  const [service, master, client] = await Promise.all([
    db.service.findUnique({ where: { id: serviceId } }),
    db.master.findUnique({ where: { id: masterId }, include: { user: { select: { name: true } } } }),
    db.user.findUnique({ where: { id: session.user.id }, select: { name: true, email: true } }),
  ]);

  const order = await db.order.create({
    data: {
      clientId: session.user.id,
      masterId,
      slotId,
      address,
      comment: comment || null,
      totalPrice: price,
      items: {
        create: { serviceId, quantity: 1, price },
      },
    },
  });

  await db.slot.update({
    where: { id: slotId },
    data: { isBusy: true },
  });

  // Отправляем email
  if (client?.email && service && master) {
    await sendOrderConfirmation({
      clientEmail: client.email,
      clientName: client.name,
      serviceName: service.name,
      masterName: master.user.name,
      date: new Date(slot.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
      time: new Date(slot.timeStart).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      address,
    });
  }

  if (master) {
    const masterUser = await db.user.findUnique({
      where: { id: master.userId },
      select: { email: true },
    });

    if (masterUser?.email && service && client) {
      await sendNewOrderNotificationToMaster({
        masterEmail: masterUser.email,
        masterName: master.user.name,
        clientName: client.name,
        serviceName: service.name,
        date: new Date(slot.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
        time: new Date(slot.timeStart).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
        address,
        comment: comment || null,
      });
    }
  }

  redirect(`/orders/${order.id}`);
}

