"use client";

import { useState } from "react";
import { approveApplication, rejectApplication } from "@/lib/actions/admin.actions";

interface Props {
  applicationId: string;
  masterId: string;  
}

export default function ApplicationActions({ applicationId, masterId }: Props) {
  const [rejecting, setRejecting] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleApprove() {
    setLoading(true);
    await approveApplication(applicationId, masterId);
  }

  async function handleReject() {
    setLoading(true);
    await rejectApplication(applicationId, comment);
    setLoading(false);
    setRejecting(false);
  }

  return (
    <div>
      {!rejecting ? (
        <div className="flex gap-2">
          <button
            onClick={handleApprove}
            disabled={loading}
            className="bg-green-500 hover:bg-green-400 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            Одобрить
          </button>
          <button
            onClick={() => setRejecting(true)}
            disabled={loading}
            className="bg-zinc-800 hover:bg-red-400/20 text-red-400 font-medium text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            Отклонить
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Причина отклонения (необязательно)..."
            rows={2}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-red-400 transition-colors resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleReject}
              disabled={loading}
              className="bg-red-500 hover:bg-red-400 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              Подтвердить отклонение
            </button>
            <button
              onClick={() => setRejecting(false)}
              className="text-zinc-500 hover:text-white text-sm px-4 py-2 transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}