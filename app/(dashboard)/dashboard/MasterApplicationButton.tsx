"use client";

import Link from "next/link";

export default function MasterApplicationButton() {
  return (
    <Link
      href="/become-master"
      className="block bg-zinc-900 border border-amber-400/30 hover:border-amber-400/60 rounded-2xl p-6 transition-all"
    >
      <div className="text-2xl mb-3">🛠</div>
      <h2 className="text-white font-semibold mb-1">Стать мастером</h2>
      <p className="text-zinc-500 text-sm">Подайте заявку и начните принимать заказы</p>
    </Link>
  );
}