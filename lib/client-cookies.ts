import Cookies from "js-cookie"

export const storeCookie = (
  key: string,
  value: string
): void => {
  Cookies.set(key, value, {
    path: "/",        // <- WAJIB AGAR TERBACA DI SEMUA HALAMAN
    sameSite: "lax", // aman untuk next.js
    secure: true     // wajib kalau project https
  })
}

export const getCookie = (key: string): string => {
  return Cookies.get(key) || ""
}

export const removeCookie = (key: string): void => {
  Cookies.remove(key, { path: "/" })
}
