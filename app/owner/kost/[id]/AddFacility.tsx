"use client";

import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function AddFacility({ kosId }: { kosId: number }) {
  const [showInput, setShowInput] = useState(false);
  const [facilityName, setFacilityName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!facilityName.trim()) {
      toast("Nama fasilitas tidak boleh kosong", { type: "warning" });
      return;
    }

    try {
      setLoading(true);

      const access_token = Cookies.get("access_token");

      const res = await axiosInstance.post(
        `/admin/store_facility/${kosId}`,
        { facility_name: facilityName },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      if (res.data.status) {
        toast("Fasilitas berhasil ditambahkan!", { type: "success" });
        setFacilityName("");
        setShowInput(false);
        router.refresh();
      } else {
        toast(res.data.message || "Gagal menambah fasilitas", { type: "error" });
      }
    } catch (err) {
      console.error(err);
      toast("Terjadi kesalahan saat menambah fasilitas", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {showInput ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Nama fasilitas..."
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
            disabled={loading}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
          <button
            onClick={() => setShowInput(false)}
            className="text-gray-500 text-sm px-2"
          >
            Batal
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
        >
          <Plus size={14} /> Tambah
        </button>
      )}
    </div>
  );
}
