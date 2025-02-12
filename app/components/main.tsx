"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableColumn, 
  TableHeader, 
  TableRow, 
  getKeyValue, 
  Button,
  Checkbox,
  Input,
} from "@heroui/react";
import { ArrowPathIcon, PrinterIcon, CheckIcon } from "@heroicons/react/24/outline";
import { NumericFormat } from "react-number-format";

const columns = [
  { key: "no", label: "No" },
  { key: "product", label: "Product" },
  { key: "idPel", label: "ID Pelanggan" },
  { key: "nama", label: "Nama" },
  { key: "tagihan", label: "Tagihan" },
  { key: "admin", label: "Admin" },
  { key: "totalTagihan", label: "Total Tagihan" },
  { key: "status", label: "Status" },
  { key: "aksi", label: "Aksi" },
];

const rows = [
  { key: "1", no: "1", product: "PLN", idPel: "1234567890", nama: "Budi", tagihan: "100000", admin: "2500", totalTagihan: "102500", status: "Lunas", aksi: "Bayar" },
  { key: "2", no: "2", product: "PLN", idPel: "1234567890", nama: "Budi", tagihan: "100000", admin: "2500", totalTagihan: "102500", status: "Lunas", aksi: "Bayar" },
  { key: "3", no: "3", product: "PLN", idPel: "1234567890", nama: "Budi", tagihan: "100000", admin: "2500", totalTagihan: "102500", status: "Lunas", aksi: "Bayar" },
  { key: "4", no: "4", product: "PLN", idPel: "1234567890", nama: "Budi", tagihan: "100000", admin: "2500", totalTagihan: "102500", status: "Lunas", aksi: "Bayar" },
  { key: "5", no: "5", product: "PLN", idPel: "1234567890", nama: "Budi", tagihan: "100000", admin: "2500", totalTagihan: "102500", status: "Lunas", aksi: "Bayar" },
  { key: "6", no: "6", product: "PLN", idPel: "1234567890", nama: "Budi", tagihan: "100000", admin: "2500", totalTagihan: "102500", status: "Lunas", aksi: "Bayar" },
  { key: "7", no: "7", product: "PLN", idPel: "1234567890", nama: "Budi", tagihan: "100000", admin: "2500", totalTagihan: "102500", status: "Lunas", aksi: "Bayar" },
  { key: "8", no: "8", product: "PLN", idPel: "1234567890", nama: "Budi", tagihan: "100000", admin: "2500", totalTagihan: "102500", status: "Lunas", aksi: "Bayar" },
  { key: "9", no: "9", product: "PLN", idPel: "1234567890", nama: "Budi", tagihan: "100000", admin: "2500", totalTagihan: "102500", status: "Lunas", aksi: "Bayar" },
  { key: "10", no: "10", product: "PLN", idPel: "1234567890", nama: "Budi", tagihan: "100000", admin: "2500", totalTagihan: "102500", status: "Lunas", aksi: "Bayar" },
  { key: "11", no: "11", product: "PLN", idPel: "1234567890", nama: "Budi", tagihan: "100000", admin: "2500", totalTagihan: "102500", status: "Lunas", aksi: "Bayar" },
  { key: "12", no: "12", product: "PLN", idPel: "1234567890", nama: "Budi", tagihan: "100000", admin: "2500", totalTagihan: "102500", status: "Lunas", aksi: "Bayar" },
  { key: "13", no: "13", product: "PLN", idPel: "1234567890", nama: "Budi", tagihan: "100000", admin: "2500", totalTagihan: "102500", status: "Lunas", aksi: "Bayar" },
  { key: "14", no: "14", product: "PLN", idPel: "1234567890", nama: "Budi", tagihan: "100000", admin: "2500", totalTagihan: "102500", status: "Lunas", aksi: "Bayar" },
  { key: "15", no: "15", product: "PLN", idPel: "1234567890", nama: "Budi", tagihan: "100000", admin: "2500", totalTagihan: "102500", status: "Lunas", aksi: "Bayar" },
  { key: "16", no: "16", product: "PLN", idPel: "1234567890", nama: "Budi", tagihan: "100000", admin: "2500", totalTagihan: "102500", status: "Lunas", aksi: "Bayar" },
  { key: "17", no: "17", product: "PLN", idPel: "1234567890", nama: "Budi", tagihan: "100000", admin: "2500", totalTagihan: "102500", status: "Lunas", aksi: "Bayar" },
  { key: "18", no: "18", product: "PLN", idPel: "1234567890", nama: "Budi", tagihan: "100000", admin: "2500", totalTagihan: "102500", status: "Lunas", aksi: "Bayar" },
  { key: "19", no: "19", product: "PLN", idPel: "1234567890", nama: "Budi", tagihan: "100000", admin: "2500", totalTagihan: "102500", status: "Lunas", aksi: "Bayar" },
  { key: "20", no: "20", product: "PLN", idPel: "1234567890", nama: "Budi", tagihan: "100000", admin: "2500", totalTagihan: "102500", status: "Lunas", aksi: "Bayar" },
  { key: "21", no: "21", product: "PLN", idPel: "1234567890", nama: "Budi", tagihan: "100000", admin: "2500", totalTagihan: "102500", status: "Lunas", aksi: "Bayar" },
  { key: "22", no: "22", product: "PLN", idPel: "1234567890", nama: "Budi", tagihan: "100000", admin: "2500", totalTagihan: "102500", status: "Lunas", aksi: "Bayar" }
];

const Main = () => {
  const [selectedKeys, setSelectedKeys] = useState(new Set([""]));
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  return (
    <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] mr-4 p-4 flex flex-col gap-4 justify-between">
      <Table
        isStriped
        isHeaderSticky
        removeWrapper
        className="z-0"
        classNames={{ base: ["overflow-y-scroll overflow-x-hidden box-content"], th: ["bg-primary text-white"] }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
        color="primary"
      >
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex flex-col gap-4">  
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center justify-between w-1/3">
            <span className="text-gray-500 text-sm font-medium">Total Bayar</span>
            <span className="text-gray-700 text-sm font-semibold">Rp. 0</span>
          </div>
          <div className="flex items-center justify-between w-1/3">
            <span className="text-gray-500 text-sm font-medium">Nominal Bayar</span>
            <NumericFormat
              thousandSeparator="."
              decimalSeparator=","
              allowNegative={false}
              customInput={Input}
              dir="rtl"
              placeholder="Nominal Bayar"
              isRequired
              className="w-48"
              classNames={{ input: [ "font-medium" ] }}
              onChange={(e) => setIsButtonDisabled(e.target.value === "")}
            />
          </div>
          <div className="flex items-center justify-between w-1/3">
            <span className="text-gray-500 text-sm font-medium">Uang Kembali</span>
            <span className="text-gray-700 text-sm font-semibold">Rp. 0</span>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex gap-4">
            <Button startContent={<ArrowPathIcon className="size-4" />} color="danger">Reset</Button>
            <Button startContent={<PrinterIcon className="size-4" />} color="warning" isDisabled>Cetak Struk</Button>
            <Button startContent={<CheckIcon className="size-4" />} color="primary" isDisabled={isButtonDisabled}>Bayar</Button>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <span className="text-gray-600 text-sm font-medium">Aktifkan Bayar</span>
          <Checkbox defaultSelected={false} />
        </div>
      </div>
    </div>
  );
}

export default Main;