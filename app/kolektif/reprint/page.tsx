"use client";

import dynamic from "next/dynamic";
import Header from "../../components/header";
import Footer from "../../components/footer";
const ProsesData = dynamic(() => import("./_components/proses-data"), { ssr: false });

import { 
  Input, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableColumn, 
  TableHeader, 
  TableRow, 
  getKeyValue, 
  Divider,
  Pagination,
  Select,
  SelectItem,
} from "@heroui/react";
import { MagnifyingGlassIcon, ArrowPathIcon, CheckIcon } from "@heroicons/react/24/outline";

const reprintColumns = [
  { key: "no", label: "No" },
  { key: "jenis", label: "Jenis" },
  { key: "nama", label: "Nama" },
  { key: "alamat", label: "Alamat" },
  { key: "jml", label: "Jml Pel" },
  { key: "trx", label: "Trx Terakhir" }
]

const reprintRows = [
  { key: "1", no: "1", jenis: "PLN", nama: "Budi Sudarsono", alamat: "Jl. jalan", jml: 200, trx: "-"}
]

const ReprintKolektif = () => {
  return (
    <div className="bg-gray-100 w-full min-h-screen grid grid-cols-2 grid-rows-[1fr, 2fr, 1fr] gap-4">
      <Header />
      <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] ml-4 p-4">
        <div className="max-h-[calc(100vh-11rem)] space-y-6">
          <h4 className="text-xl font-medium text-gray-600">Reprint Kolektif</h4>
          <Divider />
          <div className="flex justify-between items-end">
            <div className="flex gap-2">
              <Button variant="bordered" color="primary" isIconOnly startContent={<ArrowPathIcon className="size-5"/>}/>
              <Input className="max-w-48" startContent={<MagnifyingGlassIcon className="size-5"/>} placeholder="Cari"/>
            </div>
            <div className="flex gap-2">
              <Select placeholder="Januari" className="w-28" variant="bordered">
                <SelectItem value="jan">Januari</SelectItem>
                <SelectItem value="feb">Februari</SelectItem>
                <SelectItem value="mar">Maret</SelectItem>
              </Select>
              <Select placeholder="2025" className="w-24" variant="bordered">
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </Select>
              <Button color="primary" startContent={<CheckIcon className="size-5" />}>Proses</Button>
            </div>
          </div>
          <Table
            aria-label="Controlled table example with dynamic content"
            classNames={{ th: ["bg-primary text-white"] }}
            bottomContent={
              <div className="flex justify-between">
                <Select placeholder="10" className="w-24" variant="bordered">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </Select>
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={1}
                  total={1}
                />
              </div>
            }
          >
            <TableHeader columns={reprintColumns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={reprintRows}>
              {(item) => (
                <TableRow key={item.key}>
                  {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <ProsesData />
      <Footer />
    </div>
  )
}

export default ReprintKolektif;