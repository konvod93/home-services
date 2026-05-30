"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function approveApplication(applicationId: string, masterId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Нет доступа" };

  const application = await db.masterApplication.findUnique({
    where: { id: applicationId },
  });

  if (!application) return { error: "Заявка не найдена" };

  await db.masterApplication.update({
    where: { id: applicationId },
    data: { status: "APPROVED" },
  });

  await db.master.update({
    where: { id: masterId },
    data: { isVerified: true, isActive: true },
  });

  // Получаем все услуги выбранных категорий
  const services = await db.service.findMany({
    where: {
      category: { in: application.categories },
      isActive: true,
    },
  });

  // Создаём MasterService для каждой услуги
  await db.masterService.createMany({
    data: services.map((s) => ({
      masterId,
      serviceId: s.id,
      price: Number(s.basePrice),
    })),
    skipDuplicates: true,
  });

  // Меняем роль на MASTER
  const master = await db.master.findUnique({ where: { id: masterId } });
  if (master) {
    await db.user.update({
      where: { id: master.userId },
      data: { role: "MASTER" },
    });
  }

  revalidatePath("/admin");
}

export async function rejectApplication(applicationId: string, comment: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Нет доступа" };

  await db.masterApplication.update({
    where: { id: applicationId },
    data: { status: "REJECTED", comment: comment || null },
  });

  revalidatePath("/admin");
}

export async function toggleService(serviceId: string, isActive: boolean) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Нет доступа" };

  await db.service.update({
    where: { id: serviceId },
    data: { isActive },
  });

  revalidatePath("/admin/services");
}