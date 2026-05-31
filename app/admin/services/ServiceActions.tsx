"use client";

import { useState } from "react";
import { toggleService, deleteService } from "@/lib/actions/admin.actions";
import ServiceForm from "./ServiceForm";

interface Props {
  service: {
    id: string;
    name: string;
    category: string;
    basePrice: number;
    unit: string;
    description: string | null;
    isActive: boolean;
  };
  hasOrders: boolean;
}

export default function ServiceActions({ service, hasOrders }: Props) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="col-span-6 bg-zinc-800 rounded-xl p-4 mt-1">
        <ServiceForm service={service} onClose={() => setEditing(false)} />
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setEditing(true)}
        className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors"
      >
        Изменить
      </button>
      <button
        onClick={() => toggleService(service.id, !service.isActive)}
        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
          service.isActive
            ? "bg-green-400/10 text-green-400 hover:bg-red-400/10 hover:text-red-400"
            : "bg-red-400/10 text-red-400 hover:bg-green-400/10 hover:text-green-400"
        }`}
      >
        {service.isActive ? "Активна" : "Скрыта"}
      </button>
      {!hasOrders && (
        <button
          onClick={() => {
            if (confirm("Удалить услугу?")) deleteService(service.id);
          }}
          className="text-xs bg-red-400/10 text-red-400 hover:bg-red-400/20 px-3 py-1.5 rounded-lg transition-colors"
        >
          Удалить
        </button>
      )}
    </div>
  );
}