"use client"

import Cookies from "js-cookie"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const Navbar = () => {
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        // cek apakah token ada di cookie
        const token = Cookies.get("access_token")
        if (token) {
            setIsLoggedIn(true)
        }
    }, [])

    const handleLogout = () => {
        Cookies.remove("access_token")
        setIsLoggedIn(false)
        router.push("/login")
    }

    return (
        <nav className="bg-white shadow-sm py-4 px-8 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#2E8B57]">🏠 KOST_HUNTER</span>
            </div>

            <ul className="hidden md:flex gap-6 text-sm font-medium text-zinc-600">
                <li><Link href="/society/home" className="hover:text-[#2E8B57] transition">Beranda</Link></li>
                <li><Link href="#" className="hover:text-[#2E8B57] transition">Tentang Kami</Link></li>
                <li><Link href="/society/kost" className="hover:text-[#2E8B57] transition">Kost</Link></li>
                <li><Link href="/society/history" className="hover:text-[#2E8B57] transition">History</Link></li>
            </ul>

            <div className="flex items-center gap-3 text-zinc-600">
                {!isLoggedIn ? (
                    <>
                        <Link href="/login" className="text-sm font-semibold hover:text-[#2E8B57] transition">Masuk / Daftar</Link>
                        <li className="bg-[#2E8B57] text-white px-4 py-1 rounded-md hover:bg-[#247047] transition">
                            <Link href={"/login"}>LOGIN</Link>
                        </li>
                    </>
                ) : (
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition text-sm font-semibold"
                    >
                        LOGOUT
                    </button>
                )}
            </div>
        </nav>
    )
}

export default Navbar
