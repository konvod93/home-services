"use client";

import { useState } from "react";
import { createService, updateService } from "@/lib/actions/admin.actions";

const categories = [
  { value: "PLUMBING", label: "Сантехніка" },
  { value: "ELECTRICAL", label: "Електрика" },
  { value: "RENOVATION", label: "Ремонт" },
  { value: "CLEANING", label: "Прибирання" },
  { value: "FURNITURE", label: "Меблі" },
  { value: "OTHER", label: "Інше" },
];

interface Props {
  service?: {
    id: string;
    name: string;
    category: string;
    basePrice: number;
    unit: string;
    description: string | null;
  };
  onClose: () => void;
}

export default function ServiceForm({ service, onClose }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = service
      ? await updateService(service.id, formData)
      : await createService(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      onClose();
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Назва</label>
        <input
          name="name"
          type="text"
          required
          defaultValue={service?.name}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Категорія</label>
        <select
          name="category"
          required
          defaultValue={service?.category}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors"
        >
          <option value="">Оберіть категорію</option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Базова ціна (₴)</label>
          <input
            name="basePrice"
            type="number"
            min="0"
            required
            defaultValue={service?.basePrice}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Одиниця</label>
          <input
            name="unit"
            type="text"
            required
            defaultValue={service?.unit}
            placeholder="за виїзд, за м², за годину..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Опис <span className="text-zinc-600">(необов’язково)</span></label>
        <textarea
          name="description"
          rows={2}
          defaultValue={service?.description ?? ""}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors resize-none"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Зберігаємо..." : service ? "Зберегти" : "Додати"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-zinc-500 hover:text-white px-6 py-2.5 transition-colors"
        >
          Скасувати
        </button>
      </div>
    </form>
  );
}