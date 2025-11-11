"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, X } from "lucide-react";
import AddReview from "./AddReview";
import DeleteReview from "./DeleteReview";
import AddBooking from "./AddBooking";

export default function KostDetail({ params }: { params: { id: string } }) {
  const [kost, setKost] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [showBooking, setShowBooking] = useState(false);


  const userId = Cookies.get("user_id"); // 🔥 ambil user_id dari cookie

  const fetchKostDetail = async () => {
    try {
      const token = Cookies.get("access_token");
      const res = await axiosInstance.get(`society/detail_kos/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.status === "success") setKost(res.data.data);
    } catch (err) {
      console.error("Error fetching kost detail:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const token = Cookies.get("access_token");
      const res = await axiosInstance.get(`society/show_reviews/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status === true) {
        const fetchedReviews = res.data.data.reviews || [];

        // 🔥 Tandai mana review milik user yang login
        const reviewsWithOwnerFlag = fetchedReviews.map((r: any) => ({
          ...r,
          is_owner: String(r.user_id) === String(userId),
        }));

        setReviews(reviewsWithOwnerFlag);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchKostDetail();
    fetchReviews();
  }, []);

  if (!kost) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        <p>Kost tidak ditemukan 😢</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/society/kost"
          className="flex items-center gap-2 text-[#2E8B57] hover:underline mb-6 font-medium"
        >
          <ArrowLeft size={18} /> Kembali ke daftar kost
        </Link>

        {/* === Gambar === */}
        <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-xl">
          <Image
            src={
              kost.kos_image?.length
                ? `/images/${encodeURI(
                    kost.kos_image[0].file
                      .replace("images/", "")
                      .replace(/\s+/g, "_")
                  )}`
                : "/images/kamar1.jpeg"
            }
            alt={kost.name}
            fill
            className="object-cover"
            unoptimized
          />
          <span className="absolute top-4 left-4 bg-[#2E8B57] text-white text-xs px-3 py-1 rounded-full">
            {kost.gender?.toUpperCase()}
          </span>
        </div>

        {/* === Detail Kos === */}
        <div className="mt-8">
          <h1 className="text-3xl font-bold text-[#2E8B57]">{kost.name}</h1>
          <p className="text-gray-600 mt-2">{kost.address}</p>

          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-[#2E8B57] font-bold text-3xl">
              Rp{Number(kost.price_per_month).toLocaleString("id-ID")}/bulan
            </span>
          </div>

          {/* Tombol Booking */}
<div className="mt-6">
  <button
    onClick={() => setShowBooking(true)}
    className="bg-[#2E8B57] text-white px-5 py-2 rounded-md hover:bg-[#276e47] transition"
  >
    Booking Kost
  </button>
</div>

          <hr className="my-6 border-gray-200" />
          <p className="text-gray-700 leading-relaxed text-lg">
            {kost.description || "Tidak ada deskripsi tersedia."}
          </p>

          {/* === Fasilitas === */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-[#2E8B57] mb-4">
              Fasilitas
            </h2>
            {kost.kos_facilities?.length ? (
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {kost.kos_facilities.map((f: any, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg"
                  >
                    <span>{f.facility_name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Belum ada fasilitas terdaftar.</p>
            )}
          </div>

          {/* === Review === */}
          <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#2E8B57]">
                Review Penghuni
              </h2>
              <button
                onClick={() => setShowAdd(true)}
                className="bg-[#2E8B57] text-white px-4 py-2 rounded-md hover:bg-[#276e47] transition"
              >
                + Tambah Review
              </button>
            </div>

            {reviews.length === 0 ? (
              <p className="text-gray-500">Belum ada review.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r: any) => (
                  <div
                    key={r.id}
                    className="relative border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
                  >
                    {/* Tombol X hanya tampil jika user pemilik */}
                    {r.is_owner && (
                      <button
                        onClick={() => {
                          setSelectedReviewId(r.id);
                          setShowDelete(true);
                        }}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                      >
                        <X size={18} />
                      </button>
                    )}

                    <p className="text-gray-600 mt-2">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Modal konfirmasi hapus */}
            <DeleteReview
              reviewId={selectedReviewId}
              isShow={showDelete}
              onClose={() => setShowDelete(false)}
              onSuccess={fetchReviews}
            />
          </div>
        </div>
      </div>

      {/* === MODAL TAMBAH REVIEW === */}
      <AddReview
        kostId={params.id}
        isShow={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={fetchReviews}
      />

      {/* === MODAL TAMBAH BOOKING === */}
      <AddBooking
  kostId={params.id}
  isShow={showBooking}
  onClose={() => setShowBooking(false)}
/>
    </div>
  );
}
