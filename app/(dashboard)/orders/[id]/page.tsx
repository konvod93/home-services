import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import ComplaintForm from "./ComplaintForm";
import LiqpayButton from "@/components/shared/LiqpayButton";
import { createPaymentParams } from "@/lib/liqpay";
import ConfirmOrderButton from "./ConfirmOrderButton";
import ClientCancelButton from "./ClientCancelButton";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  PENDING: "Очікує підтвердження",
  CONFIRMED: "Підтверджено",
  IN_PROGRESS: "Майстер виконує роботу",
  DONE: "Виконано",
  CANCELLED: "Скасовано",
};

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  CONFIRMED: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  IN_PROGRESS: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  DONE: "text-green-400 bg-green-400/10 border-green-400/20",
  CANCELLED: "text-red-400 bg-red-400/10 border-red-400/20",
};

const paymentStatusLabels: Record<string, string> = {
  PENDING: "Очікує оплати",
  HELD: "Кошти заморожено",
  RELEASED: "Оплачено",
  REFUNDED: "Повернено",
  DISPUTED: "Спір",
};

const paymentStatusColors: Record<string, string> = {
  PENDING: "text-zinc-400",
  HELD: "text-blue-400",
  RELEASED: "text-green-400",
  REFUNDED: "text-amber-400",
  DISPUTED: "text-red-400",
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
      master: {
        select: {
          phone: true,
          user: { select: { name: true, phone: true } },
        },
      },
      slot: true,
      review: true,
      complaint: true,
      quote: true,
    },
  });

  if (!order || order.clientId !== session.user.id) notFound();

  const { data, signature } = createPaymentParams({
    id: order.id,
    totalPrice: order.quote?.totalPrice ?? order.totalPrice,
    description: `Оплата замовлення: ${order.items[0]?.service.name}`,
  });

  return (
    <div className="max-w-xl">
      <Link
        href="/orders"
        className="text-zinc-500 hover:text-white text-sm transition-colors mb-6 inline-flex items-center gap-1"
      >
        ← Всі замовлення
      </Link>

      <h1 className="text-2xl font-bold text-white mb-6">Замовлення</h1>

      {/* Статус */}
      <div className={`border rounded-2xl p-4 mb-4 ${statusColors[order.status]}`}>
        <p className="font-semibold">{statusLabels[order.status]}</p>
      </div>

      {/* Статус оплаты */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6 flex items-center justify-between">
        <span className="text-zinc-500 text-sm">Статус оплати</span>
        <span className={`text-sm font-medium ${paymentStatusColors[order.paymentStatus]}`}>
          {paymentStatusLabels[order.paymentStatus]}
        </span>
      </div>

      {/* Детали */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 mb-6">
        {order.items.map((item: { id: string; service: { name: string }; price: number | string }) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-zinc-400">{item.service.name}</span>
            <span className="text-white">{String(item.price)} ₴</span>
          </div>
        ))}
        <div className="border-t border-zinc-800 pt-4 flex justify-between">
          <span className="text-zinc-500">Разом</span>
          <span className="text-amber-400 font-bold text-lg">{order.totalPrice} ₴</span>
        </div>
        {order.commissionPct > 0 && (
          <p className="text-zinc-600 text-xs">
            Комісія сервісу {order.commissionPct}% включена
          </p>
        )}
      </div>

      {/* Смета */}
      {order.quote && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6">
          <h2 className="text-white font-semibold mb-4">Калькуляція від майстра</h2>
          <div className="space-y-2">
            {(order.quote.items as Array<{ name: string; quantity: number; unit: string; price: number }>).map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">{item.name}</span>
                <span className="text-zinc-500 text-xs mx-2">{item.quantity} {item.unit} × {item.price} ₴</span>
                <span className="text-white">{(item.quantity * item.price).toFixed(2)} ₴</span>
              </div>
            ))}
          </div>
          {order.quote.comment && (
            <p className="text-zinc-500 text-xs mt-3 border-t border-zinc-800 pt-3">{order.quote.comment}</p>
          )}
          <div className="border-t border-zinc-800 pt-3 mt-3 flex justify-between">
            <span className="text-zinc-500">Разом</span>
            <span className="text-amber-400 font-bold text-lg">{order.quote.totalPrice} ₴</span>
          </div>
        </div>
      )}

      {/* Информация */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Майстер</span>
          <span className="text-white">{order.master.user.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Дата</span>
          <span className="text-white">
            {new Date(order.slot.date).toLocaleDateString("uk-UA", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Час</span>
          <span className="text-white">
            {new Date(order.slot.timeStart).toLocaleTimeString("uk-UA", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Адреса</span>
          <span className="text-white">{order.address}</span>
        </div>
        {order.comment && (
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Коментар</span>
            <span className="text-white max-w-xs text-right">{order.comment}</span>
          </div>
        )}
      </div>

      {/* Контакти майстра після оплати */}
      {order.paymentStatus === "HELD" && (
        <div className="bg-zinc-900 border border-amber-400/20 rounded-2xl p-5 mb-6">
          <h2 className="text-white font-semibold mb-3">Контакти майстра</h2>
          <p className="text-zinc-400 text-sm mb-1">{order.master.user.name}</p>
          {order.master.phone ? (<a

            href={`tel:${order.master.phone}`}
            className="text-amber-400 font-medium hover:text-amber-300 transition-colors"
          >
            {order.master.phone}
          </a>
          ) : (
            <p className="text-zinc-500 text-sm">Телефон не вказано</p>
          )}
          <p className="text-zinc-600 text-xs mt-3">
            Якщо майстер не з’явився вчасно —{" "}
            <a href="mailto:admin@homefix.com" className="text-zinc-400 hover:text-white transition-colors">
              зв’яжіться з адміністратором
            </a>
          </p>
        </div>
      )}

      {/* Кнопка оплаты */}
      {order.status === "CONFIRMED" && order.paymentStatus === "PENDING" && order.quote && (
        <div className="mb-4">
          <LiqpayButton data={data} signature={signature} />
        </div>
      )}

      {!order.quote && order.status === "CONFIRMED" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4">
          <p className="text-zinc-500 text-sm">⏳ Очікуємо калькуляцію від майстра...</p>
        </div>
      )}

      {/* Подтверждение выполнения */}
      {order.status === "DONE" && order.paymentStatus === "HELD" && !order.complaint && (
        <div className="space-y-3 mb-4">
          <ConfirmOrderButton orderId={order.id} />
        </div>
      )}

      {/* Отзыв */}
      {order.status === "DONE" && order.paymentStatus === "RELEASED" && !order.review && (
        <Link
          href={`/orders/${order.id}/review`}
          className="block w-full text-center bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold rounded-lg py-2.5 transition-colors mb-4"
        >
          Залишити відгук
        </Link>
      )}

      {/* Жалоба */}
      {order.status === "DONE" && order.paymentStatus === "HELD" && !order.complaint && (
        <ComplaintForm orderId={order.id} />
      )}

      {/* Отмена клиентом */}
      {order.paymentStatus === "HELD" && order.status !== "DONE" && order.status !== "CANCELLED" && !order.complaint && (
        <ClientCancelButton orderId={order.id} />
      )}

      {order.complaint && (
        <p className="text-zinc-600 text-sm text-center mt-4">
          Скаргу подано {new Date(order.complaint.createdAt).toLocaleDateString("uk-UA")}
        </p>
      )}
    </div>
  );
}