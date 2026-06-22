import { db } from "@/lib/db";
import MasterBlockButton from "./MasterBlockButton";

export default async function AdminMastersPage() {
  const masters = await db.master.findMany({
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { orders: true, complaints: true } },
    },
    orderBy: { rating: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Майстри</h1>
        <span className="text-zinc-500 text-sm">{masters.length} всього</span>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Майстер</th>
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Рейтинг</th>
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Замовлень</th>
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Скарг</th>
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Статус</th>
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Дія</th>
            </tr>
          </thead>
          <tbody>
            {masters.map((master) => (
              <tr key={master.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-white text-sm font-medium">{master.user.name}</p>
                  <p className="text-zinc-500 text-xs">{master.user.email}</p>
                  {master.phone && (
                    <p className="text-zinc-500 text-xs">{master.phone}</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-amber-400 text-sm">
                    {master.rating > 0 ? `★ ${master.rating.toFixed(1)}` : "—"}
                  </span>
                  {master.reviewCount > 0 && (
                    <p className="text-zinc-600 text-xs">{master.reviewCount} відгуків</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-zinc-400 text-sm">{master._count.orders}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${master._count.complaints > 0 ? "text-red-400" : "text-zinc-600"}`}>
                    {master._count.complaints}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${master.isVerified ? "text-green-400 bg-green-400/10" : "text-zinc-500 bg-zinc-800"}`}>
                      {master.isVerified ? "Верифіковано" : "Не верифіковано"}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${master.isActive ? "text-blue-400 bg-blue-400/10" : "text-red-400 bg-red-400/10"}`}>
                      {master.isActive ? "Активний" : "Заблокований"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <MasterBlockButton masterId={master.id} isActive={master.isActive} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}