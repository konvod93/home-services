"use client";

import { approveUnblock, rejectUnblock } from "@/lib/actions/admin.actions";

interface Props {
  requestId: string;
  masterId: string;
}

export default function UnblockActions({ requestId, masterId }: Props) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => approveUnblock(requestId, masterId)}
        className="bg-green-500 hover:bg-green-400 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
      >
        Розблокувати
      </button>
      <button
        onClick={() => rejectUnblock(requestId)}
        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
      >
        Відхилити
      </button>
    </div>
  );
}