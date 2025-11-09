import axiosInstance from "@/lib/axios";
import { getServerCookie } from "@/lib/server-cookies";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardPage() {
    const getKostData = async (): Promise<any[]> => {
        try {
            const url = `/society/show_kos?search=`
            const access_token = await getServerCookie(`access_token`)

            console.log("TOKEN DI SERVER:", access_token) // <---- tambahkan ini

            const response: any = await axiosInstance.get(url, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            const data = response.data.data


            if (response.data.status === "success")
                return data

            return []
        } catch (error) {
            console.error("Error fetching kost data:", error);
            return [];
        }
    }

    const dataKost = await getKostData();
    console.log("data kos", dataKost);
    return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-800">

            {/* === FILTER === */}
            <div className="bg-white border-gray-200 border-t p-4 rounded-lg flex flex-wrap justify-center gap-3">
                <select className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#2E8B57]">
                    <option>Semua jenis</option>
                    <option>Putra</option>
                    <option>Putri</option>
                    <option>Campur</option>
                </select>

                <select className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#2E8B57]">
                    <option>Semua Kota</option>
                    <option>Malang</option>
                    <option>Sigura Gura</option>
                    <option>Suhat</option>
                </select>

                <select className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#2E8B57]">
                    <option>Lokasi</option>
                    <option>Dekat Kampus</option>
                    <option>Dekat Stasiun</option>
                    <option>Dekat Pusat Kota</option>
                </select>

                <button className="bg-[#F8E16C] text-[#2E8B57] font-bold px-6 py-2 mt-2 rounded-md hover:bg-[#f5d850] transition">
                    CARI
                </button>
            </div>

            {/* === GRID KOST === */}
            <section className="max-w-7xl mx-auto py-10 px-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {dataKost.map((kost, index) => (
                    <Link href={`/kost/${kost.id}`} key={`kost-${index}`}>
                        <div
                            key={kost.id}
                            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition"
                        >
                            <div className="relative">
                                <Image
                                    src={
                                        kost.kos_image?.length
                                            ? `/images/${encodeURI(
                                                kost.kos_image[0].file
                                                    .replace('images/', '')
                                                    .replace(/\s+/g, '_')
                                            )}`
                                            : "/images/kamar1.jpeg"
                                    }
                                    alt={kost.name}
                                    width={400}
                                    height={250}
                                    className="object-cover w-full h-56"
                                    unoptimized
                                />
                                <span className="absolute top-3 left-3 bg-[#2E8B57] text-white text-xs px-3 py-1 rounded-md">
                                    {kost.gender}
                                </span>
                                <span className="absolute bottom-3 right-3 bg-[#FFFBEA] text-gray-700 text-xs px-3 py-1 rounded-md">
                                    {kost.kos_facilities?.length
                                        ? kost.kos_facilities
                                            .slice(0, 2)
                                            .map(f => f.facility_name)
                                            .join(" · ")
                                        : "Tidak ada fasilitas"}
                                </span>
                            </div>

                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1 truncate max-w-[200px]">{kost.name}</h3>
                                <p className="text-sm text-gray-600 mb-1">{kost.address}</p>
                                <p className="text-xs text-gray-500 mb-2">{kost.distance}</p>

                                <div className="flex items-baseline gap-2">
                                    <span className="text-[#2E8B57] font-bold text-lg">
                                        Rp{Number(kost.price_per_month).toLocaleString("id-ID")}/bulan
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </section>

        </div>
    );
}
