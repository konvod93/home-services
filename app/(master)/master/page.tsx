import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import OrderStatusForm from "./OrderStatusForm";
import Link from "next/link";

const statusLabels: Record<string, string> = {
  PENDING: "Ожидает",
  CONFIRMED: "Подтверждён",
  IN_PROGRESS: "В работе",
  DONE: "Завершён",
  CANCELLED: "Отменён",
};

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-400/10",
  CONFIRMED: "text-blue-400 bg-blue-400/10",
  IN_PROGRESS: "text-amber-400 bg-amber-400/10",
  DONE: "text-green-400 bg-green-400/10",
  CANCELLED: "text-red-400 bg-red-400/10",
};

export default async function MasterPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "MASTER") redirect("/dashboard");

  const master = await db.master.findUnique({
    where: { userId: session.user.id },
  });

  if (!master) redirect("/dashboard");

  const orders = await db.order.findMany({
    where: { masterId: master.id },
    include: {
      items: { include: { service: true } },
      client: { select: { name: true, phone: true } },
      slot: true,
      quote: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const pending = orders.filter((o) => o.status === "PENDING");
  const active = orders.filter((o) => ["CONFIRMED", "IN_PROGRESS"].includes(o.status));
  const done = orders.filter((o) => ["DONE", "CANCELLED"].includes(o.status));

  return (
    <div className="bg-zinc-950">
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <p className="text-zinc-500 text-xs mb-1">Новых</p>
            <p className="text-2xl font-bold text-yellow-400">{pending.length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <p className="text-zinc-500 text-xs mb-1">Активных</p>
            <p className="text-2xl font-bold text-amber-400">{active.length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <p className="text-zinc-500 text-xs mb-1">Готово</p>
            <p className="text-2xl font-bold text-green-400">{done.length}</p>
          </div>
        </div>

        {/* Новые заказы */}
        {pending.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Новые заказы</h2>
            <div className="space-y-4">
              {pending.map((order) => (
                <div key={order.id} className="bg-zinc-900 border border-yellow-400/20 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-white font-medium">{order.items[0]?.service.name}</p>
                      <p className="text-zinc-500 text-sm mt-0.5">Клиент: {order.client.name}</p>
                      {order.client.phone && (
                        <p className="text-zinc-500 text-sm">{order.client.phone}</p>
                      )}
                    </div>
                    <span className="text-amber-400 font-bold">{order.totalPrice} ₴</span>
                  </div>
                  <div className="text-sm text-zinc-400 mb-4">
                    <p>📍 {order.address}</p>
                    <p>🗓 {new Date(order.slot.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })} в {new Date(order.slot.timeStart).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}</p>
                    {order.comment && <p>💬 {order.comment}</p>}
                  </div>
                  <OrderStatusForm orderId={order.id} currentStatus={order.status} paymentStatus={order.paymentStatus} hasQuote={!!order.quote} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Активные заказы */}
        {active.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Активные заказы</h2>
            <div className="space-y-4">
              {active.map((order) => (
                <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-medium">{order.items[0]?.service.name}</p>
                      <p className="text-zinc-500 text-sm">{order.client.name}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm mb-4">📍 {order.address}</p>

                  <div className="flex gap-2 flex-wrap">
                    {order.status === "CONFIRMED" && (
                      <Link
                        href={`/master/orders/${order.id}/quote`}
                        className="text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        {order.quote ? "Переглянути калькуляцію" : "Заповнити калькуляцію"}
                      </Link>
                    )}
                    <OrderStatusForm
                      orderId={order.id}
                      currentStatus={order.status}
                      paymentStatus={order.paymentStatus}
                      hasQuote={!!order.quote}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* История */}
        {done.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">История</h2>
            <div className="space-y-3">
              {done.map((order) => (
                <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">{order.items[0]?.service.name}</p>
                    <p className="text-zinc-500 text-xs">{order.client.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-amber-400 text-sm font-semibold">{order.totalPrice} ₴</span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {orders.length === 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
            <p className="text-zinc-500">Заказов пока нет</p>
          </div>
        )}
      </main>
    </div>
  );
}