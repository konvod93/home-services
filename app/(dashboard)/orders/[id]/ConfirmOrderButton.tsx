"use client";

import { confirmOrderPayment } from "@/lib/actions/payment.actions";

export default function ConfirmOrderButton({ orderId }: { orderId: string }) {
  return (
    <button
      onClick={() => confirmOrderPayment(orderId)}
      className="w-full bg-green-500 hover:bg-green-400 text-white font-semibold rounded-lg py-2.5 transition-colors"
    >
      Підтвердити виконання та оплатити
    </button>
  );
}