import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  await db.service.createMany({
    data: [
      // Сантехника
      { name: "Замена смесителя", category: "PLUMBING", basePrice: 800, unit: "за выезд" },
      { name: "Устранение засора", category: "PLUMBING", basePrice: 600, unit: "за выезд" },
      { name: "Установка унитаза", category: "PLUMBING", basePrice: 1500, unit: "за выезд" },
      { name: "Замена труб", category: "PLUMBING", basePrice: 500, unit: "за метр" },

      // Электрика
      { name: "Замена розетки / выключателя", category: "ELECTRICAL", basePrice: 400, unit: "за штуку" },
      { name: "Установка люстры", category: "ELECTRICAL", basePrice: 700, unit: "за выезд" },
      { name: "Прокладка кабеля", category: "ELECTRICAL", basePrice: 300, unit: "за метр" },
      { name: "Замена электрощитка", category: "ELECTRICAL", basePrice: 3000, unit: "за выезд" },

      // Ремонт
      { name: "Поклейка обоев", category: "RENOVATION", basePrice: 200, unit: "за м²" },
      { name: "Укладка плитки", category: "RENOVATION", basePrice: 800, unit: "за м²" },
      { name: "Шпаклёвка стен", category: "RENOVATION", basePrice: 150, unit: "за м²" },
      { name: "Установка дверей", category: "RENOVATION", basePrice: 2500, unit: "за дверь" },

      // Уборка
      { name: "Генеральная уборка", category: "CLEANING", basePrice: 3000, unit: "за выезд" },
      { name: "Уборка после ремонта", category: "CLEANING", basePrice: 5000, unit: "за выезд" },
      { name: "Мытьё окон", category: "CLEANING", basePrice: 200, unit: "за окно" },

      // Мебель
      { name: "Сборка кухни", category: "FURNITURE", basePrice: 5000, unit: "за выезд" },
      { name: "Сборка шкафа", category: "FURNITURE", basePrice: 1500, unit: "за выезд" },
      { name: "Сборка кровати", category: "FURNITURE", basePrice: 1000, unit: "за выезд" },
    ],
  });

  console.log("✅ Services seeded");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());