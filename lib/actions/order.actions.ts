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

  if (!address) return { error: "Вкажіть адресу" };

  // Ціна береться з БД — не з клієнта
  const masterService = await db.masterService.findUnique({
    where: { masterId_serviceId: { masterId, serviceId } },
    include: { service: true },
  });

  if (!masterService) return { error: "Послугу не знайдено" };
  const price = masterService.price;

  // Атомарне оновлення слоту — race condition виключено
  const slotUpdate = await db.slot.updateMany({
    where: { id: slotId, isBusy: false },
    data: { isBusy: true },
  });

  if (slotUpdate.count === 0) return { error: "Слот вже зайнятий" };

  const [master, client, slotData] = await Promise.all([
    db.master.findUnique({
      where: { id: masterId },
      include: { user: { select: { name: true, email: true } } },
    }),
    db.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true },
    }),
    db.slot.findUnique({ where: { id: slotId } }),
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

  // Email — await перед redirect щоб serverless не завершився раніше
  if (client?.email && master && slotData) {
    const dateStr = new Date(slotData.date).toLocaleDateString("uk-UA", {
      day: "numeric", month: "long", year: "numeric",
    });
    const timeStr = new Date(slotData.timeStart).toLocaleTimeString("uk-UA", {
      hour: "2-digit", minute: "2-digit",
    });

    await Promise.all([
      sendOrderConfirmation({
        clientEmail: client.email,
        clientName: client.name,
        serviceName: masterService.service.name,
        masterName: master.user.name,
        date: dateStr,
        time: timeStr,
        address,
      }),
      sendNewOrderNotificationToMaster({
        masterEmail: master.user.email,
        masterName: master.user.name,
        clientName: client.name,
        serviceName: masterService.service.name,
        date: dateStr,
        time: timeStr,
        address,
        comment: comment || null,
      }),
    ]).catch(console.error);
  }

  redirect(`/orders/${order.id}`);
}