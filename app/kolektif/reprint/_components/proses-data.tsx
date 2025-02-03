"use client";

import { ArrowPathIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, getKeyValue } from "@heroui/react";

const dataColumns = [
  { key: "no", label: "No" },
  { key: "id", label: "ID Pel" },
  { key: "nama", label: "Nama" },
  { key: "tagihan", label: "Tagihan" },
  { key: "admin", label: "Admin" },
  { key: "total", label: "Total Tag" }
]

const dataRows = [
  { key: "1", no: "1", id: "123456", nama: "Budi Sudarsono", tagihan: "200.000", admin: "3000", total: "230.000"}
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
          color="default"
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
        <div className="flex justify-end">
          <Button color="warning" startContent={<PrinterIcon className="size-5"/>}>Cetak Struk</Button>
        </div>
      </div>
    </div>
  )
}

export default ProsesData;