"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function approveApplication(applicationId: string, masterId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Нет доступа" };

  await db.masterApplication.update({
    where: { id: applicationId },
    data: { status: "APPROVED" },
  });

  await db.master.update({
    where: { id: masterId },
    data: { isVerified: true, isActive: true },
  });

  // Меняем роль пользователя на MASTER
  const master = await db.master.findUnique({
    where: { id: masterId },
  });

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