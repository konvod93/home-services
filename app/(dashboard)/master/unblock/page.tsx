import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UnblockForm from "./UnblockForm";

export default async function UnblockPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "MASTER") redirect("/dashboard");

  const master = await db.master.findUnique({
    where: { userId: session.user.id },
    include: { unblockRequest: true },
  });

  if (!master) redirect("/dashboard");
  if (master.isActive) redirect("/master");

  if (master.unblockRequest) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 max-w-md text-center">
          <div className="text-4xl mb-4">
            {master.unblockRequest.status === "PENDING" ? "⏳" :
              master.unblockRequest.status === "APPROVED" ? "✅" : "❌"}
          </div>
          <h1 className="text-xl font-bold text-white mb-2">
            {master.unblockRequest.status === "PENDING" && "Заявка на розгляді"}
            {master.unblockRequest.status === "APPROVED" && "Заявку схвалено"}
            {master.unblockRequest.status === "REJECTED" && "Заявку відхилено"}
          </h1>
          <p className="text-zinc-500 text-sm">
            {master.unblockRequest.status === "PENDING" && "Адміністратор розглядає вашу заявку."}
            {master.unblockRequest.status === "APPROVED" && "Ваш акаунт розблоковано."}
            {master.unblockRequest.status === "REJECTED" && "Вашу заявку було відхилено."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-white mb-2">Заявка на розблокування</h1>
        <p className="text-zinc-500 mb-8 text-sm">
          Додайте документи що підтверджують, що проблема виникла не з вашої вини.
        </p>
        <UnblockForm masterId={master.id} />
      </div>
    </div>
  );
}