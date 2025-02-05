"use client";

import api from "@/lib/axios";
import { DataDetailRegistration } from "@/types";
import { Button, Input, Autocomplete, AutocompleteItem, DatePicker, Select, SelectItem } from "@heroui/react";
import React, { Key, useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";

interface DataDiriProps {
  onPersonalData: (detail: DataDetailRegistration) => void
}

const DataDiri = ({ onPersonalData }: DataDiriProps) => {
  const [province, setProvince] = useState([])
  const [city, setCity] = useState([])
  const [district, setDistrict] = useState([])
  const [subDistrict, setSubDistrict] = useState([])
  const [selectedProvince, setSelectedProvince] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [selectedDistrict, setSelectedDistrict] = useState<string>('')
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<string>('')

  async function fetchProvinces() {
    const response = await api.get('/ALAMAT/provinces')
    const data = response.data
    setProvince(data)
    setCity([])
    setDistrict([])
    setSubDistrict([])
  }

  async function fetchCities(provinceId: string) {
    const response = await api.get('/ALAMAT/regencies/' + provinceId)
    const data = response.data
    setCity(data)
    setDistrict([])
    setSubDistrict([])
  }

  async function fetchDistricts(cityId: string) {
    const response = await api.get('/ALAMAT/districts/' + cityId)
    const data = response.data
    setDistrict(data)
    setSubDistrict([])
  }

  async function fetchSubDistricts(districtId: string) {
    const response = await api.get('/ALAMAT/villages/' + districtId)
    const data = await response.data
    setSubDistrict(data)
  }

  const onHandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const dataForm = Object.fromEntries(new FormData(event.currentTarget));
    const data = {
      ...dataForm,
      id_provinsi: selectedProvince,
      id_kota_kabupaten: selectedCity,
      id_kecamatan: selectedDistrict,
      id_kelurahan: selectedSubDistrict
    }
    onPersonalData(data)
  }

  useEffect(() => {  
    fetchProvinces()
  }, [])

  const onHandleSelectionProvince = (value: Key | null) => {
    setSelectedProvince(value as string)
    fetchCities(value as string)
  }

  const onHandleSelectionCity = (value: Key | null) => {
    setSelectedCity(value as string)
    fetchDistricts(value as string)
  }

  const onHandleSelectionDistrict = (value: Key | null) => {
    setSelectedDistrict(value as string)
    fetchSubDistricts(value as string)
  }

  const onHandleSelectionSubDistrict = (value: Key | null) => {
    setSelectedSubDistrict(value as string)
  }


  return (
    <div className="w-full max-w-md p-8 rounded-lg bg-white shadow-lg">
      <h2 className="text-2xl font-bold text-center">Lengkapi Data Diri</h2>
      <form className="mt-8 space-y-6" onSubmit={onHandleSubmit}>
        <div className="space-y-4 gap-2">
          <div>
            <label htmlFor="nik" className="sr-only">
              NIK
            </label>
            <NumericFormat
              name="nik"
              label="Nomor Induk Kependudukan (NIK)"
              type="text"
              size="md"
              variant="flat"
              maxLength={16}
              isRequired
              customInput={Input}
            />
          </div>
          <div>
            <label htmlFor="nama merchant" className="sr-only">
              Nama Merchant
            </label>
            <Input
              name="nama_merchant"
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
              name="nama_pemilik"
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
            <Autocomplete name="provinsi" isRequired label="Provinsi" size="md" variant="flat" selectedKey={selectedProvince} onSelectionChange={onHandleSelectionProvince}>
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
            <Autocomplete name="kota_kabupaten" isRequired label="Kota / Kabupaten" size="md" variant="flat" selectedKey={selectedCity} onSelectionChange={onHandleSelectionCity}>
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
            <Autocomplete name="kecamatan" isRequired label="Kecamatan" size="md" variant="flat" selectedKey={selectedDistrict} onSelectionChange={onHandleSelectionDistrict}>
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
            <Autocomplete name="kelurahan" isRequired label="Kelurahan" size="md" variant="flat" selectedKey={selectedSubDistrict} onSelectionChange={onHandleSelectionSubDistrict}>
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
            <DatePicker name="tgl_lahir" label="Tanggal Lahir" isRequired/>
          </div>
          <div>
            <label htmlFor="alamat" className="sr-only">
              Alamat Lengkap
            </label>
            <Input
              name="alamat"
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
                name="rt"
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
                name="rw"
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
                name="kodepos"
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
            <label htmlFor="interface" className="sr-only">
              Channel
            </label>
            <Select name="interface" isRequired label="Channel" size="md" variant="flat">
              <SelectItem key="WEB">Website</SelectItem>
              <SelectItem key="MOBILE">Mobile</SelectItem>
              <SelectItem key="WEB DAN MOBILE">Website & Mobile</SelectItem>
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