import { db } from "@/lib/db";
import ComplaintActions from "./ComplaintActions";

const statusLabels: Record<string, string> = {
  PENDING: "Новая",
  REVIEWED: "Рассмотрена",
  DISMISSED: "Отклонена",
};

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-400/10",
  REVIEWED: "text-green-400 bg-green-400/10",
  DISMISSED: "text-zinc-400 bg-zinc-800",
};

export default async function AdminComplaintsPage() {
  const complaints = await db.complaint.findMany({
    include: {
      client: { select: { name: true, email: true } },
      master: {
        include: { user: { select: { name: true } } },
      },
      order: {
        include: { items: { include: { service: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const pending = complaints.filter((c) => c.status === "PENDING");
  const reviewed = complaints.filter((c) => c.status !== "PENDING");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Жалобы</h1>
        {pending.length > 0 && (
          <span className="text-xs bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full">
            {pending.length} новых
          </span>
        )}
      </div>

      {pending.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4">Новые</h2>
          <div className="space-y-4">
            {pending.map((complaint) => (
              <div key={complaint.id} className="bg-zinc-900 border border-yellow-400/20 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-white font-medium">
                      {complaint.order.items[0]?.service.name}
                    </p>
                    <p className="text-zinc-500 text-sm">
                      Клиент: {complaint.client.name} ({complaint.client.email})
                    </p>
                    <p className="text-zinc-500 text-sm">
                      Мастер: {complaint.master.user.name}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[complaint.status]}`}>
                    {statusLabels[complaint.status]}
                  </span>
                </div>

                <div className="bg-zinc-800 rounded-lg p-3 mb-4">
                  <p className="text-zinc-300 text-sm">{complaint.reason}</p>
                </div>

                <ComplaintActions
                  complaintId={complaint.id}
                  masterId={complaint.masterId}
                  masterIsActive={complaint.master.isActive}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {reviewed.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">История</h2>
          <div className="space-y-3">
            {reviewed.map((complaint) => (
              <div key={complaint.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">{complaint.master.user.name}</p>
                  <p className="text-zinc-500 text-xs">{complaint.client.name}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[complaint.status]}`}>
                  {statusLabels[complaint.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {complaints.length === 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
          <p className="text-zinc-500">Жалоб пока нет</p>
        </div>
      )}
    </div>
  );
}