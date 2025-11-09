"use client"

import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import Modal from "@/components/Modal"
import { toast, ToastContainer } from "react-toastify"
import { getServerCookie } from "@/lib/server-cookies";
import axiosInstance from "@/lib/axios";

const AddKos = () => {
  const [show, setShow] = useState(false)
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [price, setPrice] = useState("")
  const [gender, setGender] = useState("")
  const router = useRouter()

  const openModal = () => {
    setShow(true)
    setName("")
    setAddress("")
    setPrice("")
    setGender("")
  }

  const closeModal = () => setShow(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
                  const access_token = await getServerCookie(`access_token`)
      const res: any = await axiosInstance.post(
        "admin/create_kos",
        { name, address, price_per_month: price, gender },
        { headers: { authorization: `Bearer ${access_token}` } }
      )
      const msg = res.data.message
      if (res.data.status === "success") {
        toast(msg, { containerId: "addKos", type: "success" })
        setShow(false)
        setTimeout(() => router.refresh(), 1000)
      } else {
        toast(msg, { containerId: "addKos", type: "warning" })
      }
    } catch (err) {
      console.log(err)
      toast("Something went wrong", { containerId: "addKos", type: "error" })
    }
  }

  return (
    <div>
      <ToastContainer containerId="addKos" />
      <button
        className="px-4 py-2 rounded-md bg-lime-600 hover:bg-lime-500 text-white"
        onClick={openModal}
      >
        Tambah Kos
      </button>
      <Modal isShow={show}>
        <form onSubmit={handleSubmit}>
          <div className="p-3">
            <h1 className="font-semibold text-lg">Tambah Data Kos</h1>
            <div className="mt-2">
              <label className="block text-sm font-medium text-sky-600">
                Nama
              </label>
              <input
                className="w-full border p-1 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-sky-600">
                Alamat
              </label>
              <input
                className="w-full border p-1 rounded"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-sky-600">
                Harga per bulan
              </label>
              <input
                className="w-full border p-1 rounded"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-sky-600">
                Gender
              </label>
              <input
                className="w-full border p-1 rounded"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end p-3 gap-2">
            <button
              type="button"
              className="px-3 py-2 bg-slate-700 text-white rounded"
              onClick={closeModal}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3 py-2 bg-sky-700 text-white rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AddKos
