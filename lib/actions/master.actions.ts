"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";
import { sendOrderStatusUpdate } from "@/lib/email";

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необхідна авторизація" };
  if (session.user.role !== "MASTER") return { error: "Немає доступу" };

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

export async function updateMasterSettings(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необхідна авторизація" };
  if (session.user.role !== "MASTER") return { error: "Немає доступу" };

  const masterId = formData.get("masterId") as string;
  const bio = formData.get("bio") as string;
  const phone = formData.get("phone") as string;
  const region = formData.get("region") as string;
  const subregion = formData.get("subregion") as string;
  const city = formData.get("city") as string;
  const district = formData.get("district") as string;
  const serviceIds = JSON.parse(formData.get("serviceIds") as string) as string[];

  if (!phone) return { error: "Телефон обов'язковий" };

  await db.master.update({
    where: { id: masterId },
    data: {
      bio: bio || null,
      phone,
      region: region || null,
      subregion: subregion || null,
      city: city || null,
      district: district || null,
    },
  });

  // Оновлюємо послуги — видаляємо старі і додаємо нові
  await db.masterService.deleteMany({ where: { masterId } });

  if (serviceIds.length > 0) {
    const services = await db.service.findMany({
      where: { id: { in: serviceIds }, isActive: true },
    });

    await db.masterService.createMany({
      data: services.map((s) => ({
        masterId,
        serviceId: s.id,
        price: Number(s.basePrice),
      })),
      skipDuplicates: true,
    });
  }

  revalidatePath("/master/settings");
  return { success: true };
}