"use client";

import { useState } from "react";
import Link from "next/link";

export default function BlockedModal() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Вас було перенаправлено</p>
          <Link href="/dashboard" className="text-amber-400 hover:text-amber-300 transition-colors">
            Повернутися на головну
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-red-400/30 rounded-2xl p-8 max-w-lg w-full">
        <div className="text-5xl mb-4 text-center">🚫</div>
        <h2 className="text-xl font-bold text-white mb-3 text-center">
          Ваш акаунт заблоковано
        </h2>
        <p className="text-zinc-400 text-sm mb-4">
          Ваш акаунт заблоковано на підставі скарги клієнта. Ви не можете приймати нові замовлення.
        </p>
        <p className="text-zinc-400 text-sm mb-6">
          Ви можете подати заявку на розблокування за наявності фотокопії судового рішення або експертної оцінки, що доводить вашу невинуватість (наприклад, бракована партія матеріалу).
        </p>

        <div className="flex gap-3">
          <Link
            href="/master/unblock"
            className="flex-1 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold rounded-lg py-2.5 text-center text-sm transition-colors"
          >
            Подати заявку
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-lg py-2.5 text-sm transition-colors"
          >
            Зрозуміло
          </button>
        </div>
      </div>
    </div>
  );
}