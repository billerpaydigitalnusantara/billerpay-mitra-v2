"use client";

import api from "@/lib/axios";
import { Button, Input } from "@heroui/react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { NumericFormat } from "react-number-format";

interface VerifikasiProps {
  onVerification: (nohp_email: string) => void;
}

const Verifikasi = ({ onVerification }: VerifikasiProps) => {
  const onHandleVerification = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElements = event.currentTarget.elements as HTMLFormControlsCollection
    const data = {
      nohp_email: (formElements.namedItem('nohp_email') as HTMLInputElement)?.value,
      versi: 'V2'
    }

    try {
      const response = await api.post('/REQUEST_OPEN/act/PROCESS_OPEN/validasi_nohp/WEB', data)

      if(response.data.response_code === '0123') {
        onVerification(data.nohp_email)
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
    
  }

  return (
    <div className="w-full max-w-md p-8 space-y-8 rounded-lg bg-white shadow-lg">
      <h2 className="text-2xl font-bold text-center">Verifikasi Nomor HP</h2>
      <form className="mt-8 space-y-6" onSubmit={onHandleVerification}>
        <div className="space-y-4">
          <div>
            <label htmlFor="phone" className="sr-only">
              Phone
            </label>
            <NumericFormat
              id="nohp_email"
              allowLeadingZeros
              customInput={Input}
              label="Phone Number"
              placeholder="08XXXXXXXXXX"
              type="text"
              size="md"
              variant="flat"
              maxLength={13}
              required
              pattern="^08[0-9]{9,}$"
            />
          </div>
        </div>
        <div>
          <Button
            type="submit"
            className="w-full" 
            color="primary"
          >
            Verifikasi
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Verifikasi;
