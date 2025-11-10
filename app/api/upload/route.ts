// /app/api/upload/route.ts
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const filePath = formData.get("filePath") as string; // contoh: images/1762743687_Screenshot.png

  if (!file || !filePath) {
    return NextResponse.json({ status: "error", message: "File tidak lengkap" });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Pastikan folder "public/images" ada
  const uploadDir = path.join(process.cwd(), "public", "images");
  await mkdir(uploadDir, { recursive: true });

  // Simpan file dengan nama dari backend
  const savePath = path.join(process.cwd(), "public", filePath);
  await writeFile(savePath, buffer);

  return NextResponse.json({
    status: "success",
    message: "File berhasil diupload",
    filePath,
  });
}
