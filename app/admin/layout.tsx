import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="border-b border-zinc-800 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-xl font-bold text-white">
            home<span className="text-amber-400">fix</span>
            <span className="text-zinc-500 text-sm font-normal ml-2">админ</span>
          </span>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Заявки
            </Link>
            <Link href="/admin/users" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Пользователи
            </Link>
            <Link href="/admin/orders" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Заказы
            </Link>
            <Link href="/admin/services" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Услуги
            </Link>
            <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-white transition-colors">
              ← На сайт
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}