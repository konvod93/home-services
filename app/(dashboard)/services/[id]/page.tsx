import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

const categoryLabels: Record<string, string> = {
  PLUMBING: "Сантехника",
  ELECTRICAL: "Электрика",
  RENOVATION: "Ремонт",
  CLEANING: "Уборка",
  FURNITURE: "Мебель",
  OTHER: "Другое",
};

export default async function ServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const service = await db.service.findUnique({
    where: { id },
    include: {
      masters: {
        where: {
          master: {
            isActive: true,
            isVerified: true,
          },
        },
        include: {
          master: {
            include: {
              user: { select: { name: true } },
              slots: {
                where: { isBusy: false, date: { gte: new Date() } },
                orderBy: { date: "asc" },
                take: 5,
              },
            },
          },
        },
      },
    },
  });

  if (!service) notFound();

  return (
    <div className="max-w-3xl">
      {/* Назад */}
      <Link
        href="/services"
        className="text-zinc-500 hover:text-white text-sm transition-colors mb-6 inline-flex items-center gap-1"
      >
        ← Все услуги
      </Link>

      {/* Заголовок */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
        <p className="text-amber-400 text-sm mb-1">
          {categoryLabels[service.category]}
        </p>
        <h1 className="text-2xl font-bold text-white mb-2">{service.name}</h1>
        {service.description && (
          <p className="text-zinc-400 mb-4">{service.description}</p>
        )}
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-white">
            от {service.basePrice} ₴
          </span>
          <span className="text-zinc-500 text-sm">{service.unit}</span>
        </div>
      </div>

      {/* Мастера */}
      <h2 className="text-lg font-semibold text-white mb-4">
        Доступные мастера
      </h2>

      {service.masters.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <p className="text-zinc-500">
            Пока нет доступных мастеров для этой услуги
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {service.masters.map(({ master, price }) => (
            <div
              key={master.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold">
                    {master.user.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-amber-400 text-sm">
                      ★ {master.rating > 0 ? master.rating.toFixed(1) : "Новый"}
                    </span>
                    {master.reviewCount > 0 && (
                      <span className="text-zinc-600 text-sm">
                        {master.reviewCount} отзывов
                      </span>
                    )}
                  </div>
                  {master.bio && (
                    <p className="text-zinc-400 text-sm mt-2">{master.bio}</p>
                  )}
                </div>
                <span className="text-amber-400 font-bold text-lg">
                  {price} ₴
                </span>
              </div>

              {/* Слоты */}
              {master.slots.length > 0 ? (
                <div>
                  <p className="text-zinc-500 text-xs mb-2">Ближайшие слоты:</p>
                  <div className="flex flex-wrap gap-2">
                    {master.slots.map((slot) => (
                      <Link
                        key={slot.id}
                        href={`/order/new?serviceId=${service.id}&masterId=${master.id}&slotId=${slot.id}`}
                        className="text-xs bg-zinc-800 hover:bg-amber-400 hover:text-zinc-900 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {new Date(slot.date).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        {new Date(slot.timeStart).toLocaleTimeString("ru-RU", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-zinc-600 text-sm">Нет доступных слотов</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}