"use client";

import Link from "next/link";

export default function NoPhoneModal() {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-amber-400/30 rounded-2xl p-8 max-w-md w-full text-center">
        <div className="text-4xl mb-4">📱</div>
        <h2 className="text-xl font-bold text-white mb-3">
          Вкажіть номер телефону
        </h2>
        <p className="text-zinc-400 text-sm mb-6">
          Ви не можете приймати замовлення без вказаного номера телефону. Клієнт повинен мати можливість зв’язатися з вами після оплати.
        </p>
        <Link
          href="/master/settings"
          className="block w-full bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold rounded-lg py-2.5 transition-colors"
        >
          Перейти в налаштування
        </Link>
      </div>
    </div>
  );
}