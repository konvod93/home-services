import { db } from "@/lib/db";
import UnblockActions from "./UnblockActions";

export default async function AdminUnblockPage() {
    const requests = await db.unblockRequest.findMany({
        include: {
            master: {
                include: { user: { select: { name: true, email: true } } },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    const pending = requests.filter((r) => r.status === "PENDING");
    const reviewed = requests.filter((r) => r.status !== "PENDING");

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-8">Заявки на разблокирование</h1>

            {pending.length > 0 && (
                <div className="mb-10">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        На рассмотрении
                        <span className="text-xs bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded-full">
                            {pending.length}
                        </span>
                    </h2>
                    <div className="space-y-4">
                        {pending.map((req) => (
                            <div key={req.id} className="bg-zinc-900 border border-yellow-400/20 rounded-2xl p-6">
                                <div className="mb-4">
                                    <p className="text-white font-semibold">{req.master.user.name}</p>
                                    <p className="text-zinc-500 text-sm">{req.master.user.email}</p>
                                </div>
                                <div className="bg-zinc-800 rounded-lg p-3 mb-4">
                                    <p className="text-zinc-300 text-sm">{req.reason}</p>
                                </div>
                                {req.documents.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {req.documents.map((url, i) => (
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
                                )}
                                <UnblockActions requestId={req.id} masterId={req.master.id} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {reviewed.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-white mb-4">История</h2>
                    <div className="space-y-3">
                        {reviewed.map((req) => (
                            <div key={req.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-white text-sm">{req.master.user.name}</p>
                                    <p className="text-zinc-500 text-xs">{req.master.user.email}</p>
                                </div>
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${req.status === "APPROVED" ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"
                                    }`}>
                                    {req.status === "APPROVED" ? "Одобрена" : "Отклонена"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {requests.length === 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                    <p className="text-zinc-500">Заявок пока нет</p>
                </div>
            )}
        </div>
    );
}