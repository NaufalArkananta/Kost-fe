import { NextRequest, NextResponse } from "next/server";
import { verifySociety, verifyOwner } from "./lib/authorization";

export const middleware = async (request: NextRequest) => {
  const access_token = request.cookies.get("access_token")?.value;
  const role = request.cookies.get("role")?.value;
  const loginTime = request.cookies.get("login_time")?.value; // waktu login disimpan di ms timestamp
  const { pathname } = request.nextUrl;

  const redirectTo = (path: string, clearCookies = false) => {
    const response = NextResponse.redirect(new URL(path, request.url));
    if (clearCookies) {
      response.cookies.delete("access_token");
      response.cookies.delete("role");
      response.cookies.delete("login_time");
    }
    return response;
  };

  // 🔹 1. Jika belum login
  if (!access_token || !role) {
    if (pathname === "/") return NextResponse.next();
    return redirectTo("/", true);
  }

  // 🔹 2. Cek apakah token sudah kadaluarsa (lebih dari 1 jam)
  if (loginTime) {
    const now = Date.now();
    const loginTimestamp = parseInt(loginTime, 10);

    // 1 jam = 3600000 ms
    if (now - loginTimestamp > 3600000) {
      console.log("⏰ Token expired after 1 hour, logging out...");
      return redirectTo("/", true);
    }
  }

  // 🔹 3. Jika sudah login dan buka halaman login (/)
  if (pathname === "/") {
    if (await verifySociety()) {
      return redirectTo("/society/home");
    } else if (await verifyOwner()) {
      return redirectTo("/owner/kost");
    } else {
      return redirectTo("/", true);
    }
  }

  // 🔹 4. Proteksi akses sesuai role
  if (await verifySociety()) {
    if (!pathname.startsWith("/society")) {
      return redirectTo("/society/home");
    }
  } else if (await verifyOwner()) {
    if (!pathname.startsWith("/owner")) {
      return redirectTo("/owner/kost");
    }
  } else {
    return redirectTo("/", true);
  }

  return NextResponse.next();
};

// Middleware aktif di semua halaman kecuali aset statis & API
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|uploads).*)",
  ],
};
