"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import { Radio, RadioGroup, Select, SelectItem, Input, Button, Divider, Checkbox, SharedSelection } from "@heroui/react";
import { PrinterIcon, ArrowDownTrayIcon, CheckIcon } from "@heroicons/react/24/outline";
import { NumericFormat } from "react-number-format";
import usePersistantState from "@/states/persistant";
import { useEffect, useState } from "react";
import { PrinterSettings } from "@/types";
import { print } from "@/utils/print";
import toast from "react-hot-toast";

const Printer = () => {
  const [printerSettings, setPrinterSettings] = usePersistantState<PrinterSettings>('printerSettings', {
    auto: false,
    type: 'pdf',
    config: {
      spaceMatrix: 0,
      space: 1,
      paper: 4,
      font: 12
    }
  })

  const [autoPrint, setAutoPrint] = useState<boolean>(printerSettings.auto)
  const [type, setType] = useState<string>(printerSettings.type)
  const [paper, setPaper] = useState<number>(printerSettings.config?.paper || 4)
  const [font, setFont] = useState<number>(printerSettings.config?.font || 12)
  const [space, setSpace] = useState<number>(printerSettings.config?.space || 1)
  const [spaceMatrix, setSpaceMatrix] = useState<number>(printerSettings.config?.spaceMatrix || 0)

  useEffect(() => {
    const initialValue = localStorage.getItem('printerSettings')
    if(initialValue) {
      setPrinterSettings(JSON.parse(initialValue))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setAutoPrint(printerSettings.auto)
    setType(printerSettings.type)
    setPaper(printerSettings.config?.paper || 4)
    setFont(printerSettings.config?.font || 12)
    setSpace(printerSettings.config?.space || 1)
    setSpaceMatrix(printerSettings.config?.spaceMatrix || 0)
  }, [printerSettings])

  const onHandleDownloadWCPP = () => {
    window.open('https://drive.google.com/file/d/1B2vq3AhoySixbQYvGfnpcF-a_N-5Rrzd/view?usp=sharing', '_blank')
  }

  const onHandleSelectPaper = (keys: SharedSelection) => {
    if(keys.currentKey) {
      setPaper(Number(keys.currentKey))
    }
  }

  const onHandleSave = () => {
    const config = {
      auto: autoPrint,
      type: type,
      config: type === 'thermal' ? undefined : type === 'dotmatrix' ? { spaceMatrix: spaceMatrix } : {
        space: space,
        font: font,
        paper: paper,
      }
    }
    setPrinterSettings(config)
    toast.success('Berhasil menyimpan settings printer')
  }

  const onTestPrint = () => {
    print(['000000000000'])
  }

  return (
    <div className="bg-gray-100 w-full min-h-screen grid grid-cols-[1fr,1fr] grid-rows-[1fr, 2fr, 1fr] gap-4">
      <Header />
      <div className="h-[calc(100vh-4rem-3rem-2rem)] ml-72 p-6 bg-white rounded-lg overflow-y-scroll">
        <h1 className="text-xl font-semibold tracking-wide">Jenis Printer</h1>
        <Divider className="my-6 h-[2px]" />
        <div className="flex flex-col items-start gap-2">
          <h4 className="font-medium text-gray-600">Setting print otomatis</h4>
          <Checkbox isSelected={autoPrint} onValueChange={setAutoPrint} classNames={{ label: ["text-sm text-gray-500 font-medium"] }}>Print otomatis saat transaksi sukses</Checkbox>
        </div>
        <Divider className="my-6 h-[2px]" />
        <div className="mt-4">
          <RadioGroup value={type} onValueChange={setType} className="text-gray-700 font-semibold text-sm">
            <Radio classNames={{ label: ["text-sm font-medium text-gray-600"], base: [ 'my-1' ] }} value="dotmatrix">Dot Matrix</Radio>
            {
              type === 'dotmatrix' ? (
                <div>
                  <h4 className="font-medium text-gray-600">Tambah Spasi</h4>
                  <NumericFormat customInput={Input} value={spaceMatrix} onValueChange={(values) => setSpaceMatrix(Number(values.value))} />
                </div>
              ) : null
            }
            <Radio classNames={{ label: ["text-sm font-medium text-gray-600"], base: [ 'my-1' ] }} value="thermal">Thermal Printer</Radio>
            <Radio classNames={{ label: ["text-sm font-medium text-gray-600"], base: [ 'my-1' ] }} value="inkjet">Ink Jet</Radio>
            {
              type === 'inkjet' ? (
              <div>
                <div>
                  <h4 className="font-medium text-gray-600">Setting Kertas</h4>
                  <Select defaultSelectedKeys={['1']} selectedKeys={[paper.toString()]} onSelectionChange={onHandleSelectPaper} placeholder="Pilih kertas" className="w-full mt-2">
                    <SelectItem key="1">1 Kertas 1 Struk</SelectItem>
                    <SelectItem key="2">1 Kertas 2 Struk</SelectItem>
                    <SelectItem key="3">1 Kertas 3 Struk</SelectItem>
                    <SelectItem key="4">1 Kertas 4 Struk</SelectItem>
                  </Select>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium text-gray-600">Ukuran font (px)</h4>
                  <NumericFormat customInput={Input} defaultValue={12} value={font} onValueChange={(values) => setFont(Number(values.value))} placeholder="Masukan ukuran font" />
                </div>
                <div className="mt-4">
                  <h4 className="font-medium text-gray-600">Spasi antar struk</h4>
                  <NumericFormat customInput={Input} defaultValue={1} value={space} onValueChange={(values) => setSpace(Number(values.value))} placeholder="Masukan spasi antar struk" />
                </div>
                <div className="mt-4">
                  <span className="text-green-700 text-sm font-medium">* Rekomendasi kertas A4</span>
                </div>
              </div>
              ) : null
            }
            <Radio classNames={{ label: ["text-sm font-medium text-gray-600"], base: [ 'my-1' ] }} value="pdf">PDF Format</Radio>
            {
              type === 'pdf' ? (
              <div>
                <div>
                  <h4 className="font-medium text-gray-600">Setting Kertas</h4>
                  <Select defaultSelectedKeys={['1']} selectedKeys={[paper.toString()]} onSelectionChange={onHandleSelectPaper} placeholder="Pilih kertas" className="w-full mt-2">
                    <SelectItem key="1">1 Kertas 1 Struk</SelectItem>
                    <SelectItem key="2">1 Kertas 2 Struk</SelectItem>
                    <SelectItem key="3">1 Kertas 3 Struk</SelectItem>
                    <SelectItem key="4">1 Kertas 4 Struk</SelectItem>
                  </Select>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium text-gray-600">Ukuran font (px)</h4>
                  <NumericFormat customInput={Input} defaultValue={12} value={font} onValueChange={(values) => setFont(Number(values.value))} placeholder="Masukan ukuran font" />
                </div>
                <div className="mt-4">
                  <h4 className="font-medium text-gray-600">Spasi antar struk</h4>
                  <NumericFormat customInput={Input} defaultValue={1} value={space} onValueChange={(values) => setSpace(Number(values.value))} placeholder="Masukan spasi antar struk" />
                </div>
                <div className="mt-4">
                  <span className="text-green-700 text-sm font-medium">* Rekomendasi kertas A4</span>
                </div>
              </div>
              ) : null
            }
          </RadioGroup>
        </div>
        <div className="mt-4 flex gap-4">
          <Button startContent={<PrinterIcon className="size-5" />} color="warning" className="mt-4" onPress={onTestPrint}>Printer Test</Button>
          <Button startContent={<CheckIcon className="size-5" />} color="primary" className="mt-4" onPress={onHandleSave}>Simpan</Button>
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