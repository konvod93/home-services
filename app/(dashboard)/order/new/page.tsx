import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import OrderForm from "./OrderForm";

export default async function NewOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ serviceId?: string; masterId?: string; slotId?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { serviceId, masterId, slotId } = await searchParams;

  if (!serviceId || !masterId || !slotId) redirect("/services");

  const [service, master, slot] = await Promise.all([
    db.service.findUnique({ where: { id: serviceId } }),
    db.master.findUnique({
      where: { id: masterId },
      include: { user: { select: { name: true } } },
    }),
    db.slot.findUnique({ where: { id: slotId } }),
  ]);

  if (!service || !master || !slot || slot.isBusy) redirect("/services");

  const masterService = await db.masterService.findUnique({
    where: { masterId_serviceId: { masterId, serviceId } },
  });

  const price = masterService ? Number(masterService.price) : Number(service.basePrice);

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-white mb-6">Оформление заказа</h1>

      {/* Сводка */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Услуга</span>
          <span className="text-white font-medium">{service.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Мастер</span>
          <span className="text-white font-medium">{master.user.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Дата и время</span>
          <span className="text-white font-medium">
            {new Date(slot.date).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
            })}{" "}
            {new Date(slot.timeStart).toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="border-t border-zinc-800 pt-3 flex justify-between">
          <span className="text-zinc-500">Итого</span>
          <span className="text-amber-400 font-bold text-lg">{price} ₴</span>
        </div>
      </div>

      {/* Форма */}
      <OrderForm
        serviceId={serviceId}
        masterId={masterId}
        slotId={slotId}
        price={price}
      />
    </div>
  );
}