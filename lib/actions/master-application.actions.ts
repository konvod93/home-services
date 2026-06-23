"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ServiceCategory } from "@prisma/client";

export async function submitMasterApplication(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необхідна авторизація" };
  if (session.user.role !== "CLIENT") return { error: "Немає доступу" };

  const bio = formData.get("bio") as string;
  const experience = parseInt(formData.get("experience") as string);
  const documents = JSON.parse(formData.get("documents") as string) as string[];
  const idPhoto = formData.get("idPhoto") as string;
  const categories = JSON.parse(formData.get("categories") as string) as ServiceCategory[];
  const serviceIds = JSON.parse(formData.get("serviceIds") as string) as string[];
  const region = formData.get("region") as string;
  const city = formData.get("city") as string;
  const district = formData.get("district") as string;

  if (!bio) return { error: "Заповніть поле 'Про себе'" };
  if (isNaN(experience)) return { error: "Вкажіть досвід роботи" };
  if (!idPhoto) return { error: "Завантажте фото з паспортом" };
  if (categories.length === 0) return { error: "Виберіть спеціалізацію" };
  if (serviceIds.length === 0) return { error: "Виберіть хоча б одну послугу" };
  if (!city) return { error: "Вкажіть місто" };

  const existing = await db.master.findUnique({
    where: { userId: session.user.id },
  });

  let master = existing;

  if (!master) {
    master = await db.master.create({
      data: {
        userId: session.user.id,
        bio,
        region: region || null,
        city,
        district: district || null,
      },
    });
  } else {
    master = await db.master.update({
      where: { id: master.id },
      data: {
        region: region || null,
        city,
        district: district || null,
      },
    });
  }

  await db.masterApplication.create({
    data: {
      masterId: master.id,
      bio,
      experience,
      documents,
      idPhoto,
      categories,
      serviceIds,
    },
  });

  redirect("/dashboard");
}