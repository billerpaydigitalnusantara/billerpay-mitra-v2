"use client";

import { ArrowPathIcon, ArrowDownTrayIcon, PrinterIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, getKeyValue, Checkbox } from "@heroui/react";

const dataColumns = [
  { key: "no", label: "No" },
  { key: "id", label: "ID Pel" },
  { key: "nama", label: "Nama" },
  { key: "tagihan", label: "Tagihan" },
  { key: "admin", label: "Admin" },
  { key: "total", label: "Total Tag" },
  { key: "inq", label: "Inq" },
  { key: "pay", label: "Pay" },
  { key: "aksi", label: "Aksi" },
]

const dataRows = [
  { key: "1", no: "1", id: "123456", nama: "Budi Sudarsono", tagihan: "200.000", admin: "3000", total: "230.000", inq: "-", pay: "-", aksi: "Edit"}
]

const ProsesData = () => {
  return (
    <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] mr-4 p-4">
      <div className="h-[calc(100vh-11rem)] flex flex-col gap-6 justify-between">
        <Table
          isStriped
          isHeaderSticky
          removeWrapper
          className="z-0"
          classNames={{ base: ["overflow-y-scroll overflow-x-hidden box-content"], th: ["bg-primary text-white"] }}
          selectionMode="multiple"
          color="primary"
        >
          <TableHeader columns={dataColumns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody items={dataRows}>
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "aksi" ? (
                      <div>
                        <Button color="warning" size="sm" variant="light" isIconOnly startContent={<ArrowPathIcon  className="size-5"/>} />
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
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <div className="text-xs text-gray-600">Total Bayar</div>
              <div className="text-large font-medium">Rp. 0</div>
            </div>
            <div className="flex gap-4">
              <Button color="default" startContent={<ArrowDownTrayIcon className="size-5" />}>Unduh Tagihan</Button>
              <Button color="warning" startContent={<PrinterIcon className="size-5"/>}>Cetak Struk</Button>
              <Button color="primary" startContent={<CheckIcon className="size-5" />}>Bayar</Button>
            </div>
          </div>
          <div className="flex justify-end gap-2">
              <span className="font-medium text-sm text-gray-600">Aktifkan Bayar</span>
              <Checkbox classNames={{ label: ["text-sm text-gray-500 font-medium"] }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProsesData;