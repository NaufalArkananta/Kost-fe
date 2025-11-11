"use client";

import React from "react";

interface BookingFilterProps {
  month: number | "all";
  year: number | "all";
  setMonth: (month: number | "all") => void;
  setYear: (year: number | "all") => void;
}

export default function BookingFilter({
  month,
  year,
  setMonth,
  setYear,
}: BookingFilterProps) {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="max-w-5xl mx-auto bg-white border border-gray-200 mt-6 p-6 rounded-xl shadow-md flex flex-wrap justify-center gap-4">
      {/* Select Month */}
      <select
        value={month}
        onChange={(e) => setMonth(e.target.value === "all" ? "all" : Number(e.target.value))}
        className="bg-white text-gray-700 px-5 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#2E8B57]"
      >
        <option value="all">Semua Bulan</option>
        {months.map((m, idx) => (
          <option key={idx} value={idx + 1}>
            {m}
          </option>
        ))}
      </select>

      {/* Select Year */}
      <select
        value={year}
        onChange={(e) => setYear(e.target.value === "all" ? "all" : Number(e.target.value))}
        className="bg-white text-gray-700 px-5 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#2E8B57]"
      >
        <option value="all">Semua Tahun</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
