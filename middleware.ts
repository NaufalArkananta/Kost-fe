import { NextRequest, NextResponse } from "next/server";
import { verifySociety, verifyOwner } from "./lib/authorization";

export const middleware = async (request: NextRequest) => {
  const access_token = request.cookies.get("access_token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  // Helper redirect cepat + auto clear cookie (untuk logout)
  const redirectTo = (path: string, clearCookies = false) => {
    const response = NextResponse.redirect(new URL(path, request.url));
    if (clearCookies) {
      response.cookies.delete("access_token");
      response.cookies.delete("role");
    }
    return response;
  };

  // 🔹 1. Belum login → hanya boleh ke halaman login (/)
  if (!access_token || !role) {
    if (pathname === "/") return NextResponse.next(); // tampil halaman login
    return redirectTo("/", true); // hapus cookie (kalau ada) dan ke login
  }

  // 🔹 2. Jika sudah login dan buka halaman login (/)
  if (pathname === "/") {
    if (verifySociety()) {
      return redirectTo("/society");
    } else if (verifyOwner()) {
      return redirectTo("/owner");
    } else {
      return redirectTo("/", true); // role tidak valid
    }
  }

  // 🔹 3. Proteksi akses sesuai role
  if (verifySociety()) {
    // Society hanya boleh akses halaman /society
    if (!pathname.startsWith("/society")) {
      return redirectTo("/society");
    }
  } else if (verifyOwner()) {
    // Owner hanya boleh akses halaman /owner
    if (!pathname.startsWith("/owner")) {
      return redirectTo("/owner");
    }
  } else {
    // Role tidak dikenal → logout
    return redirectTo("/", true);
  }

  // 🔹 4. Semua aman → lanjut
  return NextResponse.next();
};

// Middleware aktif di semua halaman kecuali aset statis & API
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|uploads).*)",
  ],
};
