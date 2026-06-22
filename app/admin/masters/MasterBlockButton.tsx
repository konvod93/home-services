"use client";

import { toggleMasterBlock } from "@/lib/actions/admin.actions";

interface Props {
  masterId: string;
  isActive: boolean;
}

export default function MasterBlockButton({ masterId, isActive }: Props) {
  return (
    <button
      onClick={() => toggleMasterBlock(masterId, !isActive)}
      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
        isActive
          ? "bg-red-400/10 text-red-400 hover:bg-red-400/20"
          : "bg-green-400/10 text-green-400 hover:bg-green-400/20"
      }`}
    >
      {isActive ? "Заблокувати" : "Розблокувати"}
    </button>
  );
}