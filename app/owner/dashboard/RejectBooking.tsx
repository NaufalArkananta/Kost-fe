"use client";

import Modal from "@/components/Modal";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useState } from "react";

interface Props {
  isShow: boolean;
  onClose: () => void;
  booking: any;
  onSuccess: () => void;
}

export default function RejectBooking({ isShow, onClose, booking, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("access_token");

      const res = await axiosInstance.put(
        `/admin/update_status_booking/${booking.id_booking}`,
        { status: "reject" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === "success") {
        toast.success("Booking ditolak!");
        onSuccess();
        onClose();
      } else {
        toast.error("Gagal menolak booking");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isShow={isShow} onClose={onClose}>
      <h2 className="text-lg font-semibold text-center mb-4">
        Yakin ingin <span className="text-red-600">menolak</span> booking ini?
      </h2>
      <div className="flex justify-center gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
        >
          Batal
        </button>
        <button
          onClick={handleReject}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Tolak"}
        </button>
      </div>
    </Modal>
  );
}
