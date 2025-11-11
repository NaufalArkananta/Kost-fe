"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FilterBar() {
  const router = useRouter();
  const [search, setSearch] = useState("all"); // gunakan 'search' karena backend pakai search

  const handleFilter = () => {
    router.push(`/society/kost?search=${search}`);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white border border-gray-200 mt-24 p-6 rounded-xl shadow-md flex flex-wrap justify-center gap-4">
      {/* Select Gender */}
      <select
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-white text-gray-700 px-5 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#2E8B57]"
      >
        <option value="all">Semua Jenis</option>
        <option value="male">Putra</option>
        <option value="female">Putri</option>
      </select>

      {/* Tombol Filter */}
      <button
        onClick={handleFilter}
        className="bg-[#F8E16C] text-[#2E8B57] font-bold px-8 py-3 rounded-md hover:bg-[#f5d850] transition"
      >
        Tampilkan
      </button>
    </div>
  );
}
