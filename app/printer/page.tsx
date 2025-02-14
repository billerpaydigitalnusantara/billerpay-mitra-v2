"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import { Radio, RadioGroup, Select, SelectItem, Input, Button, Divider, Checkbox } from "@heroui/react";
import { PrinterIcon, ArrowDownTrayIcon, CheckIcon } from "@heroicons/react/24/outline";
import { NumericFormat } from "react-number-format";

const Printer = () => {
  const onHandleDownloadWCPP = () => {
    window.open('https://drive.google.com/file/d/1B2vq3AhoySixbQYvGfnpcF-a_N-5Rrzd/view?usp=sharing', '_blank')
  }

  return (
    <div className="bg-gray-100 w-full min-h-screen grid grid-cols-[1fr,1fr] grid-rows-[1fr, 2fr, 1fr] gap-4">
      <Header />
      <div className="h-[calc(100vh-4rem-3rem-2rem)] ml-72 p-6 bg-white rounded-lg overflow-y-scroll">
        <h1 className="text-xl font-semibold tracking-wide">Jenis Printer</h1>
        <Divider className="my-6 h-[2px]" />
        <div className="flex flex-col items-start gap-2">
          <h4 className="font-medium text-gray-600">Setting print otomatis</h4>
          <Checkbox classNames={{ label: ["text-sm text-gray-500 font-medium"] }}>Print otomatis saat transaksi sukses</Checkbox>
        </div>
        <Divider className="my-6 h-[2px]" />
        <div className="mt-4">
          <RadioGroup className="text-gray-700 font-semibold text-sm">
            <Radio classNames={{ label: ["text-sm font-medium text-gray-600"], base: [ 'my-1' ] }} value="dotmatrix">Dot Matrix</Radio>
            <Radio classNames={{ label: ["text-sm font-medium text-gray-600"], base: [ 'my-1' ] }} value="thermal">Thermal Printer</Radio>
            <Radio classNames={{ label: ["text-sm font-medium text-gray-600"], base: [ 'my-1' ] }} value="inkjet">Ink Jet</Radio>
            <Radio classNames={{ label: ["text-sm font-medium text-gray-600"], base: [ 'my-1' ] }} value="pdf">PDF Format</Radio>
          </RadioGroup>
        </div>
        <div className="mt-4">
          <h4 className="font-medium text-gray-600">Setting Kertas</h4>
          <Select placeholder="Pilih kertas" className="w-full mt-2">
            <SelectItem value="11">1 Kertas 1 Struk</SelectItem>
            <SelectItem value="12">1 Kertas 2 Struk</SelectItem>
            <SelectItem value="13">1 Kertas 3 Struk</SelectItem>
            <SelectItem value="14">1 Kertas 4 Struk</SelectItem>
          </Select>
        </div>
        <div className="mt-4">
          <h4 className="font-medium text-gray-600">Ukuran font (px)</h4>
          <NumericFormat customInput={Input} placeholder="Masukan ukuran font" />
        </div>
        <div className="mt-4">
          <h4 className="font-medium text-gray-600">Spasi antar struk</h4>
          <NumericFormat customInput={Input} placeholder="Masukan spasi antar struk" />
        </div>
        <div className="mt-4">
          <span className="text-green-700 text-sm font-medium">* Rekomendasi kertas A4</span>
        </div>
        <div className="mt-4 flex gap-4">
          <Button startContent={<PrinterIcon className="size-5" />} color="warning" className="mt-4">Printer Test</Button>
          <Button startContent={<CheckIcon className="size-5" />} color="primary" className="mt-4">Simpan</Button>
        </div>
      </div>
      <div className="h-[calc(100vh-4rem-3rem-2rem)] mr-96 p-6 bg-white rounded-lg">
        <h1 className="text-xl font-semibold tracking-wide">Download Driver Printer</h1>
        <Divider className="my-4"/>
        <p className="text-sm text-gray-600">Silahkan download dan install WCPP untuk dapat menggunakan printer Dot Matrix</p>
        <Button onPress={onHandleDownloadWCPP} startContent={<ArrowDownTrayIcon className="size-4"/>} color="default" className="mt-4">Download WCPP for Windows</Button>
      </div>
      <Footer/>
    </div>
  );
}

export default Printer;