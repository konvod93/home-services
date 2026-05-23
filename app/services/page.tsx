import { db } from "@/lib/db";
import Link from "next/link";

const categoryLabels: Record<string, string> = {
  PLUMBING: "Сантехника",
  ELECTRICAL: "Электрика",
  RENOVATION: "Ремонт",
  CLEANING: "Уборка",
  FURNITURE: "Мебель",
  OTHER: "Другое",
};

const categoryEmoji: Record<string, string> = {
  PLUMBING: "🚿",
  ELECTRICAL: "⚡",
  RENOVATION: "🏠",
  CLEANING: "🧹",
  FURNITURE: "🪑",
  OTHER: "🔧",
};

export default async function ServicesPage() {
  const services = await db.service.findMany({
    where: { isActive: true },
    orderBy: { category: "asc" },
  });

  const grouped = services.reduce<Record<string, typeof services>>(
    (acc, service) => {
      if (!acc[service.category]) acc[service.category] = [];
      acc[service.category].push(service);
      return acc;
    },
    {}
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Услуги</h1>
        <p className="text-zinc-500 mt-1">Выберите нужную услугу и вызовите мастера</p>
      </div>

      <div className="space-y-10">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>{categoryEmoji[category]}</span>
              <span>{categoryLabels[category]}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((service) => (
                <div
                  key={service.id}
                  className="bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 rounded-2xl p-5 transition-all group"
                >
                  <h3 className="text-white font-medium mb-1">{service.name}</h3>
                  <p className="text-zinc-500 text-sm mb-4">{service.unit}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-semibold">
                      от {service.basePrice} ₴
                    </span>
                    <Link
                      href={`/services/${service.id}`}
                      className="text-sm bg-amber-400 hover:bg-amber-300 text-zinc-900 font-medium px-4 py-1.5 rounded-lg transition-colors"
                    >
                      Заказать
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}