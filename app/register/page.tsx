"use client";
import axiosInstance from "@/lib/axios";
import { Home, Lock, User, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("society");

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const url = `register`;
      const requestData = { name, email, phone, password, role };

      const response = await axiosInstance.post(url, requestData);

      if (response.status === 201 || response.status === 200) {
        toast.success("Registrasi berhasil! Silakan login.");
        setTimeout(() => router.replace("/"), 1500);
      } else {
        toast.error("Registrasi gagal. Coba lagi!");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan saat registrasi");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-start justify-center bg-gradient-to-br from-green-200 via-white to-green-300 pt-20">
      <div className="backdrop-blur-xl bg-white/30 border border-white/40 shadow-xl rounded-2xl w-full max-w-md p-8 flex flex-col items-center">
        
        {/* Logo */}
        <div className="bg-[#2E8B57] w-14 h-14 flex items-center justify-center rounded-full shadow-md mb-4">
          <Home size={28} className="text-white" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-[#2E8B57]">Daftar Akun</h1>
        <p className="text-gray-600 text-sm mb-6">Buat akun baru untuk KOST_HUNTER</p>

        {/* Form */}
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2E8B57]">
              <User size={18} />
            </span>
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-black bg-white/60 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2E8B57]">
              <User size={18} />
            </span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-black bg-white/60 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
              required
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2E8B57]">
              <Phone size={18} />
            </span>
            <input
              type="text"
              placeholder="Nomor Telepon"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-black bg-white/60 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2E8B57]">
              <Lock size={18} />
            </span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-black bg-white/60 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Daftar sebagai:</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full pl-3 pr-4 py-3 rounded-lg text-black bg-white/60 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
            >
              <option value="society">Society</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-[#2E8B57] text-white py-3 rounded-lg hover:opacity-90 transition font-medium"
          >
            Daftar
          </button>
        </form>
      </div>
    </div>
  );
}
