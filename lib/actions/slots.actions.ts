"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function addSlot(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необхідна авторизація" };
  if (session.user.role !== "MASTER") return { error: "Немає доступу" };

  const masterId = formData.get("masterId") as string;
  const dateStr = formData.get("date") as string;
  const timeStartStr = formData.get("timeStart") as string;
  const timeEndStr = formData.get("timeEnd") as string;

  if (!dateStr || !timeStartStr || !timeEndStr) return { error: "Заповніть усі поля" };

  const date = new Date(dateStr);
  const [startH, startM] = timeStartStr.split(":").map(Number);
  const [endH, endM] = timeEndStr.split(":").map(Number);

  const timeStart = new Date(date);
  timeStart.setHours(startH, startM, 0, 0);

  const timeEnd = new Date(date);
  timeEnd.setHours(endH, endM, 0, 0);

  if (timeEnd <= timeStart) return { error: "Час закінчення має бути пізніше початку" };

  await db.slot.create({
    data: { masterId, date, timeStart, timeEnd },
  });

  revalidatePath("/master/slots");
}

export async function deleteSlot(slotId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необхідна авторизація" };

  await db.slot.delete({
    where: { id: slotId, isBusy: false },
  });

  revalidatePath("/master/slots");
}