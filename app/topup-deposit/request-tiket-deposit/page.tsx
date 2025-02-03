"use client";

import Header from "../../components/header";
import Footer from "../../components/footer";
import RequestConfirmation from "./_components/request-confirmation";
import Image from "next/image";
import { useEffect, useState } from "react";
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

interface IBank {
  icon: string;
  nama_bank: string;
  no_rek: string;
}

const columns = [
  { key: "waktu", label: "Waktu Transaksi" },
  { key: "bank", label: "Bank" },
  { key: "rekening", label: "No. Rekening" },
  { key: "nominal", label: "Nominal" },
  { key: "status", label: "Status" }
];

const rows = [
  { key: "1", waktu: "2021-09-01 10:00:00", bank: "BRI", rekening: "123456789", nominal: "100000", status: "Menunggu" },
  { key: "2", waktu: "2021-09-01 10:00:00", bank: "BNI", rekening: "123456789", nominal: "100000", status: "Menunggu" },
];

const RequestTiketDeposit = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [banks, setBanks] = useState([] as IBank[]);
  const [selected, setSelected] = useState({} as IBank);
  const [nominal, setNominal] = useState("")

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onOpen();
  }

  useEffect(() => {
    async function fetchBanks() {
      const res = await fetch('https://api.billerpay.id/core/public/index.php/KONFIG/BANK')
      const data = await res.json()
      setBanks(data)
      if (data.length > 0) {
        setSelected(data[0])
      }
    }
    fetchBanks()
  }, []);

  return(
    <div className="bg-gray-100 w-full min-h-screen grid grid-cols-[1fr,3fr] grid-rows-[1fr, 2fr, 1fr] gap-4">
      <Header />
      <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] ml-4 p-4">
        <div className="max-h-[calc(100vh-11rem)] overflow-y-auto space-y-6">
          <h2 className="text-large font-medium text-gray-600">Pilih Bank</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
            {banks.length === 0 ? (
              <div className="col-span-full text-center text-gray-600 h-[232px] font-medium">Sedang memuat data bank</div>
            ) : (
              banks.map((bank: IBank) => (
                <div
                  onClick={() => setSelected(bank)} 
                  key={bank.nama_bank} 
                  className={`flex flex-col h-28 items-center justify-start rounded-lg border-2 p-4 gap-2 cursor-pointer ${bank.nama_bank === selected.nama_bank ? "border-primary bg-primary-100" : "border-gray-200"}`}
                >
                  {
                    bank.icon === null ? (
                      <div className="w-10 min-h-10 bg-gray-200 rounded-lg"></div>
                    ) : (
                      <Image 
                        src={bank.icon}
                        alt="icon"
                        width={60}
                        height={20}
                      />
                    )
                  }
                  <span className="font-semibold text-gray-600 text-center">{bank.nama_bank}</span>
                </div>
              ))
            )}
          </div>
          <form className="space-y-6 p-2" onSubmit={onSubmit} >
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
              <span className="text-sm font-semibold text-gray-600">Catatan:</span>
              <div className="text-sm text-gray-600">Minimal nominal request tiket deposit Rp. 10.000</div>
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
      <RequestConfirmation isOpen={isOpen} onOpenChange={onOpenChange} bank={selected.nama_bank} nominal={nominal} />
    </div>
  )
};

export default RequestTiketDeposit;
