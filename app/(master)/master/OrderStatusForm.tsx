"use client";

import { updateOrderStatus } from "@/lib/actions/master.actions";

const nextStatus: Record<string, { label: string; value: string }> = {
  PENDING: { label: "Принять заказ", value: "CONFIRMED" },
  CONFIRMED: { label: "Начать работу", value: "IN_PROGRESS" },
  IN_PROGRESS: { label: "Завершить", value: "DONE" },
};

const cancelAllowed = ["PENDING", "CONFIRMED"];

interface Props {
  orderId: string;
  currentStatus: string;
  paymentStatus: string;
}

export default function OrderStatusForm({ orderId, currentStatus }: Props) {
  const next = nextStatus[currentStatus];

  if (!next) return null;

  return (
    <div className="flex gap-2">
      <button
        onClick={() => updateOrderStatus(orderId, next.value)}
        className="bg-amber-400 hover:bg-amber-300 text-zinc-900 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
      >
        {next.label}
      </button>

      {cancelAllowed.includes(currentStatus) && (
        <button
          onClick={() => updateOrderStatus(orderId, "CANCELLED")}
          className="bg-zinc-800 hover:bg-red-400/20 text-red-400 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Отменить
        </button>
      )}
    </div>
  );
}