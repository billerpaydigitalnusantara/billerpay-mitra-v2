"use client";

import Header from "../../components/header";
import Footer from "../../components/footer";
import RequestConfirmation from "./_components/request-confirmation";
import { useState } from "react";
import { 
  Input, 
  Button, 
  DateRangePicker,
  Table, 
  TableBody, 
  TableCell, 
  TableColumn, 
  TableHeader, 
  TableRow, 
  getKeyValue, 
  useDisclosure,
} from "@heroui/react";
import { PaperAirplaneIcon, MagnifyingGlassIcon, ArrowPathIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { NumericFormat } from "react-number-format"
import { today } from "@internationalized/date";


const columns = [
  { key: "waktu", label: "Waktu Transaksi" },
  { key: "id", label: "ID Member" },
  { key: "nohp", label: "No. HP" },
  { key: "nama", label: "Nama Member" },
  { key: "reff", label: "Reff" },
  { key: "status", label: "Status" },
  { key: "nominal", label: "Nominal" }
];

const rows = [
  { key: "1", waktu: "2021-09-01 10:00:00", id: "12345678", nohp: "084345345345", nama: "Budi Sudarsono", reff: "08234234324", status: "Menunggu", nominal: "200000" },
];

const TransferAntarMember = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [nominal, setNominal] = useState("")
  const [receiver, setReceiver] = useState("")

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onOpen();
  }

  return(
    <div className="bg-gray-100 w-full min-h-screen grid grid-cols-[1fr,3fr] grid-rows-[1fr, 2fr, 1fr] gap-4">
      <Header />
      <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] ml-4 p-4">
        <div className="max-h-[calc(100vh-11rem)] overflow-y-auto space-y-6">
          <h2 className="text-large font-medium text-gray-600">Form Transfer Antar Member</h2>
          <form className="space-y-6 p-2" onSubmit={onSubmit} >
            <div>
              <span className="text-sm font-medium text-gray-600">Tujuan (No HP/Email)</span>
              <Input placeholder="Tujuan" onValueChange={setReceiver} isRequired/>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Nominal</span>
              <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                customInput={Input}
                placeholder="Nominal Deposit"
                isRequired
                onValueChange={(values) => setNominal(values.value)}
              />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Keterangan</span>
              <Input placeholder="Keterangan" isRequired/>
            </div>
            <div className="flex justify-end">
              <Button color="primary" endContent={<PaperAirplaneIcon className="size-5"/>} type="submit">Request Tiket Deposit</Button>
            </div>
          </form>
        </div>
      </div>
      <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] mr-4 p-4">
        <div className="max-h-[calc(100vh-11rem)] space-y-6">
          <div className="flex justify-between items-end">
            <DateRangePicker 
              className="max-w-60"
              defaultValue={{
                start: today('Asia/Jakarta').subtract({ days: 14 }),
                end: today('Asia/Jakarta'),
              }}
            />
            <div className="flex gap-2">
              <Button variant="bordered" color="default" isIconOnly startContent={<ClipboardDocumentIcon className="size-5"/>}/>
              <Input className="max-w-48" startContent={<MagnifyingGlassIcon className="size-5"/>} placeholder="Cari tiket deposit"/>
              <Button variant="bordered" color="primary" isIconOnly startContent={<ArrowPathIcon className="size-5"/>}/>
            </div>
          </div>
          <Table
            isStriped
            isHeaderSticky
            removeWrapper
            className="z-0"
            classNames={{ base: ["overflow-y-scroll overflow-x-hidden box-content"], th: ["bg-primary text-white"] }}
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
        </div>
      </div>
      <Footer />
      <RequestConfirmation isOpen={isOpen} onOpenChange={onOpenChange} receiver={receiver} nominal={nominal} />
    </div>
  )
};

export default TransferAntarMember;
