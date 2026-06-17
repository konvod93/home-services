"use client";

import { useState } from "react";

export default function DemoModal() {
  const [open, setOpen] = useState(
    () => typeof window !== "undefined" && !sessionStorage.getItem("demo-modal-seen")
  );

  function handleClose() {
    sessionStorage.setItem("demo-modal-seen", "true");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-md w-full">
        <div className="text-3xl mb-4">🛠</div>
        <h2 className="text-xl font-bold text-white mb-3">
          Демонстраційний проєкт
        </h2>
        <p className="text-zinc-400 text-sm mb-4">
          Це портфоліо-проєкт, створений для демонстрації навичок fullstack-розробки на Next.js.
        </p>
        <ul className="text-zinc-500 text-sm space-y-1 mb-6">
          <li>• Реальна база даних (Neon PostgreSQL)</li>
          <li>• Автентифікація з ролями (клієнт / майстер / адмін)</li>
          <li>• Завантаження файлів (Uploadthing)</li>
          <li>• Повний цикл замовлення послуги</li>
          <li>• Email-сповіщення (Resend — лише на верифіковані адреси)</li>
        </ul>
        <p className="text-zinc-600 text-xs mb-6">
          Усі дані реальні — не рекомендується вводити особисту інформацію. Для тестування створюйте фейкового користувача з неіснуючою поштою.
        </p>
        <button
          onClick={handleClose}
          className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-900 font-semibold rounded-lg py-2.5 transition-colors"
        >
          Зрозуміло, продовжити
        </button>
      </div>
    </div>
  );
}