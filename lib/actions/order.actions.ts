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

  // Атомарне оновлення слоту — race condition виключено
  const slot = await db.slot.updateMany({
    where: { id: slotId, isBusy: false },
    data: { isBusy: true },
  });

  if (slot.count === 0) return { error: "Слот вже зайнятий" };

  // Всі дані паралельно
  const [service, master, client, slotData] = await Promise.all([
    db.service.findUnique({ where: { id: serviceId } }),
    db.master.findUnique({
      where: { id: masterId },
      include: { user: { select: { name: true, email: true } } }, // email одразу
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

  // Email — паралельно і не блокуємо redirect
  if (client?.email && service && master && slotData) {
    const dateStr = new Date(slotData.date).toLocaleDateString("uk-UA", {
      day: "numeric", month: "long", year: "numeric",
    });
    const timeStr = new Date(slotData.timeStart).toLocaleTimeString("uk-UA", {
      hour: "2-digit", minute: "2-digit",
    });

    Promise.all([
      sendOrderConfirmation({
        clientEmail: client.email,
        clientName: client.name,
        serviceName: service.name,
        masterName: master.user.name,
        date: dateStr,
        time: timeStr,
        address,
      }),
      sendNewOrderNotificationToMaster({
        masterEmail: master.user.email,
        masterName: master.user.name,
        clientName: client.name,
        serviceName: service.name,
        date: dateStr,
        time: timeStr,
        address,
        comment: comment || null,
      }),
    ]).catch(console.error); // не блокуємо, але логуємо помилки
  }

  redirect(`/orders/${order.id}`);
}