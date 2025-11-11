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

export default function AcceptBooking({ isShow, onClose, booking, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("access_token");

      const res = await axiosInstance.put(
        `/admin/update_status_booking/${booking.id_booking}`,
        { status: "accept" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === "success") {
        toast.success("Booking diterima!");
        onSuccess();
        onClose();
      } else {
        toast.error("Gagal menerima booking");
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
        Yakin ingin <span className="text-green-600">menerima</span> booking ini?
      </h2>
      <div className="flex justify-center gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
        >
          Batal
        </button>
        <button
          onClick={handleAccept}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Terima"}
        </button>
      </div>
    </Modal>
  );
}
