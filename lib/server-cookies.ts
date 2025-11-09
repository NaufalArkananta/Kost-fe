// cookie

// cookie: tempat penyimpanan pada browser, biasanya untuk menyimpan data user session
"use server";

import { cookies } from "next/headers";

export const getServerCookie = async (
    key: string
): Promise<string> => {
    return (await cookies()).get(key)?.value || ""
}

// export const saveTokenToServer = (token: string): void => {
//   cookies().set("access_token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//   });
// };