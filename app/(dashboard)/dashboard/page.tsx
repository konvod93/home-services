import { auth } from "@/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div>
      {/* Приветствие */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Добро пожаловать, {session?.user?.name} 👋
        </h1>
        <p className="text-zinc-500 mt-1">Что нужно сделать сегодня?</p>
      </div>

      {/* Карточки быстрого доступа */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <Link href="/services" className="group bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 rounded-2xl p-6 transition-all">
          <div className="text-2xl mb-3">🔧</div>
          <h2 className="text-white font-semibold mb-1">Вызвать мастера</h2>
          <p className="text-zinc-500 text-sm">Сантехника, электрика, ремонт и другие услуги</p>
        </Link>

        <Link href="/orders" className="group bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 rounded-2xl p-6 transition-all">
          <div className="text-2xl mb-3">📋</div>
          <h2 className="text-white font-semibold mb-1">Мои заказы</h2>
          <p className="text-zinc-500 text-sm">История и статус текущих заказов</p>
        </Link>

        <Link href="/profile" className="group bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 rounded-2xl p-6 transition-all">
          <div className="text-2xl mb-3">👤</div>
          <h2 className="text-white font-semibold mb-1">Профиль</h2>
          <p className="text-zinc-500 text-sm">Личные данные и настройки</p>
        </Link>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-500 text-sm mb-1">Всего заказов</p>
          <p className="text-3xl font-bold text-white">0</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-500 text-sm mb-1">Активных</p>
          <p className="text-3xl font-bold text-amber-400">0</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-500 text-sm mb-1">Завершённых</p>
          <p className="text-3xl font-bold text-green-400">0</p>
        </div>
      </div>
    </div>
  );
}