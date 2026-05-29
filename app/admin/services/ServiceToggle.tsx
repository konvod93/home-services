"use client";

import { toggleService } from "@/lib/actions/admin.actions";

interface Props {
  serviceId: string;
  isActive: boolean;
}

export default function ServiceToggle({ serviceId, isActive }: Props) {
  return (
    <button
      onClick={() => toggleService(serviceId, !isActive)}
      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
        isActive
          ? "bg-green-400/10 text-green-400 hover:bg-red-400/10 hover:text-red-400"
          : "bg-red-400/10 text-red-400 hover:bg-green-400/10 hover:text-green-400"
      }`}
    >
      {isActive ? "Активна" : "Скрыта"}
    </button>
  );
}