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
  { key: "2", waktu: "2021-10-10 10:10:10", keterangan: "Penarikan", total: "Rp. 200.000", saldo: "Rp. 2.000.000"},
  { key: "3", waktu: "2021-10-11 11:11:11", keterangan: "Deposit", total: "Rp. 300.000", saldo: "Rp. 2.300.000"},
  { key: "4", waktu: "2021-10-12 12:12:12", keterangan: "Penarikan", total: "Rp. 100.000", saldo: "Rp. 2.200.000"},
  { key: "5", waktu: "2021-10-13 13:13:13", keterangan: "Deposit", total: "Rp. 500.000", saldo: "Rp. 2.700.000"},
  { key: "6", waktu: "2021-10-14 14:14:14", keterangan: "Penarikan", total: "Rp. 200.000", saldo: "Rp. 2.500.000"},
  { key: "7", waktu: "2021-10-15 15:15:15", keterangan: "Deposit", total: "Rp. 400.000", saldo: "Rp. 2.900.000"},
  { key: "8", waktu: "2021-10-16 16:16:16", keterangan: "Penarikan", total: "Rp. 300.000", saldo: "Rp. 2.600.000"},
  { key: "9", waktu: "2021-10-17 17:17:17", keterangan: "Deposit", total: "Rp. 600.000", saldo: "Rp. 3.200.000"},
  { key: "10", waktu: "2021-10-18 18:18:18", keterangan: "Penarikan", total: "Rp. 400.000", saldo: "Rp. 2.800.000"},
  { key: "11", waktu: "2021-10-19 19:19:19", keterangan: "Deposit", total: "Rp. 700.000", saldo: "Rp. 3.500.000"},
  { key: "12", waktu: "2021-10-20 20:20:20", keterangan: "Penarikan", total: "Rp. 500.000", saldo: "Rp. 3.000.000"},
  { key: "13", waktu: "2021-10-21 21:21:21", keterangan: "Deposit", total: "Rp. 800.000", saldo: "Rp. 3.800.000"},
  { key: "14", waktu: "2021-10-22 22:22:22", keterangan: "Penarikan", total: "Rp. 600.000", saldo: "Rp. 3.200.000"},
  { key: "15", waktu: "2021-10-23 23:23:23", keterangan: "Deposit", total: "Rp. 900.000", saldo: "Rp. 4.100.000"},
  { key: "16", waktu: "2021-10-24 00:00:00", keterangan: "Penarikan", total: "Rp. 700.000", saldo: "Rp. 3.400.000"},
  { key: "17", waktu: "2021-10-25 01:01:01", keterangan: "Deposit", total: "Rp. 1.000.000", saldo: "Rp. 4.400.000"},
  { key: "18", waktu: "2021-10-26 02:02:02", keterangan: "Penarikan", total: "Rp. 800.000", saldo: "Rp. 3.600.000"},
  { key: "19", waktu: "2021-10-27 03:03:03", keterangan: "Deposit", total: "Rp. 1.100.000", saldo: "Rp. 4.700.000"},
  { key: "20", waktu: "2021-10-28 04:04:04", keterangan: "Penarikan", total: "Rp. 900.000", saldo: "Rp. 3.800.000"},
  { key: "21", waktu: "2021-10-29 05:05:05", keterangan: "Deposit", total: "Rp. 1.200.000", saldo: "Rp. 5.000.000"},
  { key: "22", waktu: "2021-10-30 06:06:06", keterangan: "Penarikan", total: "Rp. 1.000.000", saldo: "Rp. 4.000.000"}
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
            isStriped
            isHeaderSticky
            removeWrapper
            className="h-[calc(100vh-20rem)] z-0"
            classNames={{ base: ["overflow-y-scroll overflow-x-hidden"], th: ["bg-primary text-white"] }}
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