import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/auth";

export default async function MasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "MASTER") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="border-b border-zinc-800 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/master">
            <span className="text-xl font-bold text-white">
              home<span className="text-amber-400">fix</span>
              <span className="text-zinc-500 text-sm font-normal ml-2">кабинет мастера</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/master" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Заказы
            </Link>
            <Link href="/master/slots" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Мои слоты
            </Link>
            <Link
              href="/dashboard"
              className="text-sm bg-zinc-800 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Режим клиента
            </Link>
            <form action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}>
              <button type="submit" className="text-sm text-zinc-500 hover:text-red-400 transition-colors">
                Выйти
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}