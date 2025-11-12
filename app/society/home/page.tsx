import axiosInstance from "@/lib/axios";
import { getServerCookie } from "@/lib/server-cookies";
import Image from "next/image";
import Link from "next/link";
import FilterBar from "../FilterBar";

export default async function Home() {
  const getKostData = async (): Promise<any[]> => {
    try {
      const url = `/society/show_kos?search=`;
      const access_token = await getServerCookie(`access_token`);

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const data = response.data.data;

      if (response.data.status === "success") return data.slice(0, 6); // ✅ <--- dibatasi maksimal 6

      return [];
    } catch (error) {
      console.error("Error fetching kost data:", error);
      return [];
    }
  };

  const dataKost = await getKostData();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-800">
      {/* HERO SECTION */}
      <section className="bg-[#F3F8F3] py-28 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-8 leading-snug text-[#2E8B57]">
              Temukan Kost Favoritmu di{" "}
              <span className="text-[#1A1A1A]">KOSTHUNTER_.COM</span>
            </h1>
            <p className="text-gray-600 mb-10 text-lg leading-relaxed">
              Kost terbaik di Malang — nyaman, terjangkau, dan strategis!
            </p>
            <Link
              href="/kost"
              className="inline-block bg-[#2E8B57] text-white font-semibold px-10 py-4 rounded-md hover:bg-[#247047] transition"
            >
              Cari kost sekarang!
            </Link>
          </div>

          <div className="flex justify-center">
            <Image
              src="/images/bg-img.jpg"
              alt="Kamar Kost"
              width={520}
              height={340}
              className="rounded-xl shadow-lg object-cover"
            />
          </div>
        </div>

        {/* FILTER BAR */}
        <FilterBar />
      </section>

      {/* TENTANG KAMI */}
      <section className="bg-[#F3F8F3] py-24 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <Image
            src="/images/bg-tentang-kami.jpg"
            alt="Kamar Kost"
            width={600}
            height={400}
            className="rounded-xl shadow-md object-cover"
          />

          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1A1A1A]">
              Informasi Kos Terbaik di Malang
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              KOSTHUNTER_ menyediakan informasi kos terbaik di Malang dengan
              fasilitas lengkap, harga murah, bersih, dan nyaman. Kami
              menawarkan layanan sebagai berikut:
            </p>
            <ul className="space-y-3 text-gray-800">
              <li>✅ Cari fasilitas kost dan kontrakan sesuai kebutuhanmu</li>
              <li>✅ Lokasi strategis dengan harga kompetitif</li>
              <li>✅ Layanan survey langsung ke lokasi</li>
            </ul>
            <div className="flex gap-4 mt-8">
              <a
                href="#"
                className="bg-gray-100 border px-4 py-2 rounded-md shadow-sm"
              >
                📸 Instagram
              </a>
              <a
                href="#"
                className="bg-gray-100 border px-4 py-2 rounded-md shadow-sm"
              >
                💬 Whatsapp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* KOST REKOMENDASI */}
      <section className="bg-[#FAFAFA] py-24 px-6">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-[#2E8B57] mb-3">
            Kost Rekomendasi Kami
          </h2>
          <p className="text-gray-600">
            Pilihan terbaik untuk kost paling nyaman dan terpercaya untukmu
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {dataKost.map((kost) => (
            <div
              key={kost.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition"
            >
              <Image
                src={
                  kost.kos_image?.length > 0
                    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${encodeURIComponent(
                        kost.kos_image[0].file
                      )}`
                    : "/images/default.jpg"
                }
                alt={kost.name}
                width={400}
                height={250}
                className="object-cover w-full h-52"
                unoptimized
              />
              <div className="p-5 bg-[#2E8B57] text-white">
                <p className="text-sm mb-1">
                  Rp{Number(kost.price_per_month).toLocaleString("id-ID")}/bulan
                </p>
                <h3 className="font-semibold text-lg mb-1">{kost.name}</h3>
                <p className="text-sm text-green-100">{kost.address}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <Link
            href="/society/kost"
            className="bg-[#2E8B57] text-white font-semibold px-10 py-4 rounded-md hover:bg-[#247047] transition"
          >
            Temukan lebih banyak kost
          </Link>
        </div>
      </section>
    </div>
  );
}
