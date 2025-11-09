"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function OwnerSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/owner/dashboard", label: "🏠 Dashboard" },
    { href: "/owner/kost", label: "🏘️ Data Kos" },
    { href: "/owner/fasilitas", label: "🧰 Fasilitas" },
    { href: "/owner/pemesanan", label: "📦 Pemesanan" },
    { href: "/owner/review", label: "💬 Review" },
    { href: "/owner/laporan", label: "📊 Laporan" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md p-5 space-y-4">
      <h2 className="text-xl font-bold text-indigo-600 mb-6">Owner Panel</h2>
      <nav className="flex flex-col space-y-2">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 rounded-md transition ${
              pathname === href
                ? "bg-indigo-600 text-white"
                : "hover:bg-indigo-100 text-gray-800"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
