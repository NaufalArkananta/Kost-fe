"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import BookingFilter from "./BookingFilter";

type BookingType = {
  id_booking: number;
  kos_id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  name: string;
  address: string;
  price_per_month: string;
  gender: string;
};

export default function HistoryPage() {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState<number | "all">("all");
  const [year, setYear] = useState<number | "all">("all");
  const [message, setMessage] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const access_token = Cookies.get("access_token");
      if (!access_token) {
        setBookings([]);
        setMessage("Token tidak ditemukan. Silakan login ulang.");
        return;
      }

      let url = "admin/show_bookings";

      if (month !== "all" && year !== "all") {
        const date = dayjs(`${year}-${String(month).padStart(2, "0")}-01`)
          .endOf("month")
          .format("YYYY-MM-DD");
        url += `?status=&tgl=${date}`;
      }

      const res = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (res.data.status === "success") {
        setBookings(res.data.data || []);
        if (!res.data.data || res.data.data.length === 0) {
          setMessage("Tidak ada data booking.");
        }
      } else if (res.data.status === "failed") {
        setBookings([]);
        setMessage(res.data.message || "Tidak ada data booking.");
      } else {
        setBookings([]);
        setMessage("Tidak ada data booking.");
      }
    } catch (err) {
      console.error(err);
      setBookings([]);
      setMessage("Tidak ada data booking.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [month, year]);

  return (
    <div className="p-5 bg-white text-black min-h-screen">
      <h1 className="text-2xl font-semibold mb-5 text-[#2E8B57]">
        Riwayat Booking
      </h1>

      {/* 🔹 Filter */}
      <BookingFilter month={month} year={year} setMonth={setMonth} setYear={setYear} />

      {/* 🔹 Tabel */}
      <div className="overflow-x-auto mt-5">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-3 py-2 text-left">No</th>
              <th className="border px-3 py-2 text-left">Nama Kos</th>
              <th className="border px-3 py-2 text-left">Tanggal Booking</th>
              <th className="border px-3 py-2 text-left">Status</th>
              <th className="border px-3 py-2 text-left">Dibuat Pada</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-5 text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : bookings.length > 0 ? (
              bookings.map((b, idx) => (
                <tr key={b.id_booking} className="border-b hover:bg-gray-50">
                  <td className="border px-3 py-2">{idx + 1}</td>
                  <td className="border px-3 py-2">{b.name}</td>
                  <td className="border px-3 py-2">
                    {dayjs(b.start_date).format("DD MMM YYYY")} -{" "}
                    {dayjs(b.end_date).format("DD MMM YYYY")}
                  </td>
                  <td className="border px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        b.status === "accept"
                          ? "bg-green-100 text-green-700"
                          : b.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="border px-3 py-2">
                    {dayjs(b.created_at).format("DD/MM/YYYY HH:mm")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-5 text-gray-500">
                  {message || "Tidak ada data booking."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
