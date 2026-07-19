"use client";

import { useState } from "react";
import { createOrder } from "@/lib/actions/order.actions";

interface OrderFormProps {
  serviceId: string;
  masterId: string;
  slotId: string;
  price: number;
}

export default function OrderForm({ serviceId, masterId, slotId, price }: OrderFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {

    if (loading) return;

    setLoading(true);
    setError(null);
    formData.append("serviceId", serviceId);
    formData.append("masterId", masterId);
    formData.append("slotId", slotId);
    formData.append("price", String(price));

    const result = await createOrder(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Адреса</label>
        <input
          name="address"
          type="text"
          required
          placeholder="вул. Прикладна, буд. 1, кв. 10"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Коментар</label>
        <textarea
          name="comment"
          rows={3}
          placeholder="Опишіть проблему детальніше..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors resize-none"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold rounded-lg py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Оформлюємо..." : "Підтвердити замовлення"}
      </button>
    </form>
  );
}