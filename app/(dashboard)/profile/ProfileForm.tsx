"use client";

import { useState } from "react";
import { updateProfile } from "@/lib/actions/profile.actions";

interface ProfileFormProps {
  name: string;
  phone: string;
  region: string;
  city: string;
  district: string;
}

export default function ProfileForm({ name, phone, region, city, district }: ProfileFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const result = await updateProfile(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Імʼя</label>
        <input
          name="name"
          type="text"
          required
          defaultValue={name}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Телефон</label>
        <input
          name="phone"
          type="tel"
          defaultValue={phone}
          placeholder="+380 00 000 00 00"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Область</label>
        <input
          name="region"
          type="text"
          defaultValue={region}
          placeholder="Харківська"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Місто / Населений пункт</label>
        <input
          name="city"
          type="text"
          defaultValue={city}
          placeholder="Харків"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Район міста <span className="text-zinc-600">(необов’язково)</span></label>
        <input
          name="district"
          type="text"
          defaultValue={district}
          placeholder="Олексіївка"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {success && <p className="text-green-400 text-sm">Дані збережено</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold rounded-lg py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Зберігаємо..." : "Зберегти"}
      </button>
    </form>
  );
}