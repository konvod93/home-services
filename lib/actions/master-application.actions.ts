"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ServiceCategory } from "@prisma/client";

export async function submitMasterApplication(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Необходима авторизация" };
  if (session.user.role !== "CLIENT") return { error: "Нет доступа" };

  const bio = formData.get("bio") as string;
  const experience = parseInt(formData.get("experience") as string);
  const documents = JSON.parse(formData.get("documents") as string) as string[];
  const idPhoto = formData.get("idPhoto") as string;
  const categories = JSON.parse(formData.get("categories") as string) as ServiceCategory[];
  const serviceIds = JSON.parse(formData.get("serviceIds") as string) as string[];
  const region = formData.get("region") as string;
  const city = formData.get("city") as string;
  const district = formData.get("district") as string;

  if (!bio) return { error: "Заполните поле 'О себе'" };
  if (isNaN(experience)) return { error: "Укажите опыт работы" };
  if (!idPhoto) return { error: "Загрузите фото с паспортом" };
  if (categories.length === 0) return { error: "Выберите специализацию" };
  if (serviceIds.length === 0) return { error: "Выберите хотя бы одну услугу" };
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