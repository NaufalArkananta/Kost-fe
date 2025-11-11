"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import AcceptBooking from "./AcceptBooking";
import RejectBooking from "./RejectBooking";

type Booking = {
  id_booking: number;
  name: string;
  address: string;
  gender: string;
  start_date: string;
  end_date: string;
  price_per_month: string;
  status: string;
};

export default function OwnerDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showAccept, setShowAccept] = useState(false);
  const [showReject, setShowReject] = useState(false);

  const token = Cookies.get("access_token");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/show_bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.status === "success") {
        setBookings(res.data.data);
      } else {
        toast.error("Gagal memuat data booking");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
          <Home className="text-indigo-600" /> Verifikasi Booking
        </h1>
        <p className="text-sm text-gray-500">
          Verifikasi pemesanan kos oleh pengguna
        </p>
      </header>

      {/* Tabel Booking */}
      <section className="bg-white rounded-xl shadow-sm p-6 w-full overflow-auto">
        {loading ? (
          <p className="text-center text-gray-500">Memuat data...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-500">
            Belum ada booking yang menunggu verifikasi.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 border">Nama Kos</th>
                  <th className="px-4 py-3 border">Alamat</th>
                  <th className="px-4 py-3 border">Tanggal</th>
                  <th className="px-4 py-3 border">Status</th>
                  <th className="px-4 py-3 border text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id_booking} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 border font-medium">{b.name}</td>
                    <td className="px-4 py-3 border">{b.address}</td>
                    <td className="px-4 py-3 border">
                      {b.start_date} → {b.end_date}
                    </td>
                    <td className="px-4 py-3 border">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          b.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : b.status === "accept"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {b.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 border text-center space-x-2">
                      {b.status === "pending" && (
                        <>
                          <Button
                            className="bg-green-600 hover:bg-green-700 text-white text-xs"
                            onClick={() => {
                              setSelectedBooking(b);
                              setShowAccept(true);
                            }}
                          >
                            Terima
                          </Button>
                          <Button
                            className="bg-red-600 hover:bg-red-700 text-white text-xs"
                            onClick={() => {
                              setSelectedBooking(b);
                              setShowReject(true);
                            }}
                          >
                            Tolak
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modals */}
      {selectedBooking && (
        <>
          <AcceptBooking
            isShow={showAccept}
            onClose={() => setShowAccept(false)}
            booking={selectedBooking}
            onSuccess={fetchBookings}
          />
          <RejectBooking
            isShow={showReject}
            onClose={() => setShowReject(false)}
            booking={selectedBooking}
            onSuccess={fetchBookings}
          />
        </>
      )}
    </div>
  );
}
