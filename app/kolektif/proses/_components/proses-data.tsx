/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArrowDownTrayIcon, PrinterIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Checkbox } from "@heroui/react";
import { useCallback } from "react";

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

const dataRows: Iterable<any> | undefined = []

const ProsesData = () => {

  const renderCell = useCallback((trx: any, columnKey: React.Key) => {
    const cellValue = trx[columnKey as keyof any];
  
    switch (columnKey) {
      case "jenis":
        return (
          <div className={`font-semibold px-2 py-1 inline-block rounded ${cellValue === 'PLN' ? 'bg-yellow-100 text-yellow-500' : cellValue === 'PDAM' ? 'bg-blue-100 text-blue-500' : 'bg-red-100 text-red-500'}`}>
            {cellValue}
          </div>
        )
      case "jml_idpel":
        return (
          <div className={`font-semibold px-2 py-1 inline-block rounded ${parseInt(cellValue) > 0 ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
            {cellValue}
          </div>
        )
      default:
        return cellValue
    }
  }, [])

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
          <TableBody emptyContent={<div className="h-[calc(100vh-28rem)] flex items-center justify-center">No rows to display.</div>} items={dataRows}>
              {(item) => (
                <TableRow key={item.no}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
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