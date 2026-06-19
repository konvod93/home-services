"use client";

import { useState } from "react";
import { cancelOrderByMaster } from "@/lib/actions/payment.actions";

export default function MasterForceCancel({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!reason) return;
    setLoading(true);
    await cancelOrderByMaster(orderId, reason);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
      >
        Форс-мажор / не можу виконати
      </button>
    );
  }

  return (
    <div className="bg-zinc-800 rounded-xl p-4 mt-2 space-y-3 w-full">
      <p className="text-zinc-400 text-xs">Кошти будуть заморожені до рішення адміністратора</p>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Вкажіть причину..."
        rows={2}
        className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-red-400 transition-colors resize-none"
      />
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={loading || !reason}
          className="bg-red-500 hover:bg-red-400 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Надсилаємо..." : "Підтвердити"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="text-zinc-500 hover:text-white text-xs px-4 py-2 transition-colors"
        >
          Скасувати
        </button>
      </div>
    </div>
  );
}