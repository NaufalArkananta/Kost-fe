"use client";

import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";
import Modal from "@/components/Modal";
import { useState } from "react";
import Cookies from "js-cookie";

interface DeleteReviewProps {
  reviewId: number | null;
  isShow: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteReview({ reviewId, isShow, onClose, onSuccess }: DeleteReviewProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!reviewId) return;
    setLoading(true);

    try {
      const token = Cookies.get("access_token");

      const res = await axiosInstance.delete(`/society/delete_review/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.status) {
        toast.success(res.data.message);
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menghapus review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isShow={isShow} onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4 text-center">
        Yakin ingin menghapus review ini?
      </h2>

      <div className="flex justify-center gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Batal
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Menghapus..." : "Hapus"}
        </button>
      </div>
    </Modal>
  );
}
