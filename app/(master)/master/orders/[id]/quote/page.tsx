import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import QuoteForm from "./QuoteForm";

export default async function QuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "MASTER") redirect("/dashboard");

  const { id } = await params;

  const master = await db.master.findUnique({
    where: { userId: session.user.id },
  });

  if (!master) redirect("/dashboard");

  const order = await db.order.findUnique({
    where: { id },
    include: {
      client: { select: { name: true } },
      items: { include: { service: true } },
      quote: true,
      slot: true,
    },
  });

  if (!order || order.masterId !== master.id) notFound();
  if (order.status !== "CONFIRMED") redirect("/master");

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-2">Калькуляція</h1>
      <p className="text-zinc-500 mb-2 text-sm">
        Клієнт: <span className="text-white">{order.client.name}</span>
      </p>
      <p className="text-zinc-500 mb-6 text-sm">
        Послуга: <span className="text-white">{order.items[0]?.service.name}</span>
      </p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <QuoteForm
          orderId={order.id}
          existingQuote={order.quote}
          defaultServiceName={order.items[0]?.service.name ?? ""}
          defaultUnit={order.items[0]?.service.unit ?? "за виїзд"}
          defaultPrice={Number(order.items[0]?.service.basePrice ?? 0)}
        />
      </div>
    </div>
  );
}