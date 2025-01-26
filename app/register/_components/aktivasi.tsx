"use client";

import { PhoneIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Button, Divider, Input, InputOtp } from "@nextui-org/react";
import React from "react";

const Aktivasi = () => {
  const [otp, setOTP] = React.useState("");
   
  return (
    <div className="w-full max-w-md p-8 rounded-lg bg-white shadow-lg">
      <h2 className="text-2xl font-bold text-center">Aktivasi Kode OTP</h2>
      <form className="mt-8 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center flex-col space-y-4 text-sm">
            <div>Pilih Metode Kirim OTP</div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 justify-between px-4 py-2 border-2 border-primary-700 bg-primary-100 rounded-lg">
                <PhoneIcon className="size-6"/>
                WhatsApp
              </div>
            </div>
            <Button className="text-white bg-green-500" endContent={<PaperAirplaneIcon className="size-6"/>}>Request OTP</Button>
            <Divider />
            <div>Masukan OTP yang dikirim ke nomor anda</div>
            <label htmlFor="kode-agen" className="sr-only">
              Kode OTP
            </label>
            <InputOtp length={4} value={otp} onValueChange={setOTP} />
            <Input 
              placeholder="Token Aktivasi"
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