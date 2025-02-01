"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { DateFormatter, parseDate } from "@internationalized/date";

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
  Divider
} from "@heroui/react";
import { MagnifyingGlassIcon, ArrowPathIcon, ClipboardDocumentIcon, PencilSquareIcon, TrashIcon, ArrowDownTrayIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { use } from "react";
import { useRouter } from "next/navigation";


const produkColumns = [
  { key: "produk", label: "Produk" },
  { key: "lembar", label: "Lembar" },
  { key: "nominal", label: "Nominal" },
  { key: "admin", label: "Admin" },
  { key: "profit", label: "Profit" },
]

const produkRows = [
  { key: "1", produk: "PLN", lembar: "1", nominal: "Rp. 200.000", admin: "Rp. 2.000", profit: "Rp. 202.000"},
  { key: "2", produk: "PLN", lembar: "1", nominal: "Rp. 200.000", admin: "Rp. 2.000", profit: "Rp. 202.000"},
]

const transaksiColumns = [
  { key: "id", label: "ID Pel" },
  { key: "nama", label: "Nama" },
  { key: "lembar", label: "Lembar" },
  { key: "nominal", label: "Nominal" },
  { key: "admin", label: "Admin" },
  { key: "profit", label: "Profit" },
]

const transaksiRows = [
  { key: "1", id: "123456", nama: "Budi Sudarsono", lembar: "1", nominal: "Rp. 200.000", admin: "Rp. 2.000", profit: "Rp. 202.000"},
]

interface Params {
  tanggal: string;
}

const TransaksiFeeTanggal = ({
  params,
}: { params: Promise<Params> }) => {
  const router = useRouter()
  const { tanggal } = use(params);
  const formatter = new DateFormatter('id-ID', { dateStyle: 'full' });

  return (
    <div className="bg-gray-100 w-full min-h-screen grid grid-cols-[1fr,1fr] grid-rows-[1fr, 2fr, 1fr] gap-4">
      <Header />
      <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] ml-4 p-4">
        <div className="max-h-[calc(100vh-11rem)] space-y-6">
          <h4 className="text-xl font-medium text-gray-600">Transaksi & Fee {formatter.format(parseDate(tanggal).toDate('Asia/Jakarta'))}</h4>
          <Divider />
          <div className="flex justify-between items-center gap-2">
            <div>
              <Button onPress={router.back} variant="bordered" color="default" startContent={<ArrowLeftIcon className="size-5"/>}>Kembali</Button>
            </div>
            <div className="flex gap-2">
              <Button variant="bordered" color="default" isIconOnly startContent={<ClipboardDocumentIcon className="size-5"/>}/>
              <Button variant="bordered" color="primary" isIconOnly startContent={<ArrowPathIcon className="size-5"/>}/>
            </div>
          </div>
          <Table
            aria-label="Controlled table example with dynamic content"
            classNames={{ th: ["bg-primary text-white"] }}
            selectionMode="single"
          >
            <TableHeader columns={produkColumns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={produkRows}>
              {(item) => (
                <TableRow key={item.key}>
                  {(columnKey) => (
                    <TableCell>
                      {columnKey === "produk" ? (
                        <span>
                          <a className="text-blue-700 underline cursor-pointer">{getKeyValue(item, columnKey)}</a>
                        </span>
                      ) : (
                        getKeyValue(item, columnKey)
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] mr-4 p-4">
        <div className="max-h-[calc(100vh-11rem)] space-y-6">
          <h4 className="text-xl font-medium text-gray-600">Transaksi & Fee {formatter.format(parseDate(tanggal).toDate('Asia/Jakarta'))}</h4>
          <Divider />
          <div className="flex justify-end items-center gap-2">
            <Button variant="bordered" color="primary" isIconOnly startContent={<ArrowDownTrayIcon className="size-5"/>} />
            <Button variant="bordered" color="default" isIconOnly startContent={<ClipboardDocumentIcon className="size-5"/>}/>
            <Input className="w-48" startContent={<MagnifyingGlassIcon className="size-5"/>} placeholder="Cari"/>
            <Button variant="bordered" color="primary" isIconOnly startContent={<ArrowPathIcon className="size-5"/>}/>
          </div>
          <Table
            aria-label="Controlled table example with dynamic content"
            classNames={{ th: ["bg-primary text-white"] }}
          >
            <TableHeader columns={transaksiColumns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={transaksiRows}>
              {(item) => (
                <TableRow key={item.key}>
                  {(columnKey) => (
                    <TableCell>
                      {columnKey === "aksi" ? (
                        <div>
                          <Button color="default" size="sm" variant="light" isIconOnly startContent={<PencilSquareIcon  className="size-5"/>} />
                          <Button color="danger" size="sm" variant="light" isIconOnly startContent={<TrashIcon  className="size-5"/>} />
                        </div>
                      ) : (
                        getKeyValue(item, columnKey)
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default TransaksiFeeTanggal;