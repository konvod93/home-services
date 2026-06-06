"use client";

import { useState } from "react";
import Link from "next/link";

export default function BlockedModal() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Вы были перенаправлены</p>
          <Link href="/dashboard" className="text-amber-400 hover:text-amber-300 transition-colors">
            Вернуться на главную
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
          Ваш аккаунт заблокирован
        </h2>
        <p className="text-zinc-400 text-sm mb-4">
          Вы заблокированы на основании жалобы клиента, поэтому вы не можете принимать новые заказы.
        </p>
        <p className="text-zinc-400 text-sm mb-6">
          Вы можете подать заявку на разблокирование при наличии фотокопии судебного решения или экспертной оценки, доказывающей, что проблемы возникли не по вашей вине (например, бракованная партия материала).
        </p>

        <div className="flex gap-3">
          <Link
            href={`/master/unblock`}
            className="flex-1 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold rounded-lg py-2.5 text-center text-sm transition-colors"
          >
            Подать заявку
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-lg py-2.5 text-sm transition-colors"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
}