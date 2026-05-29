import { db } from "@/lib/db";
import ServiceToggle from "./ServiceToggle";

const categoryLabels: Record<string, string> = {
  PLUMBING: "Сантехника",
  ELECTRICAL: "Электрика",
  RENOVATION: "Ремонт",
  CLEANING: "Уборка",
  FURNITURE: "Мебель",
  OTHER: "Другое",
};

export default async function AdminServicesPage() {
  const services = await db.service.findMany({
    orderBy: { category: "asc" },
    include: {
      _count: { select: { orderItems: true, masters: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Услуги</h1>
        <span className="text-zinc-500 text-sm">{services.length} всего</span>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Услуга</th>
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Категория</th>
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Цена</th>
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Мастеров</th>
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Заказов</th>
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Статус</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-white text-sm font-medium">{service.name}</p>
                  <p className="text-zinc-500 text-xs">{service.unit}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-zinc-400 text-sm">{categoryLabels[service.category]}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-amber-400 text-sm">{service.basePrice} ₴</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-zinc-400 text-sm">{service._count.masters}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-zinc-400 text-sm">{service._count.orderItems}</span>
                </td>
                <td className="px-6 py-4">
                  <ServiceToggle serviceId={service.id} isActive={service.isActive} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}