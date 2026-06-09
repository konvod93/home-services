"use client";

import { resolvePaymentDispute } from "@/lib/actions/payment.actions";

export default function DisputeActions({ orderId }: { orderId: string }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => resolvePaymentDispute(orderId, false)}
        className="text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 font-medium px-3 py-1.5 rounded-lg transition-colors"
      >
        Оплатити майстру
      </button>
      <button
        onClick={() => resolvePaymentDispute(orderId, true)}
        className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium px-3 py-1.5 rounded-lg transition-colors"
      >
        Повернути клієнту
      </button>
    </div>
  );
}