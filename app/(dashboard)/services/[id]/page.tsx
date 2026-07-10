import { db } from "@/lib/db";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const categoryLabels: Record<string, string> = {
  PLUMBING: "Сантехніка",
  ELECTRICAL: "Електрика",
  RENOVATION: "Ремонт",
  CLEANING: "Прибирання",
  FURNITURE: "Меблі",
  OTHER: "Інше",
};

function getLocationScore(
  master: { city?: string | null; district?: string | null; region?: string | null },
  user: { city?: string | null; district?: string | null; region?: string | null } | null
): number {
  if (!user) return 0;
  let score = 0;
  if (user.district && master.district?.toLowerCase() === user.district.toLowerCase()) score += 3;
  if (user.city && master.city?.toLowerCase() === user.city.toLowerCase()) score += 2;
  if (user.region && master.region?.toLowerCase() === user.region.toLowerCase()) score += 1;
  return score;
}

async function MastersList({
  serviceId,
  filterCity,
  userId,
}: {
  serviceId: string;
  filterCity: string;
  userId: string | null;
}) {
  const [user, service] = await Promise.all([
    userId
      ? db.user.findUnique({
          where: { id: userId },
          select: { city: true, district: true, region: true },
        })
      : Promise.resolve(null),
    db.service.findUnique({
      where: { id: serviceId },
      include: {
        masters: {
          where: {
            master: {
              isActive: true,
              isVerified: true,
              ...(filterCity
                ? { city: { contains: filterCity, mode: "insensitive" } }
                : {}),
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
    }),
  ]);

  if (!service) notFound();

  // Сортуємо за локацією — без дублюючого fallback запиту
  const sortedMasters = [...service.masters].sort((a, b) => {
    const scoreA = getLocationScore(a.master, user);
    const scoreB = getLocationScore(b.master, user);
    if (scoreB !== scoreA) return scoreB - scoreA;
    return (b.master.slots.length > 0 ? 1 : 0) - (a.master.slots.length > 0 ? 1 : 0);
  });

  if (sortedMasters.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
        <p className="text-zinc-500 mb-3">
          {filterCity
            ? `Майстрів у місті "${filterCity}" не знайдено`
            : "Поки немає доступних майстрів для цієї послуги"}
        </p>
        {filterCity && (
          <Link href={`/services/${serviceId}?all=true`} className="text-amber-400 hover:text-amber-300 text-sm transition-colors">
            Показати всіх майстрів →
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedMasters.map(({ master, price }) => {
        const score = getLocationScore(master, user);
        return (
          <div
            key={master.id}
            className={`bg-zinc-900 border rounded-2xl p-5 ${score >= 2 ? "border-amber-400/30" : "border-zinc-800"}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold">
                    <Link href={`/masters/${master.id}`} className="hover:text-amber-400 transition-colors">
                      {master.user.name}
                    </Link>
                  </h3>
                  {score >= 3 && master.district?.toLowerCase() === user?.district?.toLowerCase() && (
                    <span className="text-xs bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-full">ваш район</span>
                  )}
                  {master.district?.toLowerCase() !== user?.district?.toLowerCase() && score >= 2 && (
                    <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">ваше місто</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-amber-400 text-sm">
                    ★ {master.rating > 0 ? master.rating.toFixed(1) : "Новий"}
                  </span>
                  {master.reviewCount > 0 && (
                    <span className="text-zinc-600 text-sm">{master.reviewCount} відгуків</span>
                  )}
                </div>
                {master.bio && <p className="text-zinc-400 text-sm mt-2">{master.bio}</p>}
                {master.city && (
                  <p className="text-zinc-600 text-xs mt-1">
                    📍 {[master.district, master.city].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
              <span className="text-amber-400 font-bold text-lg">{price} ₴</span>
            </div>

            <Link href={`/masters/${master.id}`} className="text-xs text-zinc-500 hover:text-amber-400 transition-colors">
              Профіль та відгуки →
            </Link>

            {master.slots.length > 0 ? (
              <div className="mt-3">
                <p className="text-zinc-500 text-xs mb-2">Найближчі слоти:</p>
                <div className="flex flex-wrap gap-2">
                  {master.slots.map((slot) => (
                    <Link
                      key={slot.id}
                      href={`/order/new?serviceId=${serviceId}&masterId=${master.id}&slotId=${slot.id}`}
                      className="text-xs bg-zinc-800 hover:bg-amber-400 hover:text-zinc-900 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {new Date(slot.date).toLocaleDateString("uk-UA", { day: "numeric", month: "short" })}{" "}
                      {new Date(slot.timeStart).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-zinc-600 text-sm mt-3">Немає доступних слотів</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default async function ServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ city?: string; all?: string }>;
}) {
  const { id } = await params;
  const { city: cityFilter, all } = await searchParams;
  const session = await auth();

  const userCity = !all && session?.user?.id
    ? (await db.user.findUnique({
        where: { id: session.user.id },
        select: { city: true },
      }))?.city ?? ""
    : "";

  const filterCity = all ? "" : (cityFilter || userCity);

  const service = await db.service.findUnique({
    where: { id },
    select: { name: true, category: true, description: true, basePrice: true, unit: true },
  });

  if (!service) notFound();

  return (
    <div className="max-w-3xl">
      <Link
        href={`/services${filterCity ? `?city=${filterCity}` : ""}`}
        className="text-zinc-500 hover:text-white text-sm transition-colors mb-6 inline-flex items-center gap-1"
      >
        ← Всі послуги
      </Link>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
        <p className="text-amber-400 text-sm mb-1">{categoryLabels[service.category]}</p>
        <h1 className="text-2xl font-bold text-white mb-2">{service.name}</h1>
        {service.description && <p className="text-zinc-400 mb-4">{service.description}</p>}
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-white">{service.basePrice} ₴</span>
          <span className="text-zinc-500 text-sm">середня ринкова ціна, {service.unit}</span>
        </div>
        <p className="text-zinc-600 text-xs mt-2">
          Майстер встановлює власну ціну при складанні калькуляції
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Доступні майстри</h2>
        {filterCity && (
          <span className="text-zinc-500 text-sm">у місті {filterCity}</span>
        )}
      </div>

      <Suspense fallback={
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <p className="text-zinc-500">Завантаження майстрів...</p>
        </div>
      }>
        <MastersList
          serviceId={id}
          filterCity={filterCity}
          userId={session?.user?.id ?? null}
        />
      </Suspense>
    </div>
  );
}