import { db } from "@/lib/db";

const roleLabels: Record<string, string> = {
  CLIENT: "Клиент",
  MASTER: "Мастер",
  ADMIN: "Админ",
};

const roleColors: Record<string, string> = {
  CLIENT: "text-zinc-400 bg-zinc-400/10",
  MASTER: "text-amber-400 bg-amber-400/10",
  ADMIN: "text-red-400 bg-red-400/10",
};

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    include: {
      master: {
        select: { isVerified: true, rating: true, reviewCount: true },
      },
      _count: {
        select: { orders: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Пользователи</h1>
        <span className="text-zinc-500 text-sm">{users.length} всего</span>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Пользователь</th>
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Роль</th>
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Заказов</th>
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Мастер</th>
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Дата</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-white text-sm font-medium">{user.name}</p>
                  <p className="text-zinc-500 text-xs">{user.email}</p>
                  {user.phone && <p className="text-zinc-600 text-xs">{user.phone}</p>}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleColors[user.role]}`}>
                    {roleLabels[user.role]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-zinc-400 text-sm">{user._count.orders}</span>
                </td>
                <td className="px-6 py-4">
                  {user.master ? (
                    <div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${user.master.isVerified ? "text-green-400 bg-green-400/10" : "text-yellow-400 bg-yellow-400/10"}`}>
                        {user.master.isVerified ? "Верифицирован" : "Не верифицирован"}
                      </span>
                      {user.master.rating > 0 && (
                        <p className="text-zinc-500 text-xs mt-1">★ {user.master.rating.toFixed(1)} ({user.master.reviewCount})</p>
                      )}
                    </div>
                  ) : (
                    <span className="text-zinc-700 text-xs">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-zinc-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}