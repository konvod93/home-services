"use client";

import { updateOrderStatus } from "@/lib/actions/master.actions";

interface Props {
  orderId: string;
  currentStatus: string;
  paymentStatus: string;
  hasQuote: boolean;
}

export default function OrderStatusForm({ orderId, currentStatus, paymentStatus, hasQuote }: Props) {
  if (currentStatus === "PENDING") {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => updateOrderStatus(orderId, "CONFIRMED")}
          className="bg-amber-400 hover:bg-amber-300 text-zinc-900 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Прийняти замовлення
        </button>
        <button
          onClick={() => updateOrderStatus(orderId, "CANCELLED")}
          className="bg-zinc-800 hover:bg-red-400/20 text-red-400 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Скасувати
        </button>
      </div>
    );
  }

  if (currentStatus === "CONFIRMED") {
    if (paymentStatus === "PENDING") {
      return (
        <div className="flex gap-2 flex-wrap items-center">
          {!hasQuote ? (
            <p className="text-zinc-500 text-xs">Заповніть калькуляцію щоб клієнт міг оплатити</p>
          ) : (
            <p className="text-zinc-500 text-xs">⏳ Очікування оплати від клієнта...</p>
          )}
          <button
            onClick={() => updateOrderStatus(orderId, "CANCELLED")}
            className="bg-zinc-800 hover:bg-red-400/20 text-red-400 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Скасувати
          </button>
        </div>
      );
    }

    if (paymentStatus === "HELD") {
      return (
        <button
          onClick={() => updateOrderStatus(orderId, "IN_PROGRESS")}
          className="bg-amber-400 hover:bg-amber-300 text-zinc-900 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Почати роботу
        </button>
      );
    }
  }

  if (currentStatus === "IN_PROGRESS") {
    return (
      <button
        onClick={() => updateOrderStatus(orderId, "DONE")}
        className="bg-green-500 hover:bg-green-400 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
      >
        Завершити роботу
      </button>
    );
  }

  return null;
}