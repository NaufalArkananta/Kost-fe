import { getServerCookie } from "@/lib/server-cookies";
import axiosInstance from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import AddFoto from "./AddFoto";
import DeleteFoto from "./DeleteFoto";

type KosImage = {
  id: number;
  kos_id: number;
  file: string;
};

type KosFacility = {
  id: number;
  name: string;
};

type KosDetailType = {
  id: number;
  user_id: number;
  name: string;
  address: string;
  price_per_month: string;
  gender: string;
  created_at: string;
  updated_at: string;
  kos_image: KosImage[];
  kos_facilities: KosFacility[];
};

const getKosDetail = async (id: string): Promise<KosDetailType | null> => {
  try {
    const access_token = await getServerCookie("access_token");
    const res: any = await axiosInstance.get(`admin/detail_kos/${id}`, {
      headers: { authorization: `Bearer ${access_token}` },
    });
    if (res.data.status === "success") return res.data.data;
    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default async function KosDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const kos = await getKosDetail(params.id);

  if (!kos) {
    return (
      <div className="p-5">
        <h1 className="text-xl font-semibold">Data Kos Tidak Ditemukan</h1>
        <Link href="/dashboard/kos" className="text-blue-500 underline">
          Kembali
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full p-5 bg-white text-black">
<div className="flex items-center justify-between mb-4">
  <h1 className="text-xl font-semibold">Detail Kos</h1>
  <div className="flex gap-2">
    <AddFoto kos_id={kos.id} /> {/* 🔹 Tambah tombol upload foto */}
    <Link
      href="/owner/kost"
      className="text-sm bg-gray-200 hover:bg-gray-300 text-black px-3 py-1 rounded"
    >
      Kembali
    </Link>
  </div>
</div>

      <div className="border rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">{kos.name}</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p>
            <span className="font-medium">Alamat:</span> {kos.address}
          </p>
          <p>
            <span className="font-medium">Harga per bulan:</span> Rp{" "}
            {kos.price_per_month}
          </p>
          <p>
            <span className="font-medium">Gender:</span> {kos.gender}
          </p>
          <p>
            <span className="font-medium">Dibuat pada:</span>{" "}
            {new Date(kos.created_at).toLocaleString("id-ID")}
          </p>
        </div>

        {/* Gambar Kos */}
<div className="mt-5">
  <h3 className="font-medium mb-2">Gambar Kos:</h3>
  {kos.kos_image.length > 0 ? (
    <div className="flex flex-wrap gap-3">
      {kos.kos_image.map((img) => {
        const imageUrl = img.file.startsWith("/") ? img.file : `/${img.file}`;
        return (
          <div key={img.id} className="relative group">
            <Image
              src={imageUrl}
              alt="Foto Kos"
              width={150}
              height={150}
              className="rounded-lg border object-cover"
              unoptimized
            />
            {/* Tombol hapus di pojok kanan atas */}
            <DeleteFoto imageId={img.id} />
          </div>
        );
      })}
    </div>
  ) : (
    <p className="text-gray-500 text-sm">Belum ada gambar kos</p>
  )}
</div>

        {/* Fasilitas Kos */}
        <div className="mt-5">
          <h3 className="font-medium mb-2">Fasilitas:</h3>
          {kos.kos_facilities.length > 0 ? (
            <ul className="list-disc pl-5 text-sm">
              {kos.kos_facilities.map((fasilitas) => (
                <li key={fasilitas.id}>{fasilitas.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Belum ada fasilitas</p>
          )}
        </div>
      </div>
    </div>
  );
}
