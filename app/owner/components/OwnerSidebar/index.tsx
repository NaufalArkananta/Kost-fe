"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function OwnerSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/owner/dashboard", label: "🏠 Dashboard" },
    { href: "/owner/kost", label: "🏘️ Data Kos" },
    { href: "/owner/history", label: "💬 Histori" },
  ];

  const handleLogout = () => {
    // Hapus cookie token & user_id
    Cookies.remove("access_token");
    Cookies.remove("user_id");

    // Redirect ke halaman login
    router.push("/");
  };

  return (
    <aside className="w-64 bg-white shadow-md p-5 space-y-4 flex flex-col justify-between h-screen">
      <div>
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
      </div>

      {/* Tombol Logout */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition mt-5"
      >
        🚪 Logout
      </button>
    </aside>
  );
}
