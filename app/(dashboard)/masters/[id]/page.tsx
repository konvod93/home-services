import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const categoryLabels: Record<string, string> = {
  PLUMBING: "Сантехніка",
  ELECTRICAL: "Електрика",
  RENOVATION: "Ремонт",
  CLEANING: "Прибирання",
  FURNITURE: "Меблі",
  OTHER: "Інше",
};

export default async function MasterProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const master = await db.master.findUnique({
    where: { id },
    include: {
      user: { select: { name: true } },
      services: { include: { service: true } },
      orders: {
        where: { status: "DONE" },
        include: {
          review: true,
          client: { select: { name: true } },
          items: { include: { service: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!master || !master.isActive || !master.isVerified) notFound();

  const reviews = master.orders
    .filter((o) => o.review)
    .map((o) => ({ ...o.review!, clientName: o.client.name, serviceName: o.items[0]?.service.name }));

  const categories = [...new Set(master.services.map((s) => s.service.category))];

  return (
    <div className="max-w-2xl">
      <Link
        href="/services"
        className="text-zinc-500 hover:text-white text-sm transition-colors mb-6 inline-flex items-center gap-1"
      >
        ← До послуг
      </Link>

      {/* Шапка профілю */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center text-zinc-900 font-bold text-2xl shrink-0">
            {master.user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">{master.user.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              {master.rating > 0 ? (
                <span className="text-amber-400 font-medium">
                  ★ {master.rating.toFixed(1)}
                </span>
              ) : (
                <span className="text-zinc-500 text-sm">Новий майстер</span>
              )}
              {master.reviewCount > 0 && (
                <span className="text-zinc-500 text-sm">{master.reviewCount} відгуків</span>
              )}
              <span className="text-green-400 text-xs bg-green-400/10 px-2 py-0.5 rounded-full">
                ✓ Верифіковано
              </span>
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {categories.map((cat) => (
                <span key={cat} className="text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
                  {categoryLabels[cat]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {master.bio && (
          <p className="text-zinc-400 text-sm mt-4 border-t border-zinc-800 pt-4">
            {master.bio}
          </p>
        )}
        {master.city && (
          <p className="text-zinc-600 text-xs mt-2">
            📍 {[master.district, master.city, master.region].filter(Boolean).join(", ")}
          </p>
        )}
      </div>

      {/* Послуги */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-4">Послуги та ціни</h2>
        <div className="space-y-2">
          {master.services.map(({ service, price }) => (
            <div key={service.id} className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">{service.name}</span>
              <span className="text-amber-400 font-medium">{price} ₴ <span className="text-zinc-600">{service.unit}</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Відгуки */}
      <div>
        <h2 className="text-white font-semibold mb-4">
          Відгуки
          {reviews.length > 0 && (
            <span className="text-zinc-500 font-normal text-sm ml-2">{reviews.length} шт.</span>
          )}
        </h2>

        {reviews.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
            <p className="text-zinc-500">Відгуків поки немає</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-white text-sm font-medium">{review.clientName}</p>
                    <p className="text-zinc-600 text-xs">{review.serviceName}</p>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={star <= review.rating ? "text-amber-400" : "text-zinc-700"}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {review.comment && (
                  <p className="text-zinc-400 text-sm">{review.comment}</p>
                )}

                {review.photos.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {review.photos.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                        <Image
                          src={url}
                          alt={`Фото ${i + 1}`}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover border border-zinc-700 hover:border-amber-400 transition-colors"
                        />
                      </a>
                    ))}
                  </div>
                )}

                <p className="text-zinc-600 text-xs mt-2">
                  {new Date(review.createdAt).toLocaleDateString("uk-UA", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}