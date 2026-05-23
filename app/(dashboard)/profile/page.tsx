import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true, role: true, createdAt: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-white mb-6">Профиль</h1>

      {/* Аватар и роль */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-amber-400 flex items-center justify-center text-zinc-900 font-bold text-xl">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-white font-semibold">{user.name}</p>
          <p className="text-zinc-500 text-sm">{user.email}</p>
          <p className="text-zinc-600 text-xs mt-1">
            Аккаунт с{" "}
            {new Date(user.createdAt).toLocaleDateString("ru-RU", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Форма */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4">Личные данные</h2>
        <ProfileForm name={user.name} phone={user.phone ?? ""} />
      </div>
    </div>
  );
}