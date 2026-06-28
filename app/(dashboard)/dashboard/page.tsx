import { auth } from "@/auth";
import Link from "next/link";
import MasterApplicationButton from "./MasterApplicationButton";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Вітаємо, {session?.user?.name} 👋
        </h1>
        <p className="text-zinc-500 mt-1">Що потрібно зробити сьогодні?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <Link href="/services" className="group bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 rounded-2xl p-6 transition-all">
          <div className="text-2xl mb-3">🔧</div>
          <h2 className="text-white font-semibold mb-1">Викликати майстра</h2>
          <p className="text-zinc-500 text-sm">Сантехніка, електрика, ремонт та інші послуги</p>
        </Link>

        <Link href="/orders" className="group bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 rounded-2xl p-6 transition-all">
          <div className="text-2xl mb-3">📋</div>
          <h2 className="text-white font-semibold mb-1">Мої замовлення</h2>
          <p className="text-zinc-500 text-sm">Історія та статус поточних замовлень</p>
        </Link>

        <Link href="/profile" className="group bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 rounded-2xl p-6 transition-all">
          <div className="text-2xl mb-3">👤</div>
          <h2 className="text-white font-semibold mb-1">Профіль</h2>
          <p className="text-zinc-500 text-sm">Особисті дані та налаштування</p>
        </Link>

        {session?.user?.role === "CLIENT" && (
          <MasterApplicationButton />
        )}

        {session?.user?.role === "ADMIN" && (
          <Link
            href="/admin"
            className="block bg-zinc-900 border border-red-400/20 hover:border-red-400/50 rounded-2xl p-6 transition-all"
          >
            <div className="text-2xl mb-3">⚙️</div>
            <h2 className="text-white font-semibold mb-1">Адмінпанель</h2>
            <p className="text-zinc-500 text-sm">Керування користувачами, замовленнями та послугами</p>
          </Link>
        )}
      </div>

      {/* ⚠️ REVIEW: All stats are hardcoded to `0` — no DB queries are made. */}
      {/* FIX: fetch order counts grouped by status for the current user and render real numbers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-500 text-sm mb-1">Усього замовлень</p>
          <p className="text-3xl font-bold text-white">0</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-500 text-sm mb-1">Активних</p>
          <p className="text-3xl font-bold text-amber-400">0</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-500 text-sm mb-1">Завершених</p>
          <p className="text-3xl font-bold text-green-400">0</p>
        </div>
      </div>
    </div>
  );
}