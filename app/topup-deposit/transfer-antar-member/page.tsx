"use client";

import Header from "../../components/header";
import Footer from "../../components/footer";
import RequestConfirmation from "./_components/request-confirmation";
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
  Select,
  SelectItem,
  Pagination,
  SharedSelection,
} from "@heroui/react";
import { PaperAirplaneIcon, MagnifyingGlassIcon, ArrowPathIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { NumericFormat } from "react-number-format"
import { CalendarDate, today } from "@internationalized/date";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import ModalInfo from "@/components/modal-info";
import { TransferMember, TransferMemberResponse } from "@/types";
import { debounce } from "lodash";
import { formatThousands } from "@/utils/formatter";
import jsonToClipboard from "@/utils/json-to-cllipboard";


const columns = [
  { key: "time", label: "Waktu Transaksi" },
  { key: "idpel", label: "ID Member" },
  { key: "nohp", label: "No. HP" },
  { key: "nama", label: "Nama Member" },
  { key: "reff", label: "Reff" },
  { key: "status", label: "Status" },
  { key: "nominal", label: "Nominal" }
];

const TransferAntarMember = () => {
  const { isOpen: isOpenDialog, onOpen: onOpenDialog, onOpenChange: onOpenChangeDialog, onClose: onCloseDialog } = useDisclosure()
  const { isOpen: isOpenModalInfo, onOpen: onOpenModalInfo, onClose: onCloseModalInfo } = useDisclosure()
  const [nominal, setNominal] = useState("")
  const [nama, setNama] = useState("")
  const [receiver, setReceiver] = useState("")
  const [keterangan, setKeterangan] = useState("")
  const [messageError, setMessageError] = useState("")
  const [page, setPage] = useState<number>(1)
  const [perPage, setPerPage] = useState<string>("20")
  const [totalPage, setTotalPage] = useState<number>(1)
  const [search, setSearch] = useState<string>("")
  const [startDate, setStartDate] = useState<CalendarDate>(today('Asia/Jakarta').subtract({ days: 14 }))
  const [endDate, setEndDate] = useState<CalendarDate>(today('Asia/Jakarta'))
  const [transferMember, setTransferMember] = useState<TransferMemberResponse>({} as TransferMemberResponse)

  const fetchTransferMember = async () => {
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

    const response = await api.post('/REQUEST/act/REPORT_PAGING/rpaging_data_transfer_saldo/WEB', { filters, pages })
    const data: TransferMemberResponse = response.data
    setTotalPage(Math.ceil(parseInt(data.recordsTotal || "0") / parseInt(perPage)))
    setTransferMember(data)
  }

  useEffect(() => {
    fetchTransferMember()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, search])

  useEffect(() => {
    setPage(1)
  }, [perPage, search])

  const onHandleApplyFilter = () => {
    fetchTransferMember()
  }

  const onHanleSelectPerPage = (keys: SharedSelection) => {
    if (keys.currentKey) {
      setPerPage(keys.currentKey)
    }
  }

  const onHandleReload = () => {
    fetchTransferMember()
  }

  const onHandleSearch = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }, 500)

  const onHandleCopyClipboard = () => {
    jsonToClipboard(transferMember.data)
  }

  const onHandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.currentTarget));
    const detail = {
      action: 'inq',
      ...formData
    }

    try {
      const response = await api.post('/REQUEST/act/PROCESS/menu_transfer_saldo/WEB', { detail, versi: 'V1' })
      if(response.data.response_code === '0000') {
        setNama(response.data.response_data?.nama_tujuan || '')
        onOpenDialog()
      } else {
        setMessageError(response.data.response_message)
        onOpenModalInfo()
      }
    } catch (error) {
      const err = error as AxiosError
      if(err.status && err.status >= 500) {
        toast.error('Terjadi kesalahan sistem')
      }
    }
  }

  const onHandleProcess = async () => {
    const detail = {
      action: 'exec',
      nohp_email: receiver,
      nominal: nominal,
      keterangan: keterangan
    }

    try {
      const response = await api.post('/REQUEST/act/PROCESS/menu_transfer_saldo/WEB', { detail, versi: 'V1' })
      if(response.data.response_code === '0000') {
        toast.success(response.data.response_message)
        fetchTransferMember()
      } else {
        toast.error(response.data.response_message)
      }
    } catch (error) {
      const err = error as AxiosError
      if(err.status && err.status >= 500) {
        toast.error('Terjadi kesalahan sistem')
      }
    }

    onCloseDialog()
    setNama("")
    setNominal("")
    setKeterangan("")
    setReceiver("")
  }

  const renderCell = useCallback((trx: TransferMember, columnKey: React.Key) => {
    const cellValue = trx[columnKey as keyof TransferMember];
  
    switch (columnKey) {
      case "nominal":
        return (
          <div className='text-right'>
            Rp {formatThousands(cellValue)}
          </div>
        )
      case "status":
        return (
          <div className={`font-semibold px-2 py-1 inline-block rounded ${cellValue === 'PENGIRIM' ? 'bg-green-100 text-green-500' : cellValue === 'PENERIMA' ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-500'}`}>
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
          <h2 className="text-large font-medium text-gray-600">Form Transfer Antar Member</h2>
          <form className="space-y-6 p-2" onSubmit={onHandleSubmit} >
            <div>
              <span className="text-sm font-medium text-gray-600">Tujuan (No HP/Email)</span>
              <Input placeholder="Tujuan" name="nohp_email" value={receiver} onValueChange={setReceiver} isRequired/>
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
                name="nominal"
                value={nominal}
                onValueChange={(values) => setNominal(values.value)}
              />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Keterangan</span>
              <Input placeholder="Keterangan" name="keterangan" value={keterangan} onValueChange={setKeterangan} isRequired/>
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
            <TableBody emptyContent={<div className="h-[calc(100vh-24rem)] flex items-center justify-center">No rows to display.</div>} items={transferMember?.data || []}>
              {(item) => (
                <TableRow key={item.id_trx}>
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
      <ModalInfo
        title="Upps... Proses Gagal"
        message={messageError}
        isOpen={isOpenModalInfo}
        onClose={onCloseModalInfo}
        onCancel={onCloseModalInfo}
      />
      <RequestConfirmation 
        isOpen={isOpenDialog} 
        onOpenChange={onOpenChangeDialog}
        onProcess={onHandleProcess}
        nama={nama}
        receiver={receiver} 
        nominal={nominal} 
      />
    </div>
  )
};

export default TransferAntarMember;
