import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  await db.service.createMany({
    data: [
      { name: "Замена смесителя", category: "PLUMBING", basePrice: 800, unit: "за выезд" },
      { name: "Устранение засора", category: "PLUMBING", basePrice: 600, unit: "за выезд" },
      { name: "Установка унитаза", category: "PLUMBING", basePrice: 1500, unit: "за выезд" },
      { name: "Замена труб", category: "PLUMBING", basePrice: 500, unit: "за метр" },
      { name: "Замена розетки / выключателя", category: "ELECTRICAL", basePrice: 400, unit: "за штуку" },
      { name: "Установка люстры", category: "ELECTRICAL", basePrice: 700, unit: "за выезд" },
      { name: "Прокладка кабеля", category: "ELECTRICAL", basePrice: 300, unit: "за метр" },
      { name: "Замена электрощитка", category: "ELECTRICAL", basePrice: 3000, unit: "за выезд" },
      { name: "Поклейка обоев", category: "RENOVATION", basePrice: 200, unit: "за м²" },
      { name: "Укладка плитки", category: "RENOVATION", basePrice: 800, unit: "за м²" },
      { name: "Шпаклёвка стен", category: "RENOVATION", basePrice: 150, unit: "за м²" },
      { name: "Установка дверей", category: "RENOVATION", basePrice: 2500, unit: "за дверь" },
      { name: "Генеральная уборка", category: "CLEANING", basePrice: 3000, unit: "за выезд" },
      { name: "Уборка после ремонта", category: "CLEANING", basePrice: 5000, unit: "за выезд" },
      { name: "Мытьё окон", category: "CLEANING", basePrice: 200, unit: "за окно" },
      { name: "Сборка кухни", category: "FURNITURE", basePrice: 5000, unit: "за выезд" },
      { name: "Сборка шкафа", category: "FURNITURE", basePrice: 1500, unit: "за выезд" },
      { name: "Сборка кровати", category: "FURNITURE", basePrice: 1000, unit: "за выезд" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Services seeded");

  const masterUser = await db.user.create({
    data: {
      name: "Александр Петров",
      email: "master@homefix.com",
      password: await bcrypt.hash("master123", 12),
      role: "MASTER",
    },
  });

  const master = await db.master.create({
    data: {
      userId: masterUser.id,
      bio: "Опыт 10 лет. Качественно и в срок.",
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

main()
  .catch(console.error)
  .finally(() => db.$disconnect());