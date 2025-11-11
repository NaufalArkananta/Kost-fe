"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FilterBar() {
  const router = useRouter();
  const [gender, setGender] = useState("");
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    const query = new URLSearchParams();
    if (gender) query.set("gender", gender);
    if (search) query.set("search", search);

    router.push(`/society/kost?${query.toString()}`);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white border border-gray-200 mt-24 p-6 rounded-xl shadow-md flex flex-wrap justify-center gap-4">
      {/* Select Gender */}
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="bg-white text-gray-700 px-5 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#2E8B57]"
      >
        <option value="">Semua Jenis</option>
        <option value="Putra">Putra</option>
        <option value="Putri">Putri</option>
        <option value="Campur">Campur</option>
      </select>

      {/* Input Search */}
      <input
        type="text"
        placeholder="Cari nama kost atau lokasi..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-white text-gray-700 px-5 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#2E8B57] w-64"
      />

      {/* Tombol Cari */}
      <button
        onClick={handleSearch}
        className="bg-[#F8E16C] text-[#2E8B57] font-bold px-8 py-3 rounded-md hover:bg-[#f5d850] transition"
      >
        CARI
      </button>
    </div>
  );
}
