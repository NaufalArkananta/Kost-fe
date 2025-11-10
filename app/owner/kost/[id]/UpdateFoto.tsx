"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { toast, ToastContainer } from "react-toastify";
import Modal from "@/components/Modal";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Edit2 } from "lucide-react";

export default function UpdateFoto({ imageId }: { imageId: number }) {
  const [show, setShow] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const openModal = () => {
    setShow(true);
    setFile(null);
  };

  const closeModal = () => setShow(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const access_token = Cookies.get("access_token");
      if (!access_token) {
        toast("Token tidak ditemukan, silakan login ulang", { type: "error" });
        return;
      }

      if (!file) {
        toast("Pilih foto terlebih dahulu", { type: "warning" });
        return;
      }

      // 🔹 Kirim update ke backend
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post(
        `/admin/update_image/${imageId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status !== "success") {
        toast("Gagal memperbarui gambar", { type: "error" });
        return;
      }

      // 🔹 Upload ke public/images (Next.js local)
      const filePath = response.data.data.file; // e.g. "images/1762786686_horizontal-logo.png"
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("filePath", filePath);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadForm,
      });

      const uploadData = await uploadRes.json();
      if (uploadData.status !== "success") {
        toast("Gagal menyimpan file di server", { type: "error" });
        return;
      }

      toast("Foto berhasil diperbarui", { type: "success" });
      setShow(false);
      setTimeout(() => router.refresh(), 1000);
    } catch (err) {
      console.error(err);
      toast("Terjadi kesalahan saat update foto", { type: "error" });
    }
  };

  return (
    <div>
      <ToastContainer containerId="updateFoto" />
      <button
        className="absolute top-1 left-1 bg-yellow-500 hover:bg-yellow-400 text-white p-1.5 rounded-full text-xs"
        onClick={openModal}
        title="Edit foto"
      >
        <Edit2 size={14} />
      </button>

      <Modal isShow={show}>
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <h1 className="font-semibold text-lg mb-3">Update Foto Kos</h1>

            <label className="block text-sm font-medium text-sky-600 mb-1">
              Pilih Foto Baru
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full border p-1 rounded"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex justify-end p-3 gap-2">
            <button
              type="button"
              className="px-3 py-2 bg-slate-700 text-white rounded"
              onClick={closeModal}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3 py-2 bg-yellow-600 text-white rounded"
            >
              Update
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
