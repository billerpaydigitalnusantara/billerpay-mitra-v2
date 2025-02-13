"use client";

import Header from "../../components/header";
import Footer from "../../components/footer";
import RequestConfirmation from "./_components/request-confirmation";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
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
  useDisclosure,
  SharedSelection,
  Pagination,
  Select,
  SelectItem,
} from "@heroui/react";
import { PaperAirplaneIcon, MagnifyingGlassIcon, ArrowPathIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { NumericFormat } from "react-number-format"
import { CalendarDate, today } from "@internationalized/date";
import { DataTicketDeposit, DataTicketDepositResponse } from "@/types";
import api from "@/lib/axios";
import { debounce } from "lodash";
import jsonToClipboard from "@/utils/json-to-cllipboard";
import { formatThousands } from "@/utils/formatter";

interface IBank {
  icon: string;
  nama_bank: string;
  no_rek: string;
}

const columns = [
  { key: "time", label: "Waktu Transaksi" },
  { key: "bank", label: "Bank" },
  { key: "norek_tujuan", label: "No. Rekening" },
  { key: "nominal", label: "Nominal" },
  { key: "status", label: "Status" }
];

const RequestTiketDeposit = () => {
  const [banks, setBanks] = useState([] as IBank[]);
  const [selected, setSelected] = useState({} as IBank);
  const [nominal, setNominal] = useState("")
  const { isOpen: isOpenDialog, onOpen: onOpenDialog, onOpenChange: onOpenChangeDialog } = useDisclosure()
  const [page, setPage] = useState<number>(1)
  const [perPage, setPerPage] = useState<string>("20")
  const [totalPage, setTotalPage] = useState<number>(1)
  const [search, setSearch] = useState<string>("")
  const [startDate, setStartDate] = useState<CalendarDate>(today('Asia/Jakarta').subtract({ days: 14 }))
  const [endDate, setEndDate] = useState<CalendarDate>(today('Asia/Jakarta'))
  const [dataTicketDepost, setDataTicketDeposit] = useState<DataTicketDepositResponse>({} as DataTicketDepositResponse)

  useEffect(() => {
    async function fetchBanks() {
      const response = await api.get('https://api.billerpay.id/core/public/index.php/KONFIG/BANK')
      const data = response.data
      setBanks(data)
      if (data.length > 0) {
        setSelected(data[0])
      }
    }
    fetchBanks()
  }, []);

  const fetchTicketDeposit = async () => {
    const filters = {
      end_date: endDate.toString(),
      end_time: "23:59:00",
      search: search,
      start_date: startDate.toString(),
      start_time: "00:00:00"
    }

    const pages = {
      page: page,
      perPage: parseInt(perPage)
    }

    const response = await api.post('/REQUEST/act/REPORT_PAGING/rpaging_tiket_deposit/WEB', { filters, pages })
    const data: DataTicketDepositResponse = response.data
    setTotalPage(Math.ceil(parseInt(data.totalData || "0") / parseInt(perPage)))
    setDataTicketDeposit(data)
  }

  useEffect(() => {
    fetchTicketDeposit()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, search])

  useEffect(() => {
    setPage(1)
  }, [perPage, search])

  const onHandleApplyFilter = () => {
    fetchTicketDeposit()
  }

  const onHanleSelectPerPage = (keys: SharedSelection) => {
    if (keys.currentKey) {
      setPerPage(keys.currentKey)
    }
  }

  const onHandleReload = () => {
    fetchTicketDeposit()
  }

  const onHandleSearch = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }, 500)

  const onHandleCopyClipboard = () => {
    jsonToClipboard(dataTicketDepost.data)
  }

  const onHandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onOpenDialog()
  }

  const onHandleProccesed = () => {
    fetchTicketDeposit()
  }

  const renderCell = useCallback((trx: DataTicketDeposit, columnKey: React.Key) => {
    const cellValue = trx[columnKey as keyof DataTicketDeposit];
  
    switch (columnKey) {
      case "bank":
        return (
          <div className="flex gap-1 items-center">
            <span className={`w-1 h-6 rounded-lg ${cellValue === 'BNI' ? 'bg-orange-500' : cellValue === 'MANDIRI' ? 'bg-yellow-500' : cellValue === 'BCA' ? 'bg-blue-500' : cellValue === 'BSI' ? 'bg-cyan-500' : cellValue === 'BRI' ? 'bg-blue-800' : 'bg-gray-500'}`}></span>
            {cellValue}
          </div>
        )
      case "nominal":
        return (
          <div className='text-right'>
            Rp {formatThousands(cellValue)}
          </div>
        )
      case "status":
        return (
          <div className={`font-semibold px-2 py-1 inline-block rounded ${cellValue === 'SUKSES' ? 'bg-green-100 text-green-500' : cellValue === 'MENUNGGU' ? 'bg-blue-100 text-blue-500' : 'bg-red-100 text-red-500'}`}>
            {cellValue}
          </div>
        )
      default:
        return cellValue
    }
  }, [])

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
          <form className="space-y-6 p-2" onSubmit={onHandleSubmit} >
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
                validate={(value) => {
                  if (parseInt(value.replace('.', '')) < 10000) {
                    return "Minimal nominal request tiket deposit Rp. 10.000";
                  }
        
                  return null
                }}
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
            <div className="flex items-center gap-2">
              <DateRangePicker 
                className="max-w-60"
                value={{
                  start: startDate,
                  end: endDate,
                }}
                onChange={(value) => {
                  if(value) {
                    setStartDate(value?.start)
                    setEndDate(value?.end)
                  }
                }} 
              />
              <Button color="primary" onPress={onHandleApplyFilter}>Terapkan</Button>
            </div>
            <div className="flex gap-2">
              <Button onPress={onHandleCopyClipboard} variant="bordered" color="default" isIconOnly startContent={<ClipboardDocumentIcon className="size-5"/>}/>
              <Input onChange={onHandleSearch} className="max-w-48" startContent={<MagnifyingGlassIcon className="size-5"/>} placeholder="Cari tiket deposit"/>
              <Button onPress={onHandleReload} variant="bordered" color="primary" isIconOnly startContent={<ArrowPathIcon className="size-5"/>}/>
            </div>
          </div>
          <Table
            isStriped
            isHeaderSticky
            removeWrapper
            className="h-[calc(100vh-10rem)] z-0"
            classNames={{ base: ["overflow-y-scroll overflow-x-hidden box-content"], th: ["bg-primary text-white"] }}
            bottomContent={
              <div className="flex justify-between items-center sticky bottom-0 bg-white p-2">
                <Select placeholder="10" className="w-24" variant="bordered" selectedKeys={[perPage]} onSelectionChange={onHanleSelectPerPage}>
                    {["20", "50", "100", "250", "500", "1000"].map((value) => (
                      <SelectItem key={value}>{value}</SelectItem>
                    ))}
                </Select>
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  initialPage={1}
                  total={totalPage}
                  onChange={setPage}
                />
              </div>
            }
          >
            <TableHeader columns={columns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody emptyContent={<div className="h-[calc(100vh-24rem)] flex items-center justify-center">No rows to display.</div>} items={dataTicketDepost?.data || []}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Footer />
      <RequestConfirmation isOpen={isOpenDialog} onOpenChange={onOpenChangeDialog} onProcessed={onHandleProccesed} bank={selected.nama_bank} nominal={nominal} />
    </div>
  )
};

export default RequestTiketDeposit;
