"use client";

import { resolveComplaint } from "@/lib/actions/admin.actions";
import { toggleMasterBlock } from "@/lib/actions/admin.actions";

interface Props {
  complaintId: string;
  masterId: string;
  masterIsActive: boolean;
}

export default function ComplaintActions({ complaintId, masterId, masterIsActive }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => resolveComplaint(complaintId, "REVIEWED")}
        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
      >
        Рассмотрена
      </button>
      <button
        onClick={() => resolveComplaint(complaintId, "DISMISSED")}
        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
      >
        Отклонить
      </button>
      {masterIsActive && (
        <button
          onClick={async () => {
            await resolveComplaint(complaintId, "REVIEWED");
            await toggleMasterBlock(masterId, false);
          }}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Заблокировать мастера
        </button>
      )}
    </div>
  );
}