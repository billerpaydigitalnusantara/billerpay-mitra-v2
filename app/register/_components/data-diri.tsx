"use client";

import { Button, Input, Autocomplete, AutocompleteItem, DatePicker, Select, SelectItem } from "@heroui/react";
import React from "react";
import { NumericFormat } from "react-number-format";


const DataDiri = () => {
  const [province, setProvince] = React.useState([]);
  const [city, setCity] = React.useState([]);
  const [district, setDistrict] = React.useState([]);
  const [subDistrict, setSubDistrict] = React.useState([]);

  async function fetchProvinces() {
    const res = await fetch("https://api.billerpay.id/core/public/index.php/ALAMAT/provinces")
    const data = await res.json()
    setProvince(data)
    setCity([])
    setDistrict([])
    setSubDistrict([])
  }

  async function fetchCities(provinceId: number) {
    console.log(provinceId)
    const res = await fetch("https://api.billerpay.id/core/public/index.php/ALAMAT/regencies/" + provinceId)
    const data = await res.json()
    setCity(data)
    setDistrict([])
    setSubDistrict([])
  }

  async function fetchDistricts(cityId: number) {
    const res = await fetch("https://api.billerpay.id/core/public/index.php/ALAMAT/districts/" + cityId)
    const data = await res.json()
    setDistrict(data)
    setSubDistrict([])
  }

  async function fetchSubDistricts(districtId: number) {
    const res = await fetch("https://api.billerpay.id/core/public/index.php/ALAMAT/villages/" + districtId)
    const data = await res.json()
    setSubDistrict(data)
  }

  React.useEffect(() => {  
    fetchProvinces()
  }, []);

  return (
    <div className="w-full max-w-md p-8 rounded-lg bg-white shadow-lg">
      <h2 className="text-2xl font-bold text-center">Lengkapi Data Diri</h2>
      <form className="mt-8 space-y-6">
        <div className="space-y-4 gap-2">
          <div>
            <label htmlFor="nik" className="sr-only">
              NIK
            </label>
            <NumericFormat
              label="Nomor Induk Kependudukan (NIK)"
              type="text"
              size="md"
              variant="flat"
              isRequired
              customInput={Input}
            />
          </div>
          <div>
            <label htmlFor="nama merchant" className="sr-only">
              Nama Merchant
            </label>
            <Input
              label="Nama Merchant"
              type="text"
              size="md"
              variant="flat"
              isRequired
            />
          </div>
          <div>
            <label htmlFor="nama lengkap" className="sr-only">
              Nama Lengkap
            </label>
            <Input
              label="Nama Lengkap"
              type="text"
              size="md"
              variant="flat"
              isRequired
            />
          </div>
          <div>
            <label htmlFor="provinsi" className="sr-only">
              Provinsi
            </label>
            <Autocomplete isRequired label="Provinsi" size="md" variant="flat" onSelectionChange={(value) => fetchCities(value as unknown as number)}>
              {province?.map((prov: {value: number, label: string} ) => (
                <AutocompleteItem key={prov.value} value={prov.value}>
                  {prov.label}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
          <div>
            <label htmlFor="kota / Kabupaten" className="sr-only">
              Kota / Kabupaten
            </label>
            <Autocomplete isRequired label="Kota / Kabupaten" size="md" variant="flat" onSelectionChange={(value) => fetchDistricts(value as unknown as number)}>
              {city?.map((kota: {value: number, label: string} ) => (
                <AutocompleteItem key={kota.value} value={kota.value}>
                  {kota.label}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
          <div>
            <label htmlFor="kecamatan" className="sr-only">
              Kecamatan
            </label>
            <Autocomplete isRequired label="Kecamatan" size="md" variant="flat" onSelectionChange={(value) => fetchSubDistricts(value as unknown as number)}>
              {district?.map((kecamatan: {value: number, label: string} ) => (
                <AutocompleteItem key={kecamatan.value} value={kecamatan.value}>
                  {kecamatan.label}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
          <div>
            <label htmlFor="kelurahan" className="sr-only">
              Kelurahan
            </label>
            <Autocomplete isRequired label="Kelurahan" size="md" variant="flat">
              {subDistrict?.map((kelurahan: {value: number, label: string} ) => (
                <AutocompleteItem key={kelurahan.value} value={kelurahan.value}>
                  {kelurahan.label}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
          <div>
            <label htmlFor="tanggal lahir" className="sr-only">
              Tanggal Lahir
            </label>
            <DatePicker label="Tanggal Lahir" isRequired/>
          </div>
          <div>
            <label htmlFor="alamat" className="sr-only">
              Alamat Lengkap
            </label>
            <Input
              label="Alamat"
              type="text"
              size="md"
              variant="flat"
              isRequired
            />
          </div>
          <div className="grid grid-cols-[1fr,1fr,2fr] gap-2">
            <div>
              <label htmlFor="rt" className="sr-only">
                RT
              </label>
              <NumericFormat
                label="RT"
                type="text"
                size="md"
                variant="flat"
                isRequired
                customInput={Input}
              />
            </div>
            <div>
              <label htmlFor="rw" className="sr-only">
                RW
              </label>
              <NumericFormat
                label="RW"
                type="text"
                size="md"
                variant="flat"
                isRequired
                customInput={Input}
              />
            </div>
            <div>
              <label htmlFor="kode pos" className="sr-only">
                Kode POS
              </label>
              <NumericFormat
                label="Kode POS"
                type="text"
                size="md"
                variant="flat"
                isRequired
                customInput={Input}
              />
            </div>
          </div>
          <div>
            <label htmlFor="channel" className="sr-only">
              Channel
            </label>
            <Select isRequired label="Channel" size="md" variant="flat">
              <SelectItem key="website">Website</SelectItem>
              <SelectItem key="mobile">Mobile</SelectItem>
              <SelectItem key="web-mobile">Website & Mobile</SelectItem>
            </Select>
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

export default DataDiri;