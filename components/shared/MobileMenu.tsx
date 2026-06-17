"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface Props {
  isMaster: boolean;
}

export default function MobileMenu({ isMaster }: Props) {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/dashboard", label: "Головна" },
    { href: "/orders", label: "Мої замовлення" },
    { href: "/services", label: "Послуги" },
    { href: "/profile", label: "Профіль" },
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

          {isMaster && (
            <Link
              href="/master"
              onClick={() => setOpen(false)}
              className="block text-sm text-amber-400 px-3 py-2.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 transition-colors"
            >
              Кабінет майстра
            </Link>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="block w-full text-left text-sm text-zinc-500 hover:text-red-400 px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Вийти
          </button>
        </div>
      )}
    </div>
  );
}