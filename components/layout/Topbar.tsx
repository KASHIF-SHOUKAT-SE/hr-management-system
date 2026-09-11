"use client";

import Link from "next/link";
import { Search, Mail, MessageSquare } from "lucide-react";
import { UserMenu } from "./UserMenu";

const navLinks = [
  { label: "Documents", href: "/documents" },
  { label: "News", href: "/news" },
  { label: "Payslip", href: "/payslip" },
  { label: "Report", href: "/report" },
];

export function Topbar() {
  return (
    <header className="flex h-16 items-center gap-4 border-b border-gray-100 bg-white px-6">
      {/* Search */}
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search anything..."
          className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-14 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
          ⌘F
        </kbd>
      </div>

      {/* Nav Links */}
      <nav className="hidden items-center gap-1 md:flex">
        {navLinks.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Right */}
      <div className="ml-auto flex items-center gap-3">
        {/* Mail */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
        >
          <Mail className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Chat */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            3
          </span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200" />

        {/* User */}
        <UserMenu />
      </div>
    </header>
  );
}
