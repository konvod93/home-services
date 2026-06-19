import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SlotForm from "./SlotForm";
import DeleteSlotButton from "./DeleteSlotButton";

export default async function MasterSlotsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "MASTER") redirect("/dashboard");

  const master = await db.master.findUnique({
    where: { userId: session.user.id },
  });

  if (!master) redirect("/dashboard");

  const slots = await db.slot.findMany({
    where: {
      masterId: master.id,
      date: { gte: new Date() },
    },
    orderBy: { date: "asc" },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-2">Мої слоти</h1>
      <p className="text-zinc-500 mb-8">Додайте вільний час — клієнти зможуть його обрати при замовленні.</p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-4">Додати слот</h2>
        <SlotForm masterId={master.id} />
      </div>

      <div>
        <h2 className="text-white font-semibold mb-4">
          Майбутні слоти
          <span className="text-zinc-500 font-normal text-sm ml-2">{slots.length} шт.</span>
        </h2>

        {slots.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
            <p className="text-zinc-500">Немає доданих слотів</p>
          </div>
        ) : (
          <div className="space-y-2">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className={`bg-zinc-900 border rounded-xl px-5 py-3 flex items-center justify-between ${slot.isBusy ? "border-zinc-700 opacity-50" : "border-zinc-800"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-white text-sm">
                    {new Date(slot.date).toLocaleDateString("uk-UA", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                  <span className="text-zinc-400 text-sm">
                    {new Date(slot.timeStart).toLocaleTimeString("uk-UA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" — "}
                    {new Date(slot.timeEnd).toLocaleTimeString("uk-UA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {slot.isBusy ? (
                    <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full">Зайнятий</span>
                  ) : (
                    <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">Вільний</span>
                  )}
                  {!slot.isBusy && <DeleteSlotButton slotId={slot.id} />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}