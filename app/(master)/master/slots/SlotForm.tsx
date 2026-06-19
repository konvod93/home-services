"use client";

import { useState } from "react";
import { addSlot } from "@/lib/actions/slots.actions";

export default function SlotForm({ masterId }: { masterId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await addSlot(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      (document.getElementById("slot-form") as HTMLFormElement)?.reset();
    }
    setLoading(false);
  }

  return (
    <form id="slot-form" action={handleSubmit} className="space-y-4">
      <input type="hidden" name="masterId" value={masterId} />

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Дата</label>
          <input
            name="date"
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Початок</label>
          <input
            name="timeStart"
            type="time"
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Кінець</label>
          <input
            name="timeEnd"
            type="time"
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {success && <p className="text-green-400 text-sm">Слот додано</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? "Додаємо..." : "Додати слот"}
      </button>
    </form>
  );
}