"use client";

import { DashboardCard } from "./components/DashboardCard";
import { Home, Building2, ClipboardList, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OwnerDashboard() {
  const pendingKos = [
    { id: 1, name: "Kos Mawar Putih", owner: "Budi Santoso", gender: "Putri" },
    { id: 2, name: "Kos Harapan Indah", owner: "Siti Aminah", gender: "Putra" },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
          <Home className="text-indigo-600" /> Dashboard Owner
        </h1>
        <p className="text-sm text-gray-500">Selamat datang kembali 👋</p>
      </header>

      {/* Statistik Section */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <DashboardCard
          title="Total Kos"
          value="12"
          icon={<Building2 />}
          color="text-indigo-600"
        />
        <DashboardCard
          title="Pemesanan"
          value="32"
          icon={<ClipboardList />}
          color="text-green-600"
        />
        <DashboardCard
          title="Ulasan"
          value="7"
          icon={<MessageSquare />}
          color="text-yellow-600"
        />
      </section>

      {/* Verifikasi Kos Section */}
      <section className="bg-white rounded-xl shadow-sm p-6 w-full overflow-auto">
        <h2 className="text-xl font-semibold mb-6 text-indigo-700">
          Verifikasi Kos Baru
        </h2>

        {pendingKos.length === 0 ? (
          <p className="text-gray-500 text-center">
            Tidak ada kos yang menunggu verifikasi.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 border">Nama Kos</th>
                  <th className="px-4 py-3 border">Pemilik</th>
                  <th className="px-4 py-3 border">Gender</th>
                  <th className="px-4 py-3 border text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pendingKos.map((kos) => (
                  <tr key={kos.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 border">{kos.name}</td>
                    <td className="px-4 py-3 border">{kos.owner}</td>
                    <td className="px-4 py-3 border">{kos.gender}</td>
                    <td className="px-4 py-3 border text-center space-x-2">
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white text-xs"
                        onClick={() => alert(`Kos ${kos.name} diterima`)}
                      >
                        Terima
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700 text-white text-xs"
                        onClick={() => alert(`Kos ${kos.name} ditolak`)}
                      >
                        Tolak
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
