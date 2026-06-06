"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { ComplaintStatus } from "@prisma/client";
import { ServiceCategory } from "@prisma/client";

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

  // Создаём MasterService только для выбранных услуг
  const serviceIds = application.serviceIds.length > 0
    ? application.serviceIds
    : (await db.service.findMany({
      where: { category: { in: application.categories }, isActive: true },
      select: { id: true },
    })).map((s) => s.id);

  await db.masterService.createMany({
    data: serviceIds.map((serviceId) => ({
      masterId,
      serviceId,
      price: 0,
    })),
    skipDuplicates: true,
  });

  // Получаем цены из basePrice услуг
  const services = await db.service.findMany({
    where: { id: { in: serviceIds } },
  });

  for (const service of services) {
    await db.masterService.updateMany({
      where: { masterId, serviceId: service.id },
      data: { price: Number(service.basePrice) },
    });
  }

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

export async function toggleMasterBlock(masterId: string, isActive: boolean) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Нет доступа" };

  await db.master.update({
    where: { id: masterId },
    data: { isActive },
  });

  revalidatePath("/admin/masters");
  revalidatePath("/admin/complaints");
}

export async function resolveComplaint(complaintId: string, status: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Нет доступа" };

  await db.complaint.update({
    where: { id: complaintId },
    data: { status: status as ComplaintStatus },
  });

  revalidatePath("/admin/complaints");
}

export async function createService(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Нет доступа" };

  const name = formData.get("name") as string;
  const category = formData.get("category") as ServiceCategory;
  const basePrice = parseFloat(formData.get("basePrice") as string);
  const unit = formData.get("unit") as string;
  const description = formData.get("description") as string;

  if (!name || !category || !unit || isNaN(basePrice)) return { error: "Заполните все поля" };

  await db.service.create({
    data: { name, category, basePrice, unit, description: description || null },
  });

  revalidatePath("/admin/services");
}

export async function updateService(serviceId: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Нет доступа" };

  const name = formData.get("name") as string;
  const category = formData.get("category") as ServiceCategory;
  const basePrice = parseFloat(formData.get("basePrice") as string);
  const unit = formData.get("unit") as string;
  const description = formData.get("description") as string;

  if (!name || !category || !unit || isNaN(basePrice)) return { error: "Заполните все поля" };

  await db.service.update({
    where: { id: serviceId },
    data: { name, category, basePrice, unit, description: description || null },
  });

  revalidatePath("/admin/services");
}

export async function deleteService(serviceId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Нет доступа" };

  await db.service.delete({ where: { id: serviceId } });

  revalidatePath("/admin/services");
}

export async function approveUnblock(requestId: string, masterId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Нет доступа" };

  await db.unblockRequest.update({
    where: { id: requestId },
    data: { status: "APPROVED" },
  });

  await db.master.update({
    where: { id: masterId },
    data: { isActive: true },
  });

  revalidatePath("/admin/unblock");
}

export async function rejectUnblock(requestId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Нет доступа" };

  await db.unblockRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED" },
  });

  revalidatePath("/admin/unblock");
}