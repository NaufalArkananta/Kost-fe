"use client";
import axiosInstance from "@/lib/axios";
import { storeCookie } from "@/lib/client-cookies";
import { Home, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const router = useRouter()

const handleSubmit = async (e: FormEvent) => {
    try {
        e.preventDefault()
        const url = `login`
        const requestData = { email, password }

        // hit endpoint
        const response: any = await axiosInstance.post(url, requestData)
        const user = response.data?.user

        if (!user) {
            console.log("Login gagal: response tidak ada user")
            return
        } else {
            const access_token = response.data.access_token
            const role = response.data.user.role

            // store access_token in cookie
            storeCookie(`access_token`, access_token)
            
            // store role in cookie
            storeCookie(`role`, role)

            if (role === `owner`) {
                setTimeout(() => router.replace(`/owner/dashboard`), 1000)
            } else {
                setTimeout(() => router.replace(`/home`), 1000)
            }
        }
    } catch (error) {
        console.log(error)
    }
}
    return (
        <div className="min-h-screen w-full flex items-start justify-center bg-gradient-to-br from-green-200 via-white to-green-300 pt-20">
            <div className="backdrop-blur-xl bg-white/30 border border-white/40 shadow-xl rounded-2xl w-full max-w-md p-8 flex flex-col items-center">

                {/* Logo */}
                <div className="bg-[#2E8B57] w-14 h-14 flex items-center justify-center rounded-full shadow-md mb-4">
                    <Home size={28} className="text-white" />
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-bold text-[#2E8B57]">Welcome👋</h1>
                <p className="text-gray-600 text-sm mb-6">Masuk ke akun KOST_HUNTER kamu</p>

                {/* Form */}
                <form className="w-full flex flex-col gap-4" onSubmit={e => handleSubmit(e)}>

                    {/* Username */}
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2E8B57]">
                            <User size={18} />
                        </span>
                        <input
                            type="text"
                            placeholder="Email"
                            id={`email`}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg text-black bg-white/60 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
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
                            id={`password`}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg text-black bg-white/60 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                        />
                    </div>

                    {/* Remember + Forgot */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" className="accent-[#2E8B57]" />
                            <span className="text-gray-700">Ingat saya</span>
                        </div>
                        <button type="button" className="text-[#2E8B57] hover:underline">
                            Lupa password?
                        </button>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#2E8B57] text-white py-3 rounded-lg hover:opacity-90 transition font-medium"
                    >
                        Masuk
                    </button>
                </form>
            </div>
        </div>
    );
}
