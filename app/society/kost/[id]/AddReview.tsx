"use client";

import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";
import Modal from "@/components/Modal";
import Cookies from "js-cookie";

interface AddReviewProps {
  kostId: string | string[];
  isShow: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddReview({ kostId, isShow, onClose, onSuccess }: AddReviewProps) {
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!review.trim()) {
      toast.error("Review tidak boleh kosong");
      return;
    }

    setLoading(true);
    try {
      const token = Cookies.get("access_token");

      const res = await axiosInstance.post(
        `/society/store_reviews/${kostId}`,
        { review },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.status) {
        toast.success(res.data.message);
        onSuccess();
        onClose();
        setReview("");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menambah review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isShow={isShow} onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">Tambah Review</h2>

      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Tulis review kamu..."
        className="w-full border border-gray-300 rounded-md p-2 mb-4"
        rows={4}
      />

      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">
          Batal
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </Modal>
  );
}
