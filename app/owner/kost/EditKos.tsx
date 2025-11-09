"use client"

import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import Modal from "@/components/Modal"
import { toast, ToastContainer } from "react-toastify"
import { getServerCookie } from "@/lib/server-cookies";
import axiosInstance from "@/lib/axios";

type KosType = {
  id: number
  name: string
  address: string
  price_per_month: string
  gender: string
}

const EditKos = ({ kos }: { kos: KosType }) => {
  const [show, setShow] = useState(false)
  const [name, setName] = useState(kos.name)
  const [address, setAddress] = useState(kos.address)
  const [price, setPrice] = useState(kos.price_per_month)
  const [gender, setGender] = useState(kos.gender)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
        const access_token = await getServerCookie(`access_token`)
      const res: any = await axiosInstance.put(
        `admin/update_kos/${kos.id}`,
        { name, address, price_per_month: price, gender },
        { headers: { authorization: `Bearer ${access_token}` } }
      )
      const msg = res.data.message
      if (res.data.status === "success") {
        toast(msg, { containerId: `editKos-${kos.id}`, type: "success" })
        setShow(false)
        setTimeout(() => router.refresh(), 1000)
      } else {
        toast(msg, { containerId: `editKos-${kos.id}`, type: "warning" })
      }
    } catch (err) {
      console.log(err)
      toast("Something went wrong", { containerId: `editKos-${kos.id}`, type: "error" })
    }
  }

  return (
    <div>
      <ToastContainer containerId={`editKos-${kos.id}`} />
      <button
        onClick={() => setShow(true)}
        className="px-2 py-1 bg-yellow-400 hover:bg-yellow-300 rounded text-black"
      >
        Edit
      </button>

      <Modal isShow={show}>
        <form onSubmit={handleSubmit}>
          <div className="p-3">
            <h1 className="font-semibold text-lg">Edit Data Kos</h1>
            <div className="mt-2">
              <label>Nama</label>
              <input
                className="w-full border p-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <label>Alamat</label>
              <input
                className="w-full border p-1"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <label>Harga</label>
              <input
                className="w-full border p-1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <label>Gender</label>
              <input
                className="w-full border p-1"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
            </div>
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
              className="px-3 py-2 bg-sky-700 text-white rounded"
            >
              Update
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default EditKos
