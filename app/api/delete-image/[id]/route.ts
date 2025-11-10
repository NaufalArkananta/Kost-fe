import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "@/lib/axios";
import { getServerCookie } from "@/lib/server-cookies";
import fs from "fs";
import path from "path";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const access_token = await getServerCookie("access_token");
    const id = params.id;

    // Hapus data dari backend Laravel
    const res = await axiosInstance.delete(`/admin/delete_image/${id}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (res.data.status !== "success") {
      return NextResponse.json(
        { status: "error", message: "Gagal menghapus data dari backend" },
        { status: 400 }
      );
    }

    // Ambil path file dari response backend
    const filePath = res.data.filePath || res.data.path || res.data.data?.file;

    if (filePath) {
      const localPath = path.join(process.cwd(), "public", filePath);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
    }

    return NextResponse.json({
      status: "success",
      message: "Foto berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json(
      { status: "error", message: "Terjadi kesalahan saat menghapus foto" },
      { status: 500 }
    );
  }
}
