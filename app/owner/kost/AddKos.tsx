"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, ChangeEvent } from "react";
import Modal from "@/components/Modal";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";

const AddKos = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [gender, setGender] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const openModal = () => {
    setShow(true);
    setName("");
    setAddress("");
    setPrice("");
    setGender("");
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
      const user_id = Cookies.get("user_id");

      if (!access_token) {
        toast("Token tidak ditemukan, silakan login ulang", { type: "error" });
        return;
      }

      // 1️⃣ Simpan data kos dulu ke backend Laravel
      const res = await axiosInstance.post(
        "/admin/store_kos",
        {
          user_id,
          name,
          address,
          price_per_month: price,
          gender,
        },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      if (res.data.status !== true && res.data.status !== "success") {
        toast(res.data.message || "Gagal menambah kos", { type: "warning" });
        return;
      }

      const kos_id = res.data.data?.id ?? res.data.kos?.id;

      // 2️⃣ Upload ke backend untuk insert ke database dan dapat nama file
      if (file && kos_id) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await axiosInstance.post(
          `/admin/upload_image/${kos_id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (uploadRes.data.status !== "success") {
          toast("Gagal upload ke backend", { type: "error" });
          return;
        }

        // Ambil nama file dari backend Laravel
        const filePath = uploadRes.data.data.file; // contoh: "images/1762743687_Screenshot.png"

        // 3️⃣ Upload file ke public/images di Next.js agar tersimpan fisik
        const uploadForm = new FormData();
        uploadForm.append("file", file);
        uploadForm.append("filePath", filePath);

        const nextRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm,
        });

        const nextData = await nextRes.json();

        if (nextData.status !== "success") {
          toast("Gagal menyimpan file ke public/images", { type: "error" });
          return;
        }
      }

      toast("Berhasil menambah kos", { type: "success" });
      setShow(false);
      setTimeout(() => router.refresh(), 1000);
    } catch (err) {
      console.error(err);
      toast("Terjadi kesalahan saat menambah kos", { type: "error" });
    }
  };

  return (
    <div>
      <ToastContainer containerId="addKos" />
      <button
        className="px-4 py-2 rounded-md bg-lime-600 hover:bg-lime-500 text-white"
        onClick={openModal}
      >
        Tambah Kos
      </button>

      <Modal isShow={show}>
        <form onSubmit={handleSubmit}>
          <div className="p-3">
            <h1 className="font-semibold text-lg">Tambah Data Kos</h1>

            <div className="mt-2">
              <label className="block text-sm font-medium text-sky-600">
                Nama
              </label>
              <input
                className="w-full border p-1 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mt-2">
              <label className="block text-sm font-medium text-sky-600">
                Alamat
              </label>
              <input
                className="w-full border p-1 rounded"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="mt-2">
              <label className="block text-sm font-medium text-sky-600">
                Harga per bulan
              </label>
              <input
                className="w-full border p-1 rounded"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="mt-2">
              <label className="block text-sm font-medium text-sky-600">
                Gender
              </label>
              <input
                className="w-full border p-1 rounded"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
            </div>

            <div className="mt-2">
              <label className="block text-sm font-medium text-sky-600">
                Foto Kos
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full border p-1 rounded"
                onChange={handleFileChange}
              />
            </div>
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
};

export default AddKos;
