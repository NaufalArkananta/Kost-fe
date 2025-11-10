"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { X } from "lucide-react";

type Props = {
  imageId: number;
};

export default function DeleteFoto({ imageId }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm("Yakin ingin menghapus foto ini?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/delete-image/${imageId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        toast("Foto berhasil dihapus", { type: "success" });
        setTimeout(() => router.refresh(), 800);
      } else {
        toast(data.message || "Gagal menghapus foto", { type: "warning" });
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
