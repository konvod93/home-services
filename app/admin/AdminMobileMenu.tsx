"use client";

import { useState } from "react";
import Link from "next/link";

interface Props {
  pendingApplications: number;
  pendingComplaints: number;
  pendingUnblock: number;
}

export default function AdminMobileMenu({ pendingApplications, pendingComplaints, pendingUnblock }: Props) {
  const [open, setOpen] = useState(false);

  const totalPending = pendingApplications + pendingComplaints + pendingUnblock;

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-zinc-400 hover:text-white transition-colors p-2 relative"
      >
        {!open && totalPending > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute top-14 left-0 right-0 bg-zinc-900 border-b border-zinc-800 z-50 px-4 py-4 space-y-1">
          <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center justify-between text-sm text-zinc-400 hover:text-white px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors">
            Заявки
            {pendingApplications > 0 && (
              <span className="bg-amber-400 text-zinc-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {pendingApplications}
              </span>
            )}
          </Link>
          <Link href="/admin/masters" onClick={() => setOpen(false)} className="block text-sm text-zinc-400 hover:text-white px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors">
            Майстри
          </Link>
          <Link href="/admin/users" onClick={() => setOpen(false)} className="block text-sm text-zinc-400 hover:text-white px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors">
            Користувачі
          </Link>
          <Link href="/admin/orders" onClick={() => setOpen(false)} className="block text-sm text-zinc-400 hover:text-white px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors">
            Замовлення
          </Link>
          <Link href="/admin/services" onClick={() => setOpen(false)} className="block text-sm text-zinc-400 hover:text-white px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors">
            Послуги
          </Link>
          <Link href="/admin/complaints" onClick={() => setOpen(false)} className="flex items-center justify-between text-sm text-zinc-400 hover:text-white px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors">
            Скарги
            {pendingComplaints > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {pendingComplaints}
              </span>
            )}
          </Link>
          <Link href="/admin/unblock" onClick={() => setOpen(false)} className="flex items-center justify-between text-sm text-zinc-400 hover:text-white px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors">
            Розблокування
            {pendingUnblock > 0 && (
              <span className="bg-yellow-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {pendingUnblock}
              </span>
            )}
          </Link>
          <Link href="/dashboard" onClick={() => setOpen(false)} className="block text-sm text-zinc-500 hover:text-white px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors">
            ← На сайт
          </Link>
        </div>
      )}
    </div>
  );
}