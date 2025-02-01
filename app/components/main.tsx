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
];

const Main = () => {
  const [selectedKeys, setSelectedKeys] = useState(new Set([""]));
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  return (
    <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] mr-4 p-4 flex flex-col justify-between">
      <Table
        aria-label="Controlled table example with dynamic content"
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
        classNames={{ th: [ "bg-primary", "text-white" ] }}
        color="default"
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