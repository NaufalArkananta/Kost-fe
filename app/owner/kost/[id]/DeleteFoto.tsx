"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";

type Props = {
  imageId: number;
  filePath: string;
};

export default function DeleteFoto({ imageId, filePath }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm("Yakin ingin menghapus foto ini?");
    if (!confirmDelete) return;

    try {
      const access_token = Cookies.get("access_token");
      if (!access_token) {
        toast("Token tidak ditemukan, silakan login ulang", { type: "error" });
        return;
      }

      // 🔹 1. Hapus di backend (database)
      const res = await axiosInstance.delete(`/admin/delete_image/${imageId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (res.data.status === "success") {
        // 🔹 2. Hapus file lokal dari /public/images
// 🔹 2. Hapus file lokal dari /public/images (Next.js local API)
const delRes = await fetch("/api/delete-local-image", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ filePath }),
});

const delData = await delRes.json();

if (delData.status === "success") {
  toast("Foto berhasil dihapus", { type: "success" });
  setTimeout(() => router.refresh(), 1000);
} else {
  toast("Foto dihapus di database tapi gagal hapus file lokal", {
    type: "warning",
  });
}
      } else {
        toast(res.data.message || "Gagal menghapus foto", { type: "error" });
      }
    } catch (err) {
      console.error(err);
      toast("Terjadi kesalahan saat menghapus foto", { type: "error" });
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 text-white p-1 rounded-full shadow"
      title="Hapus foto"
    >
      <X size={16} />
    </button>
  );
}
