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

const prosesColumns = [
  { key: "no", label: "No" },
  { key: "jenis", label: "Jenis" },
  { key: "nama", label: "Nama" },
  { key: "alamat", label: "Alamat" },
  { key: "jml", label: "Jml Pel" },
  { key: "status", label: "Status" }
]

const prosesRows = [
  { key: "1", no: "1", jenis: "PLN", nama: "Budi Sudarsono", alamat: "Jl. jalan", jml: 200, status: "INQ"}
]

const ProsesKolektif = () => {
  return (
    <div className="bg-gray-100 w-full min-h-screen grid grid-cols-[1fr,1.3fr] grid-rows-[1fr, 2fr, 1fr] gap-4">
      <Header />
      <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] ml-4 p-4">
        <div className="max-h-[calc(100vh-11rem)] space-y-6">
          <h4 className="text-xl font-medium text-gray-600">Proses Kolektif</h4>
          <Divider />
          <div className="flex justify-between items-end">
            <div className="flex gap-2">
              <Button variant="bordered" color="primary" isIconOnly startContent={<ArrowPathIcon className="size-5"/>}/>
              <Input className="max-w-48" startContent={<MagnifyingGlassIcon className="size-5"/>} placeholder="Cari"/>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center font-medium text-gray-600 text-sm">Admin</div>
              <Select placeholder="3000" className="w-24" variant="bordered">
                <SelectItem value="3000">3.000</SelectItem>
                <SelectItem value="5000">5.000</SelectItem>
                <SelectItem value="8000">8.000</SelectItem>
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
            <TableHeader columns={prosesColumns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={prosesRows}>
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

export default ProsesKolektif;