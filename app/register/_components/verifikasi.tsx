"use client";

import { Button, Input } from "@nextui-org/react";
import { NumericFormat } from "react-number-format";

const Verifikasi = () => {
  return (
    <div className="w-full max-w-md p-8 space-y-8 rounded-lg bg-white shadow-lg">
      <h2 className="text-2xl font-bold text-center">Verifikasi Nomor HP</h2>
      <form className="mt-8 space-y-6">
      <div className="space-y-4">
          <div>
            <label htmlFor="phone" className="sr-only">
              Phone
            </label>
            <NumericFormat
              allowLeadingZeros
              customInput={Input}
              label="Phone Number"
              placeholder="08XXXXXXXXXX"
              type="text"
              size="md"
              variant="flat"
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
