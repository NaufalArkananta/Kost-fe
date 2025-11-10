"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { toast, ToastContainer } from "react-toastify";
import Modal from "@/components/Modal";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function AddFoto({ kos_id }: { kos_id: number }) {
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

      // 1️⃣ Kirim ke backend untuk disimpan di database
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post(
        `/admin/upload_image/${kos_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status !== "success") {
        toast("Gagal menyimpan data ke database", { type: "error" });
        return;
      }

      // Ambil nama file dari response backend
      const filePath = response.data.data.file; // contoh: "images/1762743687_Screenshot.png"

      // 2️⃣ Upload file ke public/images di Next.js pakai nama yang sama
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("filePath", filePath); // kirim path ke API upload

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadForm,
      });

      const uploadData = await uploadRes.json();
      if (uploadData.status !== "success") {
        toast("Gagal menyimpan file di server", { type: "error" });
        return;
      }

      toast("Foto berhasil ditambahkan", { type: "success" });
      setShow(false);
      setTimeout(() => router.refresh(), 1000);
    } catch (err) {
      console.error(err);
      toast("Terjadi kesalahan saat upload", { type: "error" });
    }
  };

  return (
    <div>
      <ToastContainer containerId="addFoto" />
      <button
        className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-sm"
        onClick={openModal}
      >
        Tambah Foto
      </button>

      <Modal isShow={show}>
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <h1 className="font-semibold text-lg mb-3">Tambah Foto Kos</h1>

            <label className="block text-sm font-medium text-sky-600 mb-1">
              Pilih Foto
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
              className="px-3 py-2 bg-sky-700 text-white rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
