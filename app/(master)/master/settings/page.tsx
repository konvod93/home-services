import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import MasterSettingsForm from "./MasterSettingsForm";

export default async function MasterSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "MASTER") redirect("/dashboard");

  const master = await db.master.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true,
      bio: true,
      city: true,
      district: true,
      region: true,
      subregion: true,
      phone: true,
      services: { select: { serviceId: true, price: true } },
    },
  });

  if (!master) redirect("/dashboard");

  const allServices = await db.service.findMany({
    where: { isActive: true },
    orderBy: { category: "asc" },
    select: { id: true, name: true, category: true, unit: true, basePrice: true },
  });

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-white mb-6">Налаштування профілю</h1>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <MasterSettingsForm master={master} allServices={allServices} />
      </div>
    </div>
  );
}