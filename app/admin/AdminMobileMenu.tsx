"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminMobileMenu() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/admin", label: "Заявки" },
    { href: "/admin/masters", label: "Мастера" },
    { href: "/admin/users", label: "Пользователи" },
    { href: "/admin/orders", label: "Заказы" },
    { href: "/admin/services", label: "Услуги" },
    { href: "/admin/complaints", label: "Жалобы" },
    { href: "/admin/unblock", label: "Разблокирование" },
  ];

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-zinc-400 hover:text-white transition-colors p-2"
      >
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
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-sm text-zinc-400 hover:text-white px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="block text-sm text-zinc-500 hover:text-white px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            ← На сайт
          </Link>
        </div>
      )}
    </div>
  );
}