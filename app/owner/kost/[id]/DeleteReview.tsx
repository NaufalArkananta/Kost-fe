"use client";

import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function DeleteReview({ reviewId }: { reviewId: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus review ini?")) return;
    try {
      const access_token = Cookies.get("access_token");
      const res = await axiosInstance.delete(`admin/delete_review/${reviewId}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (res.data.status) {
        toast.success("Review berhasil dihapus");
        setTimeout(() => router.refresh(), 1000);
      } else {
        toast.error("Gagal menghapus review");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat menghapus review");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 text-xs hover:underline"
    >
      Hapus
    </button>
  );
}
