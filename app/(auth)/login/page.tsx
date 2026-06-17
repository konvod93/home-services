"use client";

import { useState } from "react";
import { login } from "@/lib/actions/auth.actions";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await login(formData);
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
          <h1 className="text-xl font-semibold text-white mb-6">Вхід до акаунту</h1>

          <form action={handleSubmit} className="space-y-4">
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

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold rounded-lg py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Входимо..." : "Увійти"}
            </button>
          </form>

          <p className="text-zinc-500 text-sm text-center mt-6">
            Немає акаунту?{" "}
            <Link href="/register" className="text-amber-400 hover:text-amber-300 transition-colors">
              Зареєструватися
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}