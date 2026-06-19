import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BecomeMasterForm from "./BecomeMasterForm";

export default async function BecomeMasterPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "CLIENT") redirect("/dashboard");

  const existing = await db.master.findUnique({
    where: { userId: session.user.id },
    include: { application: true },
  });

  if (existing?.application) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10">
          <div className="text-4xl mb-4">
            {existing.application.status === "PENDING" ? "⏳" :
             existing.application.status === "APPROVED" ? "✅" : "❌"}
          </div>
          <h1 className="text-xl font-bold text-white mb-2">
            {existing.application.status === "PENDING" && "Заявку на розгляді"}
            {existing.application.status === "APPROVED" && "Заявку схвалено"}
            {existing.application.status === "REJECTED" && "Заявку відхилено"}
          </h1>
          <p className="text-zinc-500 text-sm">
            {existing.application.status === "PENDING" && "Ми перевіряємо ваші документи. Зазвичай це займає 1-2 дні."}
            {existing.application.status === "APPROVED" && "Вітаємо! Ви можете приймати замовлення."}
            {existing.application.status === "REJECTED" && (existing.application.comment || "Вашу заявку було відхилено.")}
          </p>
        </div>
      </div>
    );
  }

  const services = await db.service.findMany({
    where: { isActive: true },
    orderBy: { category: "asc" },
    select: { id: true, name: true, category: true, unit: true },
  });

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-white mb-2">Стати майстром</h1>
      <p className="text-zinc-500 mb-8">
        Заповніть анкету та завантажте документи. Ми перевіримо їх та зв’яжемося з вами.
      </p>
      <BecomeMasterForm services={services} />
    </div>
  );
}