"use client";

import { useState } from "react";
import { saveQuote } from "@/lib/actions/quote.actions";

interface QuoteItem {
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

interface Props {
  orderId: string;
  existingQuote: { items: unknown; totalPrice: number; comment?: string | null } | null;
  defaultServiceName: string;
  defaultUnit: string;
  defaultPrice: number;
}

export default function QuoteForm({
  orderId,
  existingQuote,
  defaultServiceName,
  defaultUnit,
  defaultPrice,
}: Props) {
  const [items, setItems] = useState<QuoteItem[]>(
    existingQuote
      ? (existingQuote.items as QuoteItem[])
      : [{ name: defaultServiceName, quantity: 1, unit: defaultUnit, price: defaultPrice }]
  );
  const [comment, setComment] = useState(existingQuote?.comment ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  function addItem() {
    setItems([...items, { name: "", quantity: 1, unit: "шт", price: 0 }]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof QuoteItem, value: string | number) {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  }

  async function handleSubmit() {
    if (items.length === 0) {
      setError("Додайте хоча б один рядок");
      return;
    }
    if (items.some((i) => !i.name || i.price <= 0)) {
      setError("Заповніть назву та ціну для всіх рядків");
      return;
    }

    setLoading(true);
    setError(null);

    const result = await saveQuote({ orderId, items, comment, totalPrice: total });
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Строки сметы */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="bg-zinc-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-xs">Рядок {index + 1}</span>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-zinc-600 hover:text-red-400 text-xs transition-colors"
                >
                  Видалити
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs text-zinc-500 mb-1">Найменування</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(index, "name", e.target.value)}
                placeholder="Укладка плитки"
                className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Кількість</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Одиниця</label>
                <input
                  type="text"
                  value={item.unit}
                  onChange={(e) => updateItem(index, "unit", e.target.value)}
                  placeholder="м², шт, м"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Ціна за од. ₴</label>
                <input
                  type="number"
                  min="0"
                  value={item.price}
                  onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div className="text-right text-sm text-amber-400 font-medium">
              {(item.quantity * item.price).toFixed(2)} ₴
            </div>
          </div>
        ))}
      </div>

      {/* Добавить строку */}
      <button
        type="button"
        onClick={addItem}
        className="w-full border border-dashed border-zinc-700 hover:border-amber-400 text-zinc-500 hover:text-amber-400 rounded-xl py-3 text-sm transition-colors"
      >
        + Додати рядок
      </button>

      {/* Комментарий */}
      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">
          Коментар <span className="text-zinc-600">(необов`язково)</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          placeholder="Додаткові умови, матеріали замовника тощо..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors resize-none"
        />
      </div>

      {/* Итог */}
      <div className="bg-zinc-800 rounded-xl p-4 flex items-center justify-between">
        <span className="text-zinc-400">Разом до оплати</span>
        <span className="text-2xl font-bold text-amber-400">{total.toFixed(2)} ₴</span>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold rounded-lg py-2.5 transition-colors disabled:opacity-50"
      >
        {loading ? "Зберігаємо..." : existingQuote ? "Оновити калькуляцію" : "Надіслати клієнту"}
      </button>
    </div>
  );
}