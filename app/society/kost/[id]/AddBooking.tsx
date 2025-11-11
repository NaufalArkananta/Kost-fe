"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";

interface AddBookingProps {
  kostId: number | string;
  isShow: boolean;
  onClose: () => void;
}

export default function AddBooking({ kostId, isShow, onClose }: AddBookingProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isShow) return null;

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      toast.warning("Tanggal mulai dan selesai wajib diisi!");
      return;
    }

    try {
      setLoading(true);
      const token = Cookies.get("access_token");

      const res = await axiosInstance.post(
        "/society/booking",
        {
          kos_id: kostId,
          start_date: startDate,
          end_date: endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.status === "success") {
        toast.success(res.data.message || "Booking berhasil dibuat!");
        onClose();
      } else {
        toast.error(res.data.message || "Gagal membuat booking!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Terjadi kesalahan saat booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-[#2E8B57] mb-4 text-center">
          Booking Kost
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-[#2E8B57]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tanggal Selesai
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-[#2E8B57]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Batal
          </button>

          <button
            onClick={handleBooking}
            disabled={loading}
            className="px-4 py-2 bg-[#2E8B57] text-white rounded-md hover:bg-[#276e47] transition disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
