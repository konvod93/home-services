import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
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

export default async function OrdersPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const orders = await db.order.findMany({
    where: { clientId: session.user.id },
    include: {
      items: {
        include: { service: true },
      },
      master: {
        include: { user: { select: { name: true } } },
      },
      slot: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Мои заказы</h1>

      {orders.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
          <p className="text-zinc-500 mb-4">У вас пока нет заказов</p>
          <Link
            href="/services"
            className="bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold px-6 py-2.5 rounded-lg transition-colors inline-block"
          >
            Вызвать мастера
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 rounded-2xl p-5 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-medium">
                    {order.items[0]?.service.name}
                  </p>
                  <p className="text-zinc-500 text-sm mt-0.5">
                    Мастер: {order.master.user.name}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                  {statusLabels[order.status]}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">
                  {new Date(order.slot.date).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                  })}
                </span>
                <span className="text-amber-400 font-semibold">
                  {order.totalPrice} ₴
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}