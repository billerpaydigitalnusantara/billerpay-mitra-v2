"use client";

import api from "@/lib/axios";
import { Button, Input } from "@heroui/react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

interface ValidasiProps {
  nohp: string | undefined
  onValidation: (kode_agen: string) => void;
}

const Validasi = ({ nohp, onValidation }: ValidasiProps) => {
  const onHandleValidation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElements = event.currentTarget.elements as HTMLFormControlsCollection
    const data = {
      kode_agen: (formElements.namedItem('kode_agen') as HTMLInputElement)?.value,
      nohp_email: nohp,
      versi: 'V2'
    }

    if(data.kode_agen !== ""){
      try {
        const response = await api.post('/REQUEST_OPEN/act/PROCESS_OPEN/validasi_kode_agen/WEB', data)

        if(response.data.response_code === '0000') {
          onValidation(data.kode_agen)
          toast.success(response.data.response_message)
        } else {
          toast.error(response.data.response_message)
        }
      } catch (error) {
        const err = error as AxiosError
        if(err.status && err.status >= 500) {
          toast.error('Terjadi kesalahan sistem')
        }
      }
    } else {
      onValidation("0")
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-8 rounded-lg bg-white shadow-lg">
      <h2 className="text-2xl font-bold text-center">Validasi Kode Agen</h2>
      <form className="mt-8 space-y-6" onSubmit={onHandleValidation}>
        <div className="space-y-4">
          <div>
            <label htmlFor="kode-agen" className="sr-only">
              Kode Agen
            </label>
            <Input
              id="kode_agen"
              label="Kode Agen (Optional)"
              placeholder="XXXXXXXX"
              type="text"
              size="md"
              variant="flat"            />
          </div>
        </div>
        <div>
          <Button
            type="submit"
            className="w-full" 
            color="primary"
          >
            Selanjutnya
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Validasi;