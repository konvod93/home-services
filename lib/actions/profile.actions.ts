"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необходима авторизация" };

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const region = formData.get("region") as string;
  const city = formData.get("city") as string;
  const district = formData.get("district") as string;

  if (!name) return { error: "Имя обязательно" };

  await db.user.update({
    where: { id: session.user.id },
    data: {
      name,
      phone: phone || null,
      region: region || null,
      city: city || null,
      district: district || null,
    },
  });

  revalidatePath("/profile");
  return { success: true };
}