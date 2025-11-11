import { getServerCookie } from "@/lib/server-cookies";
import axiosInstance from "@/lib/axios";
import AddKos from "./AddKos";
import EditKos from "./EditKos";
import DropKos from "./DropKos";
import Link from "next/link";
import { Info } from "lucide-react"; // ikon info opsional

type KosImage = {
  id: number;
  kos_id: number;
  file: string;
};

type KosType = {
  id: number;
  user_id: number;
  name: string;
  address: string;
  price_per_month: string;
  gender: string;
  kos_image: KosImage[];
};

const getKos = async (): Promise<KosType[]> => {
  try {
    const access_token = await getServerCookie(`access_token`);
    const res: any = await axiosInstance.get("admin/show_kos?search=", {
      headers: { authorization: `Bearer ${access_token}` },
    });
    if (res.data.status === "success") return res.data.data;
    return [];
  } catch (e) {
    console.log(e);
    return [];
  }
};

const KosPage = async () => {
  const listKos = await getKos();

  return (
    <div className="w-full p-5 bg-white text-black">
      <h1 className="text-xl font-semibold">Data Kos</h1>
      <span className="text-sm">Daftar semua kos yang tersedia</span>

      <div className="my-3">
        <AddKos />
        <table className="w-full mt-3 border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Nama</th>
              <th className="p-2">Alamat</th>
              <th className="p-2">Harga</th>
              <th className="p-2">Gender</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {listKos.map((kos) => (
              <tr key={kos.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{kos.name}</td>
                <td className="p-2">{kos.address}</td>
                <td className="p-2">Rp {kos.price_per_month}</td>
                <td className="p-2">{kos.gender.toUpperCase()}</td>
                <td className="p-2 flex gap-2 items-center">
                  {/* Tombol Detail Kos */}
                  <Link
                    href={`/owner/kost/${kos.id}`}
                    className="p-1 rounded bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center"
                    title="Lihat Detail Kos"
                  >
                    <Info size={16} />
                  </Link>

                  <EditKos kos={kos} />
                  <DropKos kos={kos} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KosPage;
