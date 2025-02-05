"use client";

import api from "@/lib/axios";
import { PhoneIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Button, Divider, Input, InputOtp } from "@heroui/react";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface AktivasiProps {
  dataActivation: {
    nohp_email: string | undefined,
    kode_agen: string | undefined
  },
  onActivation: (token_aktivasi: string) => void
}

const Aktivasi = ({ dataActivation, onActivation }: AktivasiProps) => {
  const [otp, setOTP] = useState('')
  const [tokenAktivasi, setTokenAktivasi] = useState('')

  const onHandleRequestOTP = async () => {
    const data = {
      tipe: 'registrasi',
      metode: 'WHATSAPP',
      kode_agen: dataActivation.kode_agen,
      nohp_email: dataActivation.nohp_email,
      versi: 'V2'
    }

    const response = await api.post('/REQUEST_OPEN/act/PROCESS_OPEN/kirim_otp/WEB', data)
    if(response.data.response_code === '0000'){
      toast.success(response.data.response_message)
    }
  }

  const onHandleSubmitOTP = async () => {
    const data = {
      nohp_email: dataActivation.nohp_email,
      kode_validasi: otp,
      versi: 'V2'
    }

    const response = await api.post('/REQUEST_OPEN/act/PROCESS_OPEN/validasi_cek_kode/MOBILE', data)
    if(response.data.response_code === '0000'){
      setTokenAktivasi(response.data.token_aktivasi)
    } else {
      toast.error(response.data.response_message)
    }
  }

  const onHandleActivation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onActivation(tokenAktivasi)
  }
  return (
    <div className="w-full max-w-md p-8 rounded-lg bg-white shadow-lg">
      <h2 className="text-2xl font-bold text-center">Aktivasi Kode OTP</h2>
      <form className="mt-8 space-y-6" onSubmit={onHandleActivation}>
        <div className="space-y-4">
          <div className="flex items-center flex-col space-y-4 text-sm">
            <div>Pilih Metode Kirim OTP</div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 justify-between px-4 py-2 border-2 border-primary-700 bg-primary-100 rounded-lg">
                <PhoneIcon className="size-6"/>
                WhatsApp
              </div>
            </div>
            <Button onPress={onHandleRequestOTP} className="text-white bg-green-500" endContent={<PaperAirplaneIcon className="size-6"/>}>Request OTP</Button>
            <Divider />
            <div>Masukan OTP yang dikirim ke nomor anda</div>
            <label htmlFor="kode-agen" className="sr-only">
              Kode OTP
            </label>
            <InputOtp isRequired onComplete={onHandleSubmitOTP} length={4} value={otp} onValueChange={setOTP} />
            <Input 
              placeholder="Token Aktivasi"
              value={tokenAktivasi}
              isRequired
              disabled
            />
            <div className="text-red-600 text-xs">*Otomatis terisi setelah validasi OTP sukses</div>
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
};

export default Aktivasi;