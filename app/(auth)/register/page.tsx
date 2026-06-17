"use client";

import { useState } from "react";
import { register } from "@/lib/actions/auth.actions";
import Link from "next/link";
import TurnstileWidget from "@/components/shared/Turnstile";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    if (!token) {
      setError("Пройдіть перевірку капчі");
      return;
    }
    setLoading(true);
    setError(null);
    formData.append("turnstileToken", token);
    const result = await register(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <span className="text-3xl font-bold tracking-tight text-white">
            home<span className="text-amber-400">fix</span>
          </span>
          <p className="text-zinc-500 text-sm mt-2">Сервіс домашніх майстрів</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-white mb-6">Створити акаунт</h1>

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Ім’я</label>
              <input
                name="name"
                type="text"
                required
                placeholder="Іван Іванов"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Пароль</label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Область</label>
              <input
                name="region"
                type="text"
                placeholder="Харківська"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Місто / Населений пункт</label>
              <input
                name="city"
                type="text"
                placeholder="Харків"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Район міста <span className="text-zinc-600">(необов’язково)</span></label>
              <input
                name="district"
                type="text"
                placeholder="Олексіївка"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 w-4 h-4 rounded border-zinc-600 bg-zinc-800 accent-amber-400"
                />
                <span className="text-sm text-zinc-400">
                  Я погоджуюсь на{" "}
                  <a href="/privacy" target="_blank" className="text-amber-400 hover:text-amber-300 transition-colors">
                    обробку персональних даних
                  </a>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 w-4 h-4 rounded border-zinc-600 bg-zinc-800 accent-amber-400"
                />
                <span className="text-sm text-zinc-400">
                  Я ознайомлений з{" "}
                  <a href="/terms" target="_blank" className="text-amber-400 hover:text-amber-300 transition-colors">
                    правилами сервісу
                  </a>
                </span>
              </label>
            </div>

            <TurnstileWidget onSuccess={setToken} />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold rounded-lg py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Реєструємо..." : "Зареєструватися"}
            </button>
          </form>

          <p className="text-zinc-500 text-sm text-center mt-6">
            Вже є акаунт?{" "}
            <Link href="/login" className="text-amber-400 hover:text-amber-300 transition-colors">
              Увійти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}