"use client";

import { useState, FormEvent } from "react";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function AddReview({ kosId }: { kosId: number }) {
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!review.trim()) {
      toast.warning("Tulis review terlebih dahulu");
      return;
    }

    try {
      setLoading(true);
      const access_token = Cookies.get("access_token");
      const res = await axiosInstance.post(
        `admin/store_reviews/${kosId}`,
        { review },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      if (res.data.status) {
        toast.success("Review berhasil ditambahkan");
        setReview("");
        setTimeout(() => router.refresh(), 1000);
      } else {
        toast.error("Gagal menambahkan review");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat menambahkan review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Tulis review..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-[#2E8B57] text-white px-4 py-2 rounded hover:opacity-90 text-sm"
      >
        {loading ? "Kirim..." : "Tambah"}
      </button>
    </form>
  );
}
