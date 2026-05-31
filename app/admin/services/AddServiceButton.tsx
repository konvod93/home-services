"use client";

import { useState } from "react";
import ServiceForm from "./ServiceForm";

export default function AddServiceButton() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
        >
          + Добавить услугу
        </button>
      ) : (
        <div className="bg-zinc-900 border border-amber-400/30 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Новая услуга</h2>
          <ServiceForm onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}