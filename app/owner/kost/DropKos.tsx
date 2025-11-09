"use client"

import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import Modal from "@/components/Modal"
import { getServerCookie } from "@/lib/server-cookies";
import axiosInstance from "@/lib/axios";
import { toast, ToastContainer } from "react-toastify";

type KosType = { id: number; name: string }

const DropKos = ({ kos }: { kos: KosType }) => {
  const [show, setShow] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
                  const access_token = await getServerCookie(`access_token`)
      const res: any = await axiosInstance.delete(`admin/delete_kos/${kos.id}`, {
        headers: { authorization: `Bearer ${access_token}` },
      })
      const msg = res.data.message
      if (res.data.status === "success") {
        toast(msg, { containerId: `dropKos-${kos.id}`, type: "success" })
        setShow(false)
        setTimeout(() => router.refresh(), 1000)
      } else {
        toast(msg, { containerId: `dropKos-${kos.id}`, type: "warning" })
      }
    } catch (err) {
      console.log(err)
      toast("Something went wrong", { containerId: `dropKos-${kos.id}`, type: "error" })
    }
  }

  return (
    <div>
      <ToastContainer containerId={`dropKos-${kos.id}`} />
      <button
        onClick={() => setShow(true)}
        className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded"
      >
        Hapus
      </button>

      <Modal isShow={show}>
        <form onSubmit={handleSubmit}>
          <div className="p-3">
            <h1 className="font-semibold text-lg">Hapus Data Kos</h1>
            <p>Apakah anda yakin ingin menghapus <b>{kos.name}</b>?</p>
          </div>
          <div className="flex justify-end p-3 gap-2">
            <button
              type="button"
              onClick={() => setShow(false)}
              className="px-3 py-2 bg-slate-700 text-white rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3 py-2 bg-red-700 text-white rounded"
            >
              Ya, Hapus
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default DropKos
