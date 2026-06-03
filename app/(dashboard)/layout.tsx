import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/auth";
import MobileMenu from "@/components/shared/MobileMenu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const isMaster = session.user.role === "MASTER";

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="border-b border-zinc-800 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard">
            <span className="text-xl font-bold text-white">
              home<span className="text-amber-400">fix</span>
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Главная
            </Link>
            <Link href="/orders" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Мои заказы
            </Link>
            <Link href="/services" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Услуги
            </Link>
            <Link href="/profile" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Профиль
            </Link>
            {isMaster && (
              <Link href="/master" className="text-sm bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 px-3 py-1.5 rounded-lg transition-colors">
                Кабинет мастера
              </Link>
            )}
            <form action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}>
              <button type="submit" className="text-sm text-zinc-500 hover:text-red-400 transition-colors">
                Выйти
              </button>
            </form>
          </div>

          {/* Mobile */}
          <MobileMenu isMaster={isMaster} />
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}