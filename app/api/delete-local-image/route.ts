import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { filePath } = await req.json();
    if (!filePath) {
      return NextResponse.json({ status: "error", message: "File path tidak ditemukan" });
    }

    const fullPath = path.join(process.cwd(), "public", filePath);

    // Pastikan file ada sebelum dihapus
    try {
      await fs.access(fullPath);
      await fs.unlink(fullPath);
      return NextResponse.json({ status: "success", message: "File berhasil dihapus" });
    } catch {
      return NextResponse.json({
        status: "error",
        message: "File tidak ditemukan di direktori lokal",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "error", message: "Gagal menghapus file lokal" });
  }
}
