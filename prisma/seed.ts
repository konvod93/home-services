import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  await db.service.createMany({
    data: [
      // Сантехніка
      { name: "Заміна змішувача", category: "PLUMBING", basePrice: 800, unit: "за виїзд" },
      { name: "Усунення засмічення", category: "PLUMBING", basePrice: 600, unit: "за виїзд" },
      { name: "Встановлення унітазу", category: "PLUMBING", basePrice: 1500, unit: "за виїзд" },
      { name: "Заміна труб", category: "PLUMBING", basePrice: 500, unit: "за метр" },

      // Електрика
      { name: "Заміна розетки / вимикача", category: "ELECTRICAL", basePrice: 400, unit: "за штуку" },
      { name: "Встановлення люстри", category: "ELECTRICAL", basePrice: 700, unit: "за виїзд" },
      { name: "Прокладання кабелю", category: "ELECTRICAL", basePrice: 300, unit: "за метр" },
      { name: "Заміна електрощитка", category: "ELECTRICAL", basePrice: 3000, unit: "за виїзд" },

      // Ремонт
      { name: "Поклейка шпалер", category: "RENOVATION", basePrice: 200, unit: "за м²" },
      { name: "Укладання плитки", category: "RENOVATION", basePrice: 800, unit: "за м²" },
      { name: "Шпаклювання стін", category: "RENOVATION", basePrice: 150, unit: "за м²" },
      { name: "Встановлення дверей", category: "RENOVATION", basePrice: 2500, unit: "за двері" },

      // Прибирання
      { name: "Генеральне прибирання", category: "CLEANING", basePrice: 3000, unit: "за виїзд" },
      { name: "Прибирання після ремонту", category: "CLEANING", basePrice: 5000, unit: "за виїзд" },
      { name: "Миття вікон", category: "CLEANING", basePrice: 200, unit: "за вікно" },

      // Меблі
      { name: "Збірка кухні", category: "FURNITURE", basePrice: 5000, unit: "за виїзд" },
      { name: "Збірка шафи", category: "FURNITURE", basePrice: 1500, unit: "за виїзд" },
      { name: "Збірка ліжка", category: "FURNITURE", basePrice: 1000, unit: "за виїзд" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Services seeded");

  const masterUser = await db.user.create({
    data: {
      name: "Олександр Петров",
      email: "master@homefix.com",
      password: await bcrypt.hash("master123", 12),
      role: "MASTER",
    },
  });

  const master = await db.master.create({
    data: {
      userId: masterUser.id,
      bio: "Досвід 10 років. Якісно і в термін.",
      rating: 4.8,
      reviewCount: 24,
    },
  });

  const allServices = await db.service.findMany({ take: 6 });

  await db.masterService.createMany({
    data: allServices.map((s) => ({
      masterId: master.id,
      serviceId: s.id,
      price: Number(s.basePrice) * 1.1,
    })),
  });

  const today = new Date();
  for (let i = 1; i <= 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);

    const timeStart = new Date(date);
    timeStart.setHours(10, 0, 0, 0);

    const timeEnd = new Date(date);
    timeEnd.setHours(11, 0, 0, 0);

    await db.slot.create({
      data: {
        masterId: master.id,
        date: dateOnly,
        timeStart,
        timeEnd,
      },
    });
  }

  console.log("✅ Master and slots seeded");
}

async function fixMasterServices() {
  const masters = await db.master.findMany({
    where: { isActive: true, isVerified: true },
    include: {
      application: { select: { categories: true, serviceIds: true } },
      services: { select: { serviceId: true } },
    },
  });

  for (const master of masters) {
    const existingServiceIds = master.services.map((s) => s.serviceId);

    let serviceIds: string[] = [];

    if (master.application?.serviceIds?.length  && master.application.serviceIds.length > 0) {
      // Якщо є конкретні послуги в заявці
      serviceIds = master.application.serviceIds.filter(
        (id) => !existingServiceIds.includes(id)
      );
    } else if (master.application?.categories?.length && master.application.categories.length > 0) {
      // Якщо є тільки категорії
      const services = await db.service.findMany({
        where: {
          category: { in: master.application.categories },
          isActive: true,
        },
        select: { id: true },
      });
      serviceIds = services
        .map((s) => s.id)
        .filter((id) => !existingServiceIds.includes(id));
    }

    if (serviceIds.length > 0) {
      const services = await db.service.findMany({
        where: { id: { in: serviceIds } },
      });

      await db.masterService.createMany({
        data: services.map((s) => ({
          masterId: master.id,
          serviceId: s.id,
          price: Number(s.basePrice),
        })),
        skipDuplicates: true,
      });

      console.log(`✅ Fixed ${services.length} services for master ${master.id}`);
    }
  }

  console.log("✅ MasterService fix complete");
}

const command = process.argv[2];

if (command === "fix") {
  fixMasterServices()
    .catch(console.error)
    .finally(() => db.$disconnect());
} else {
  main()
    .catch(console.error)
    .finally(() => db.$disconnect());
}