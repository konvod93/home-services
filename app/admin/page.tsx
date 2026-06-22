import { db } from "@/lib/db";
import Image from "next/image";
import ApplicationActions from "./ApplicationActions";

const statusLabels: Record<string, string> = {
  PENDING: "На розгляді",
  APPROVED: "Схвалено",
  REJECTED: "Відхилено",
};

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-400/10",
  APPROVED: "text-green-400 bg-green-400/10",
  REJECTED: "text-red-400 bg-red-400/10",
};

export default async function AdminPage() {
  const applications = await db.masterApplication.findMany({
    include: {
      master: {
        include: {
          user: { select: { name: true, email: true, phone: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const pending = applications.filter((a) => a.status === "PENDING");
  const reviewed = applications.filter((a) => a.status !== "PENDING");

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Заявки майстрів</h1>

      {pending.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            На розгляді
            <span className="text-xs bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded-full">
              {pending.length}
            </span>
          </h2>
          <div className="space-y-4">
            {pending.map((app) => (
              <div key={app.id} className="bg-zinc-900 border border-yellow-400/20 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-white font-semibold">{app.master.user.name}</p>
                    <p className="text-zinc-500 text-sm">{app.master.user.email}</p>
                    {app.master.user.phone && (
                      <p className="text-zinc-500 text-sm">{app.master.user.phone}</p>
                    )}
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full text-yellow-400 bg-yellow-400/10">
                    {statusLabels[app.status]}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-zinc-400 text-sm">
                    <span className="text-zinc-500">Досвід:</span> {app.experience} років
                  </p>
                  <p className="text-zinc-400 text-sm">
                    <span className="text-zinc-500">Про себе:</span> {app.bio}
                  </p>
                </div>

                {app.idPhoto && (
                  <div className="mb-4">
                    <p className="text-zinc-500 text-xs mb-2">Фото з паспортом:</p>
                    <a href={app.idPhoto} target="_blank" rel="noopener noreferrer">
                      <Image
                        src={app.idPhoto}
                        alt="ID фото"
                        width={192}
                        height={128}
                        className="object-cover rounded-lg border border-zinc-700 hover:border-amber-400 transition-colors"
                      />
                    </a>
                  </div>
                )}

                {app.documents.length > 0 && (
                  <div className="mb-4">
                    <p className="text-zinc-500 text-xs mb-2">Документи:</p>
                    <div className="flex flex-wrap gap-2">
                      {app.documents.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Документ {i + 1} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <ApplicationActions
                  applicationId={app.id}
                  masterId={app.master.id}
                />
              </div>
            ))}
          </div>
        </div>
      )
      }

      {
        reviewed.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Історія</h2>
            <div className="space-y-3">
              {reviewed.map((app) => (
                <div key={app.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">{app.master.user.name}</p>
                    <p className="text-zinc-500 text-xs">{app.master.user.email}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[app.status]}`}>
                    {statusLabels[app.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      }

      {
        applications.length === 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
            <p className="text-zinc-500">Заявок поки немає</p>
          </div>
        )
      }
    </div >
  );
}