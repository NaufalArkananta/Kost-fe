"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Link from "next/link";
import CetakNota from "./CetakNota";

type Booking = {
  kos_id: any;
  id_booking: number;
  name: string;
  address: string;
  price_per_month: string;
  gender: string;
  start_date: string;
  end_date: string;
  status: string;
  user_id: number;
};

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fetchBookings = async (status?: string) => {
    try {

          const userId = Cookies.get("user_id");
  const token = Cookies.get("access_token");
      setLoading(true);
      const url = status
        ? `/society/show_bookings?status=${status}`
        : `/society/show_bookings`;

      const res = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetch Bookings Response:", res.data);
      console.log("Current User ID:", userId);

      if (res.data.status === "success") {
        // Filter hanya milik user login
        // const userBookings = res.data.data.filter(
        //   (b: Booking) => String(b.user_id) === String(userId) //b.user_id
        // );
        // setBookings(userBookings);
        setBookings(res.data.data);
      } else {
        toast.error("Gagal mengambil data booking");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal mengambil data booking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(statusFilter);
  }, [statusFilter]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#2E8B57] mb-6 text-center">
          Riwayat Booking Kost
        </h1>

        {/* Filter Status */}
        <div className="flex justify-center gap-3 mb-8">
          {["", "pending", "accept", "reject"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                statusFilter === status
                  ? "bg-[#2E8B57] text-white"
                  : "bg-white border text-gray-700 hover:bg-green-50"
              }`}
            >
              {status === "" ? "Semua" : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Daftar Booking */}
        {loading ? (
          <p className="text-center text-gray-600">Memuat data...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-500">
            Belum ada riwayat booking ditemukan.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
{bookings.map((b) => (
  <div
    key={b.id_booking}
    className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:shadow-md transition"
  >
    <h2 className="text-lg font-semibold text-[#2E8B57] mb-1">{b.name}</h2>
    <p className="text-sm text-gray-600 mb-2">{b.address}</p>

    <div className="text-gray-700 text-sm space-y-1 mb-3">
      <p>
        <span className="font-medium">Harga:</span>{" "}
        Rp{Number(b.price_per_month).toLocaleString("id-ID")}/bulan
      </p>
      <p>
        <span className="font-medium">Tanggal:</span>{" "}
        {b.start_date} – {b.end_date}
      </p>
      <p>
        <span className="font-medium">Gender:</span> {b.gender.toUpperCase()}
      </p>
    </div>

    {/* Status */}
    <div
      className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
        b.status === "accept"
          ? "bg-green-100 text-green-700"
          : b.status === "reject"
          ? "bg-red-100 text-red-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {b.status.toUpperCase()}
    </div>

    {/* Link Detail & Tombol Cetak */}
    <div className="mt-4 flex flex-col gap-2">
      <Link
        href={`/society/kost/${b.kos_id}`}
        className="text-[#2E8B57] text-sm font-medium hover:underline"
      >
        Lihat Detail Kost →
      </Link>

      {/* 🔥 Tampilkan tombol cetak hanya jika accept */}
{b.status === "accept" && (
  <div>
    <hr className="my-2" />
    <CetakNota bookingId={b.id_booking} />
  </div>
)}
    </div>
  </div>
))}
          </div>
        )}
      </div>
    </div>
  );
}
