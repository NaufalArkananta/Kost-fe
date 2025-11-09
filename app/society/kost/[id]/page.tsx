import axiosInstance from "@/lib/axios";
import { getServerCookie } from "@/lib/server-cookies";
import {
  ArrowLeft,
  Car,
  Droplet,
  MapPin,
  ShieldCheck,
  Tv,
  UtensilsCrossed,
  Wifi,
  Wind
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FacilityIcon = ({ name }: { name: string }) => {
  const icons: any = {
    WiFi: <Wifi size={18} className="text-[#2E8B57]" />,
    Parkir: <Car size={18} className="text-[#2E8B57]" />,
    Dapur: <UtensilsCrossed size={18} className="text-[#2E8B57]" />,
    "Keamanan 24 Jam": <ShieldCheck size={18} className="text-[#2E8B57]" />,
    "Air Panas": <Droplet size={18} className="text-[#2E8B57]" />,
    AC: <Wind size={18} className="text-[#2E8B57]" />,
    TV: <Tv size={18} className="text-[#2E8B57]" />,
  };
  return icons[name] || null;
};

const getDetailKost = async (id: number): Promise<any | null> => {
  try {
    const url = `society/detail_kos/${id}`
    const access_token = await getServerCookie(`access_token`)
    const response: any = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = response.data.data
    if (response.data.status === "success")
      return data

    return null
  } catch (error) {
    console.log(error);
    return null
  }
}

const getReviewlKost = async (id: number): Promise<any | null> => {
  try {
    const url = `society/show_reviews/${id}`
    const access_token = await getServerCookie(`access_token`)
    const response: any = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = response.data.data

    if (response.data.status === true)
      return data

    return []
  } catch (error) {
    console.log(error);
    return []
  }
}

export default async function KostDetail({ params }: { params: { id: string } }) {
  const kost = await getDetailKost(parseInt(params.id));
  const reviews = await getReviewlKost(parseInt(params.id));
  // const kost = kostList.find((k) => k.id === parseInt(params.id));
  // const id = myprops.params.id
  // const kost = getDetailKost(id);
  console.log("KOST DETAIL:", kost);
  console.log("REVIEWS DETAIL:", reviews);

  // const [showBooking, setShowBooking] = useState(false);
  // const [form, setForm] = useState({
  //   nama: "",
  //   hp: "",
  //   tanggalMasuk: "",
  //   durasi: "",
  //   catatan: "",
  // });
  // const [success, setSuccess] = useState(false);
  // const [riwayat, setRiwayat] = useState<any[]>([]);

  // // === 🔹 Ambil riwayat dari localStorage saat halaman dibuka ===
  // useEffect(() => {
  //   const stored = localStorage.getItem("riwayatBooking");
  //   if (stored) setRiwayat(JSON.parse(stored));
  // }, []);

  // // === 🔹 Simpan riwayat ke localStorage ===
  // const simpanRiwayat = (data: any) => {
  //   const updated = [...riwayat, data];
  //   setRiwayat(updated);
  //   localStorage.setItem("riwayatBooking", JSON.stringify(updated));
  // };

  // const handleBooking = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const bookingData = {
  //     id: Date.now(),
  //     kostName: kost?.name,
  //     nama: form.nama,
  //     hp: form.hp,
  //     tanggalMasuk: form.tanggalMasuk,
  //     durasi: form.durasi,
  //     catatan: form.catatan,
  //     tanggalBooking: new Date().toLocaleString("id-ID"),
  //   };

  //   simpanRiwayat(bookingData);
  //   setSuccess(true);

  //   setTimeout(() => {
  //     setShowBooking(false);
  //     setSuccess(false);
  //     setForm({
  //       nama: "",
  //       hp: "",
  //       tanggalMasuk: "",
  //       durasi: "",
  //       catatan: "",
  //     });
  //   }, 2000);
  // };

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
          href="/kost"
          className="flex items-center gap-2 text-[#2E8B57] hover:underline mb-6 font-medium"
        >
          <ArrowLeft size={18} /> Kembali ke daftar kost
        </Link>

        <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-xl">
          <Image src={
            kost.kos_image?.length
              ? `/images/${encodeURI(
                kost.kos_image[0].file
                  .replace('images/', '')
                  .replace(/\s+/g, '_')
              )}`
              : "/images/kamar1.jpeg"
          } alt={kost.name} fill className="object-cover" unoptimized />
          <span className="absolute top-4 left-4 bg-[#2E8B57] text-white text-xs px-3 py-1 rounded-full">
            {kost.gender}
          </span>
        </div>

        <div className="mt-8">
          <h1 className="text-3xl font-bold text-[#2E8B57]">{kost.name}</h1>
          <div className="flex items-center text-gray-600 mt-2">
            <MapPin size={18} className="mr-1 text-[#2E8B57]" />
            <span>
              {kost.address}
            </span>
          </div>

          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-[#2E8B57] font-bold text-3xl">
              Rp{Number(kost.price_per_month).toLocaleString("id-ID")}/bulan
            </span>
          </div>

          <hr className="my-6 border-gray-200" />
          <p className="text-gray-700 leading-relaxed text-lg">{kost.description}</p>

          {/* <div className="mt-8 flex gap-4">
            <button className="bg-[#2E8B57] text-white px-6 py-3 rounded-lg hover:opacity-90">
              Hubungi Pemilik
            </button>
            <button
              onClick={() => setShowBooking(true)}
              className="border border-[#2E8B57] text-[#2E8B57] px-6 py-3 rounded-lg hover:bg-green-50"
            >
              Booking
            </button>
          </div> */}

          {/* === Fasilitas === */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-[#2E8B57] mb-4">Fasilitas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {kost.kos_facilities?.map((f, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg"
                >
                  <FacilityIcon name={f.facility_name} />
                  <span>{f.facility_name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* === Review === */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-[#2E8B57] mb-4">Review Penghuni</h2>
            {reviews.reviews.map((r, idx) => (
              <div key={idx} className="border-b border-gray-200 py-4">
                <div className="flex items-center gap-2 font-medium">
                  <span>{r.user}</span>
                  <span className="flex">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{r.comment}</p>
              </div>
            ))}
          </div>

          {/* === Riwayat Booking === */}
          {/* {riwayat.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-[#2E8B57] mb-4">
                Riwayat Booking Anda
              </h2>
              <div className="space-y-4">
                {riwayat
                  .filter((r) => r.kostName === kost.name)
                  .map((r) => (
                    <div
                      key={r.id}
                      className="border border-green-200 rounded-lg p-4 bg-green-50"
                    >
                      <p className="font-semibold text-[#2E8B57]">{r.kostName}</p>
                      <p className="text-sm text-gray-600">
                        <strong>Nama:</strong> {r.nama}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>No. HP:</strong> {r.hp}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Tanggal Masuk:</strong> {r.tanggalMasuk}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Durasi:</strong> {r.durasi} bulan
                      </p>
                      {r.catatan && (
                        <p className="text-sm text-gray-600">
                          <strong>Catatan:</strong> {r.catatan}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Dibuat pada: {r.tanggalBooking}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )} */}
        </div>
      </div>

      {/* 🔹 MODAL BOOKING */}
      {/* {showBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-96 rounded-xl shadow-lg p-6 relative">
            <button
              onClick={() => setShowBooking(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
            <h2 className="text-xl font-semibold text-[#2E8B57] mb-4">Form Booking Kost</h2>
            {success ? (
              <div className="text-center text-green-600 font-semibold py-8">
                ✅ Booking berhasil dikirim!
              </div>
            ) : (
              <form onSubmit={handleBooking} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  required
                  className="border border-gray-300 px-3 py-2 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Nomor HP"
                  value={form.hp}
                  onChange={(e) => setForm({ ...form, hp: e.target.value })}
                  required
                  className="border border-gray-300 px-3 py-2 rounded-lg"
                />
                <label className="text-sm text-gray-600">Tanggal Masuk</label>
                <input
                  type="date"
                  value={form.tanggalMasuk}
                  onChange={(e) => setForm({ ...form, tanggalMasuk: e.target.value })}
                  required
                  className="border border-gray-300 px-3 py-2 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Durasi sewa (bulan)"
                  value={form.durasi}
                  onChange={(e) => setForm({ ...form, durasi: e.target.value })}
                  required
                  className="border border-gray-300 px-3 py-2 rounded-lg"
                />
                <textarea
                  placeholder="Catatan untuk pemilik kost (opsional)"
                  value={form.catatan}
                  onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                  className="border border-gray-300 px-3 py-2 rounded-lg h-20 resize-none"
                />
                <button
                  type="submit"
                  className="bg-[#2E8B57] text-white py-2 rounded-lg hover:opacity-90"
                >
                  Kirim Booking
                </button>
              </form>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
}
