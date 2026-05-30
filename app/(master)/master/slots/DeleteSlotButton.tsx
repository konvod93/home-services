"use client";

import { deleteSlot } from "@/lib/actions/slots.actions";

export default function DeleteSlotButton({ slotId }: { slotId: string }) {
  return (
    <button
      onClick={() => deleteSlot(slotId)}
      className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
    >
      Удалить
    </button>
  );
}