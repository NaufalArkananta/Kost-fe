import { NextRequest, NextResponse } from "next/server";
import { verifySociety, verifyOwner } from "./lib/authorization";

export const middleware = async (request: NextRequest) => {
  const access_token = request.cookies.get("access_token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  const redirectTo = (path: string, clearCookies = false) => {
    const response = NextResponse.redirect(new URL(path, request.url));
    if (clearCookies) {
      response.cookies.delete("access_token");
      response.cookies.delete("role");
    }
    return response;
  };

  if (!access_token || !role) {
    if (pathname === "/") return NextResponse.next();
    return redirectTo("/", true);
  }

  // 🔹 2. Jika sudah login dan buka halaman login (/)
  if (pathname === "/") {
    if (await verifySociety()) {
      return redirectTo("/society/home");
    } else if (await verifyOwner()) {
      return redirectTo("/owner/kost");
    } else {
      return redirectTo("/", true);
    }
  }

  // 🔹 3. Proteksi akses sesuai role
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
