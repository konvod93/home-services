import { db } from "@/lib/db";
import { auth } from "@/auth";
import Link from "next/link";

const categoryLabels: Record<string, string> = {
  PLUMBING: "Сантехніка",
  ELECTRICAL: "Електрика",
  RENOVATION: "Ремонт",
  CLEANING: "Прибирання",
  FURNITURE: "Меблі",
  OTHER: "Інше",
};

const categoryEmoji: Record<string, string> = {
  PLUMBING: "🚿",
  ELECTRICAL: "⚡",
  RENOVATION: "🏠",
  CLEANING: "🧹",
  FURNITURE: "🪑",
  OTHER: "🔧",
};

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; all?: string }>;
}) {
  const session = await auth();
  const { city: cityFilter, all } = await searchParams;
  
  const userCity = !all && session?.user?.id
  ? (await db.user.findUnique({
      where: { id: session.user.id },
      select: { city: true },
    }))?.city ?? ""
  : "";

  const filterCity = all ? "" : (cityFilter || userCity);

  const services = await db.service.findMany({
    where: { isActive: true },
    orderBy: { category: "asc" },
    include: {
      masters: {
        where: {
          master: {
            isActive: true,
            isVerified: true,
            ...(filterCity ? { city: { contains: filterCity, mode: "insensitive" } } : {}),
          },
        },
      },
    },
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
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Послуги</h1>
          <p className="text-zinc-500 mt-1">Оберіть потрібну послугу та викличте майстра</p>
        </div>

        <form className="flex gap-2">
          <input
            name="city"
            type="text"
            defaultValue={filterCity}
            placeholder="Фільтр за містом..."
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
          />
          <button
            type="submit"
            className="bg-amber-400 hover:bg-amber-300 text-zinc-900 font-medium px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Знайти
          </button>
          {filterCity && (

            <Link href="/services"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-medium px-4 py-2 rounded-lg text-sm transition-colors"
            >
              ✕
            </Link>
          )}
        </form>
      </div>

      {filterCity && (
        <p className="text-zinc-500 text-sm mb-6">
          Показано майстрів у місті: <span className="text-white">{filterCity}</span>
        </p>
      )}

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
                  className="bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 rounded-2xl p-5 transition-all"
                >
                  <h3 className="text-white font-medium mb-1">{service.name}</h3>
                  <p className="text-zinc-500 text-sm mb-4">{service.unit}</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-amber-400 font-semibold">
                        середня ціна {service.basePrice} ₴
                      </span>
                      {service.masters.length > 0 && (
                        <p className="text-zinc-600 text-xs mt-0.5">
                          {service.masters.length} майстр{service.masters.length === 1 ? "" : "ів"}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/services/${service.id}${filterCity ? `?city=${filterCity}` : ""}`}
                      className="text-sm bg-amber-400 hover:bg-amber-300 text-zinc-900 font-medium px-4 py-1.5 rounded-lg transition-colors"
                    >
                      Замовити
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