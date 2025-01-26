"use client";

import { Button, Input } from "@nextui-org/react";

const Validasi = () => {
  return (
    <div className="w-full max-w-md p-8 space-y-8 rounded-lg bg-white shadow-lg">
      <h2 className="text-2xl font-bold text-center">Validasi Kode Agen</h2>
      <form className="mt-8 space-y-6">
      <div className="space-y-4">
          <div>
            <label htmlFor="kode-agen" className="sr-only">
              Kode Agen
            </label>
            <Input
              label="Kode Agen (Optional)"
              placeholder="XXXXXXXX"
              type="text"
              size="md"
              variant="flat"
              required
            />
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