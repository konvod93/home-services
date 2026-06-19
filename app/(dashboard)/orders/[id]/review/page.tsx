import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import ReviewForm from "./ReviewForm";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: { include: { service: true } },
      master: { include: { user: { select: { name: true } } } },
      review: true,
    },
  });

  if (!order || order.clientId !== session.user.id) notFound();
  if (order.status !== "DONE") redirect(`/orders/${id}`);
  if (order.review) redirect(`/orders/${id}`);

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-white mb-2">Залишити відгук</h1>
      <p className="text-zinc-500 mb-6">
        {order.items[0]?.service.name} — {order.master.user.name}
      </p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <ReviewForm orderId={id} />
      </div>
    </div>
  );
}