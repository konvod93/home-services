import { db } from "@/lib/db";
import DisputeActions from "./DisputeActions";

const statusLabels: Record<string, string> = {
  PENDING: "Очікує",
  CONFIRMED: "Підтверджено",
  IN_PROGRESS: "В роботі",
  DONE: "Завершено",
  CANCELLED: "Скасовано",
};

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-400/10",
  CONFIRMED: "text-blue-400 bg-blue-400/10",
  IN_PROGRESS: "text-amber-400 bg-amber-400/10",
  DONE: "text-green-400 bg-green-400/10",
  CANCELLED: "text-red-400 bg-red-400/10",
};

const paymentStatusLabels: Record<string, string> = {
  PENDING: "Очікує оплати",
  HELD: "Заморожено",
  RELEASED: "Оплачено",
  REFUNDED: "Повернено",
  DISPUTED: "Спір",
};

const paymentStatusColors: Record<string, string> = {
  PENDING: "text-zinc-400 bg-zinc-800",
  HELD: "text-blue-400 bg-blue-400/10",
  RELEASED: "text-green-400 bg-green-400/10",
  REFUNDED: "text-amber-400 bg-amber-400/10",
  DISPUTED: "text-red-400 bg-red-400/10",
};

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: {
      client: { select: { name: true, email: true } },
      master: { include: { user: { select: { name: true } } } },
      items: { include: { service: true } },
      slot: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    done: orders.filter((o) => o.status === "DONE").length,
    revenue: orders
      .filter((o) => o.paymentStatus === "RELEASED")
      .reduce((sum, o) => sum + Number(o.totalPrice) * (o.commissionPct / 100), 0),
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Замовлення</h1>
        <span className="text-zinc-500 text-sm">{stats.total} всього</span>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <p className="text-zinc-500 text-xs mb-1">Всього</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <p className="text-zinc-500 text-xs mb-1">Нових</p>
          <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <p className="text-zinc-500 text-xs mb-1">Завершених</p>
          <p className="text-2xl font-bold text-green-400">{stats.done}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <p className="text-zinc-500 text-xs mb-1">Дохід платформи</p>
          <p className="text-2xl font-bold text-amber-400">{stats.revenue.toFixed(2)} ₴</p>
          <p className="text-zinc-600 text-xs mt-1">комісія з виконаних замовлень</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Послуга</th>
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Клієнт</th>
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Майстер</th>
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Дата</th>
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Комісія</th>
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Статус</th>
              <th className="text-left text-zinc-500 text-xs font-medium px-6 py-4">Дії</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-white text-sm">{order.items[0]?.service.name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-zinc-300 text-sm">{order.client.name}</p>
                  <p className="text-zinc-500 text-xs">{order.client.email}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-zinc-300 text-sm">{order.master.user.name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-zinc-400 text-sm">
                    {new Date(order.slot.date).toLocaleDateString("uk-UA", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-amber-400 text-sm font-medium">
                    {(Number(order.totalPrice) * (order.commissionPct / 100)).toFixed(2)} ₴
                  </p>
                  <p className="text-zinc-600 text-xs">{order.totalPrice} ₴ всього</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full w-fit ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full w-fit ${paymentStatusColors[order.paymentStatus]}`}>
                      {paymentStatusLabels[order.paymentStatus]}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {order.paymentStatus === "DISPUTED" && (
                    <DisputeActions orderId={order.id} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-zinc-500">Замовлень поки немає</p>
          </div>
        )}
      </div>
    </div>
  );
}