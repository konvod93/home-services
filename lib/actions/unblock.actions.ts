"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function submitUnblockRequest(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необходима авторизация" };
  if (session.user.role !== "MASTER") return { error: "Нет доступа" };

  const masterId = formData.get("masterId") as string;
  const reason = formData.get("reason") as string;
  const documents = JSON.parse(formData.get("documents") as string) as string[];

  if (!reason) return { error: "Опишите ситуацию" };

  const existing = await db.unblockRequest.findUnique({
    where: { masterId },
  });

  if (existing) return { error: "Заявка уже подана" };

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

  redirect("/master/unblock");
}