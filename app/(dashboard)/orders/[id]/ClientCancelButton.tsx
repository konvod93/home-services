"use client";

import { useState } from "react";
import { cancelOrderByClient } from "@/lib/actions/payment.actions";

export default function ClientCancelButton({ orderId }: { orderId: string }) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    setLoading(true);
    await cancelOrderByClient(orderId);
  }

  if (!confirm) {
    return (
      <button
        onClick={() => setConfirm(true)}
        className="w-full text-sm text-zinc-600 hover:text-red-400 transition-colors text-center mt-2"
      >
        Скасувати замовлення
      </button>
    );
  }

  return (
    <div className="bg-zinc-900 border border-red-400/20 rounded-2xl p-4 mt-2">
      <p className="text-zinc-400 text-sm mb-3">
        Кошти буде повернено. Ви впевнені що хочете скасувати замовлення?
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleCancel}
          disabled={loading}
          className="bg-red-500 hover:bg-red-400 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Скасовуємо..." : "Так, скасувати"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="text-zinc-500 hover:text-white text-sm px-4 py-2 transition-colors"
        >
          Ні
        </button>
      </div>
    </div>
  );
}