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

  // ⚠️ REVIEW: Race condition — slot availability check and slot booking are two separate operations.
  // Two concurrent requests can both pass the `isBusy` check and create duplicate orders for the same slot.
  // FIX: wrap slot check + order create + slot update in a single `db.$transaction()`
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

  // ⚠️ REVIEW: Two emails are sent sequentially with `await` before the redirect —
  // user waits on a frozen button until both Resend calls complete (~300-600ms extra).
  // FIX: use Promise.all([sendOrderConfirmation(...), sendNewOrderNotificationToMaster(...)])
  // to send in parallel, or fire-and-forget (remove await) to unblock redirect immediately.
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
    // ⚠️ REVIEW: Master's email is fetched in a separate DB query after master is already loaded above.
    // FIX: add `email: true` to the master's user select on line ~29 and remove this extra query
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

