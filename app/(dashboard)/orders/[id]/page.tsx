import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

const statusLabels: Record<string, string> = {
  PENDING: "Ожидает подтверждения",
  CONFIRMED: "Подтверждён",
  IN_PROGRESS: "Мастер в пути",
  DONE: "Завершён",
  CANCELLED: "Отменён",
};

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  CONFIRMED: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  IN_PROGRESS: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  DONE: "text-green-400 bg-green-400/10 border-green-400/20",
  CANCELLED: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: { include: { service: true } },
      master: { include: { user: { select: { name: true, phone: true } } } },
      slot: true,
      review: true,
    },
  });

  if (!order || order.clientId !== session.user.id) notFound();

  return (
    <div className="max-w-xl">
      <Link
        href="/orders"
        className="text-zinc-500 hover:text-white text-sm transition-colors mb-6 inline-flex items-center gap-1"
      >
        ← Все заказы
      </Link>

      <h1 className="text-2xl font-bold text-white mb-6">Заказ</h1>

      {/* Статус */}
      <div className={`border rounded-2xl p-4 mb-6 ${statusColors[order.status]}`}>
        <p className="font-semibold">{statusLabels[order.status]}</p>
      </div>

      {/* Детали */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 mb-6">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-zinc-400">{item.service.name}</span>
            <span className="text-white">{item.price} ₴</span>
          </div>
        ))}

        <div className="border-t border-zinc-800 pt-4 flex justify-between">
          <span className="text-zinc-500">Итого</span>
          <span className="text-amber-400 font-bold text-lg">{order.totalPrice} ₴</span>
        </div>
      </div>

      {/* Информация */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Мастер</span>
          <span className="text-white">{order.master.user.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Дата</span>
          <span className="text-white">
            {new Date(order.slot.date).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Время</span>
          <span className="text-white">
            {new Date(order.slot.timeStart).toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Адрес</span>
          <span className="text-white">{order.address}</span>
        </div>
        {order.comment && (
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Комментарий</span>
            <span className="text-white max-w-xs text-right">{order.comment}</span>
          </div>
        )}
      </div>

      {/* Отзыв — если заказ завершён и отзыва нет */}
      {order.status === "DONE" && !order.review && (
        <Link
          href={`/orders/${order.id}/review`}
          className="block w-full text-center bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold rounded-lg py-2.5 transition-colors"
        >
          Оставить отзыв
        </Link>
      )}
    </div>
  );
}