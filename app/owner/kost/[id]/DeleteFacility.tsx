"use client";

import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import Cookies from "js-cookie";

type Props = {
  facilityId: number;
};

export default function DeleteFacility({ facilityId }: Props) {
  const router = useRouter();
  const access_token = Cookies.get("access_token");

  const handleDelete = async () => {
    const confirmDelete = confirm("Yakin ingin menghapus fasilitas ini?");
    if (!confirmDelete) return;

    try {
      const res = await axiosInstance.delete(`admin/delete_facility/${facilityId}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      if (res.data.status === true) {
        toast.success("Fasilitas berhasil dihapus");
        setTimeout(() => router.refresh(), 800);
      } else {
        toast.warning(res.data.message || "Gagal menghapus fasilitas");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat menghapus fasilitas");
    }
  };

  return (
    <button
      onClick={handleDelete}
      title="Hapus fasilitas"
      className="text-red-500 hover:text-red-700 text-xs font-semibold"
    >
      <X size={14} />
    </button>
  );
}
