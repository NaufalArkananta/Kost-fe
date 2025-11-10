"use client";

import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import Modal from "@/components/Modal";

type Props = {
  facilityId: number;
  currentName: string;
};

export default function UpdateFacility({ facilityId, currentName }: Props) {
  const [show, setShow] = useState(false);
  const [facilityName, setFacilityName] = useState(currentName);
  const router = useRouter();
  const access_token = Cookies.get("access_token");

  const handleUpdate = async () => {
    if (!facilityName.trim()) {
      toast.warning("Nama fasilitas tidak boleh kosong");
      return;
    }

    try {
      const res = await axiosInstance.put(
        `admin/update_facility/${facilityId}`,
        { facility_name: facilityName },
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      if (res.data.status === true) {
        toast.success("Fasilitas berhasil diperbarui");
        setShow(false);
        setTimeout(() => router.refresh(), 800);
      } else {
        toast.warning(res.data.message || "Gagal memperbarui fasilitas");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat memperbarui fasilitas");
    }
  };

  return (
    <>
      {/* Tombol Edit */}
      <button
        onClick={() => setShow(true)}
        title="Edit fasilitas"
        className="text-blue-500 hover:text-blue-700 text-xs font-semibold"
      >
        <Pencil size={14} />
      </button>

      {/* Modal Edit */}
      <Modal isShow={show} onClose={() => setShow(false)}>
        <h1 className="text-lg font-semibold text-gray-800 mb-4">
          Edit Fasilitas
        </h1>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Fasilitas
        </label>
        <input
          type="text"
          value={facilityName}
          onChange={(e) => setFacilityName(e.target.value)}
          placeholder="Masukkan nama fasilitas baru"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
        />

        <div className="flex justify-end mt-5 gap-2">
          <button
            onClick={() => setShow(false)}
            className="px-3 py-2 bg-gray-300 hover:bg-gray-400 rounded text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleUpdate}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
          >
            Simpan
          </button>
        </div>
      </Modal>
    </>
  );
}
