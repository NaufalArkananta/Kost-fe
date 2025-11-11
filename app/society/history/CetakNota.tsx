"use client";

import { useState } from "react";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Modal from "@/components/Modal";
import { FileDown, Eye } from "lucide-react";

interface CetakNotaProps {
  bookingId: number;
}

export default function CetakNota({ bookingId }: CetakNotaProps) {
  const [isShow, setIsShow] = useState(false);
  const [notaData, setNotaData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchNota = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("access_token");

      const res = await axiosInstance.get(`/society/cetak_nota/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status === "success") {
        setNotaData(res.data.data);
        setIsShow(true);
      } else {
        toast.error("Gagal memuat nota.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal memuat nota ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const token = Cookies.get("access_token");

      const res = await axiosInstance.get(`/society/cetak_nota/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const fileURL = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `nota-booking-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Nota berhasil diunduh ✅");
    } catch (err: any) {
      toast.error("Gagal mengunduh nota ❌");
    }
  };

  return (
    <>
      {/* Tombol Buka Preview */}
      <button
        onClick={fetchNota}
        disabled={loading}
        className="flex items-center gap-1 text-xs text-white bg-[#2E8B57] hover:bg-[#276e47] px-3 py-2 rounded-md transition mt-3"
      >
        <Eye size={14} />
        {loading ? "Memuat..." : "Lihat Nota"}
      </button>

      {/* Modal Preview Nota */}
      <Modal isShow={isShow} onClose={() => setIsShow(false)}>
        {notaData ? (
          <div className="space-y-4 text-sm text-gray-800">
            <h2 className="text-xl font-semibold text-center text-[#2E8B57] mb-4">
              Nota Pemesanan Kost
            </h2>

            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="mb-2 flex justify-between">
                <p>
                  <span className="font-medium">ID Booking:</span>{" "}
                  {notaData.id_booking}
                </p>
                <p className="text-gray-600 text-sm">
                  Tanggal:{" "}
                  {new Date(notaData.created_at).toLocaleDateString("id-ID")}
                </p>
              </div>

              <p>
                <span className="font-medium">Nama Kost:</span> {notaData.name}
              </p>
              <p>
                <span className="font-medium">Alamat:</span> {notaData.address}
              </p>
              <p>
                <span className="font-medium">Harga:</span>{" "}
                Rp{Number(notaData.price_per_month).toLocaleString("id-ID")}/bulan
              </p>
              <p>
                <span className="font-medium">Periode:</span>{" "}
                {notaData.start_date} - {notaData.end_date}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`font-semibold ${
                    notaData.status === "accept"
                      ? "text-green-600"
                      : notaData.status === "reject"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {notaData.status.toUpperCase()}
                </span>
              </p>
            </div>

            <div className="border-t border-gray-200 pt-3 text-center text-xs text-gray-500">
              Terima kasih telah menggunakan layanan Kost Hunter 🏠
            </div>

            {/* Tombol Aksi */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsShow(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-sm"
              >
                Tutup
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-[#2E8B57] text-white rounded-md hover:bg-[#276e47] text-sm"
              >
                <FileDown size={14} className="inline mr-1" />
                Download Nota
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Memuat nota...</p>
        )}
      </Modal>
    </>
  );
}
