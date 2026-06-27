"use client";

import { useState } from "react";
import { updateMasterSettings } from "@/lib/actions/master.actions";

interface Props {
  master: {
    id: string;
    bio: string | null;
    city: string | null;
    district: string | null;
    region: string | null;
    subregion: string | null;
    phone: string | null;
  };
}

export default function MasterSettingsForm({ master }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const result = await updateMasterSettings(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="masterId" value={master.id} />

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Про себе</label>
        <textarea
          name="bio"
          rows={3}
          defaultValue={master.bio ?? ""}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">
          Телефон <span className="text-red-400">*</span>
        </label>
        <input
          name="phone"
          type="tel"
          required
          defaultValue={master.phone ?? ""}
          placeholder="+380 00 000 00 00"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
        />
        <p className="text-zinc-600 text-xs mt-1">Буде показано клієнту після оплати замовлення</p>
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Область</label>
        <input
          name="region"
          type="text"
          defaultValue={master.region ?? ""}
          placeholder="Харківська"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Район області <span className="text-zinc-600">(необов’язково)</span></label>
        <input
          name="subregion"
          type="text"
          defaultValue={master.subregion ?? ""}
          placeholder="Чугуївський район"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Місто / Населений пункт</label>
        <input
          name="city"
          type="text"
          defaultValue={master.city ?? ""}
          placeholder="Харків"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">
          Район міста <span className="text-zinc-600">(необов’язково)</span>
        </label>
        <input
          name="district"
          type="text"
          defaultValue={master.district ?? ""}
          placeholder="Олексіївка"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {success && <p className="text-green-400 text-sm">Збережено</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold rounded-lg py-2.5 transition-colors disabled:opacity-50"
      >
        {loading ? "Зберігаємо..." : "Зберегти"}
      </button>
    </form>
  );
}