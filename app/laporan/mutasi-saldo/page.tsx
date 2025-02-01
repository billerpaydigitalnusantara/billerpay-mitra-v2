"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { today } from "@internationalized/date";
import { ArrowDownTrayIcon, ArrowPathIcon, ClipboardDocumentIcon, MagnifyingGlassIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Table, Select, SelectItem, Pagination, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, getKeyValue, Divider, DateRangePicker, Input } from "@heroui/react";

const mutasiColumns = [
  { key: "waktu", label: "Waktu Transaksi" },
  { key: "keterangan", label: "Keterangan" },
  { key: "total", label: "Total" },
  { key: "saldo", label: "Saldo" }
]

const mutasiRows = [
  { key: "1", waktu: "2021-10-10 10:10:10", keterangan: "Deposit", total: "Rp. 200.000", saldo: "Rp. 2.000.000"},
  { key: "2", waktu: "2021-10-10 10:10:10", keterangan: "Penarikan", total: "Rp. 200.000", saldo: "Rp. 2.000.000"}
]

const MutasiSaldo = () => {
  return (
    <div className="bg-gray-100 w-full min-h-screen grid grid-cols-[1fr] grid-rows-[1fr, 2fr, 1fr] gap-4">
      <Header />
      <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] ml-4 p-4">
        <h2 className="text-xl font-medium text-gray-600">Mutasi Saldo</h2>
        <Divider className="my-6" />
        <div className="max-h-[calc(100vh-11rem)] space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <DateRangePicker 
                className="max-w-60"
                defaultValue={{
                  start: today('Asia/Jakarta').subtract({ days: 14 }),
                  end: today('Asia/Jakarta'),
                }} 
              />
              <Button color="primary">Terapkan</Button>
            </div>
            <div className="flex gap-2">
              <Button variant="bordered" color="primary" isIconOnly startContent={<ArrowDownTrayIcon className="size-5"/>} />
              <Button variant="bordered" color="default" isIconOnly startContent={<ClipboardDocumentIcon className="size-5"/>}/>
              <Input className="max-w-48" startContent={<MagnifyingGlassIcon className="size-5"/>} placeholder="Cari tiket deposit"/>
              <Button variant="bordered" color="primary" isIconOnly startContent={<ArrowPathIcon className="size-5"/>}/>
            </div>
          </div>
          <Table
            aria-label="Controlled table example with dynamic content"
            classNames={{ th: ["bg-primary text-white"] }}
            bottomContent={
              <div className="flex justify-between items-center">
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
            <TableHeader columns={mutasiColumns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={mutasiRows}>
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
};

export default MutasiSaldo;