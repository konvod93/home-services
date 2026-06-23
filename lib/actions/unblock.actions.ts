"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function submitUnblockRequest(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необхідна авторизація" };
  if (session.user.role !== "MASTER") return { error: "Немає доступу" };

  const masterId = formData.get("masterId") as string;
  const reason = formData.get("reason") as string;
  const documents = JSON.parse(formData.get("documents") as string) as string[];

  if (!reason) return { error: "Опишіть ситуацію" };

  const existing = await db.unblockRequest.findUnique({
    where: { masterId },
  });
  
  if (existing && existing.status === "PENDING") {
    return { error: "Заявка уже знаходиться на розгляді" };
  }

  await db.unblockRequest.upsert({
    where: { masterId },
    create: {
      masterId,
      reason,
      documents,
      status: "PENDING",
    },
    update: {
      reason,
      documents,
      status: "PENDING",
    },
  });

  revalidatePath("/master/unblock");

  redirect("/master/unblock");
}