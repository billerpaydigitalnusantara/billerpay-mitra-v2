"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { CalendarDate, today } from "@internationalized/date";
import { ArrowDownTrayIcon, ArrowPathIcon, ClipboardDocumentIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { Table, Select, SelectItem, Pagination, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Divider, DateRangePicker, Input, SharedSelection, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { DataMutasi, DataMutasiResponse } from "@/types";
import api from "@/lib/axios";
import { debounce } from "lodash";
import jsonToClipboard from "@/utils/json-to-cllipboard";
import { formatThousands } from "@/utils/formatter";

const mutasiColumns = [
  { key: "time", label: "Waktu Transaksi" },
  { key: "keterangan", label: "Keterangan" },
  { key: "total", label: "Total" },
  { key: "saldo", label: "Saldo" }
]

interface Filters {
  end_date: string,
  end_time: string,
  search: string,
  start_date: string,
  start_time: string,
}

const MutasiSaldo = () => {
  const [startDate, setStartDate] = useState<CalendarDate>(today('Asia/Jakarta').subtract({ days: 14 }))
  const [endDate, setEndDate] = useState<CalendarDate>(today('Asia/Jakarta'))
  const [page, setPage] = useState<number>(1)
  const [perPage, setPerPage] = useState<string>("20")
  const [totalPage, setTotalPage] = useState<number>(1)
  const [search, setSearch] = useState<string>("")
  const [dataMutasi, setDataMutasi] = useState<DataMutasiResponse>({} as DataMutasiResponse)

  const fetchDataMutasi = async () => {
    const filters: Filters = {
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

    const response = await api.post('/REQUEST/act/REPORT_PAGING/rpaging_mutasi_saldo/WEB', { filters, pages })
    const data: DataMutasiResponse = response.data
    setTotalPage(Math.ceil(parseInt(data.recordsTotal || "0") / parseInt(perPage)))
    setDataMutasi(data)
  }

  useEffect(() => {
    fetchDataMutasi()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, search])

  useEffect(() => {
    setPage(1)
  }, [perPage, search])

  const onHandleApplyFilter = () => {
    fetchDataMutasi()
  }

  const onHandleReload = () => {
    fetchDataMutasi()
  }

  const onHandleSearch = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }, 500)

  const onHanleSelectPerPage = (keys: SharedSelection) => {
    if (keys.currentKey) {
      setPerPage(keys.currentKey);
    }
  }

  const onHandleCopyClipboard = () => {
    jsonToClipboard(dataMutasi.data)
  }

  const fetchDownloadFileExcel = async (url: string, filename: string) => {
    const filters: Filters = {
      end_date: endDate.toString(),
      end_time: "23:59:00",
      search: search,
      start_date: startDate.toString(),
      start_time: "00:00:00"
    }

    const response = await api.post(url, { filters }, {
      responseType: "blob"
    })

     // Create a blob URL
     const blob = new Blob([response.data]);
     const link = document.createElement("a");
     link.href = window.URL.createObjectURL(blob);
     link.download = filename;
     
     // Append, trigger download, and clean up
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
     window.URL.revokeObjectURL(link.href);
  }

  const onHandleDownloadExcel = () => {
    fetchDownloadFileExcel('/CreateReportXLS/act/EXCEL/report_mutasi_saldo/WEB', 'report_mutasi_saldo.xls')
  }

  const renderCell = useCallback((trx: DataMutasi, columnKey: React.Key) => {
    const cellValue = trx[columnKey as keyof DataMutasi];

    switch (columnKey) {
      case "keterangan":
        return (
          <div className="flex gap-2">
            <div className={`size-4 rounded-full ${ trx['status'] === '1' ? 'bg-green-600' : trx['status'] === '2' ? 'bg-red-600' : 'bg-orange-600' }`}/>
            <div>
              {cellValue}
            </div>
          </div>
        )
      case "total":
        return (
          <div className="flex gap-2 items-center justify-end w-full">
            <div className={parseInt(cellValue) >= 0 ? 'text-green-600' : 'text-red-600'}>
              Rp {formatThousands(cellValue)}
            </div>
            {
              parseInt(cellValue) >= 0 ? (
                <ChevronLeftIcon className="size-4 text-green-600" />
              ) : (
                <ChevronRightIcon className="size-4  text-red-600" />
              )
            }
          </div>
        )
      case "saldo":
          return (
            <div className={`text-right ${parseInt(cellValue) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Rp {formatThousands(cellValue)}
            </div>
          )
      default:
        return cellValue
    }
  }, [])

  
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
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered" color="primary" isIconOnly startContent={<ArrowDownTrayIcon className="size-5"/>} />
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem key="excel" onPress={onHandleDownloadExcel}>Download Excel</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Button onPress={onHandleCopyClipboard}  variant="bordered" color="default" isIconOnly startContent={<ClipboardDocumentIcon className="size-5"/>}/>
              <Input  onChange={onHandleSearch} className="max-w-48" startContent={<MagnifyingGlassIcon className="size-5"/>} placeholder="Cari tiket deposit"/>
              <Button onPress={onHandleReload} variant="bordered" color="primary" isIconOnly startContent={<ArrowPathIcon className="size-5"/>}/>
            </div>
          </div>
          <Table
            isStriped
            isHeaderSticky
            removeWrapper
            className="h-[calc(100vh-20rem)] z-0"
            classNames={{ base: ["overflow-y-scroll overflow-x-hidden"], th: ["bg-primary text-white"] }}
            bottomContent={
              <div className="flex justify-between items-center sticky bottom-0 bg-white p-2">
                <Select className="w-24" variant="bordered" selectedKeys={[perPage]} onSelectionChange={onHanleSelectPerPage}>
                  <SelectItem key="20">20</SelectItem>
                  <SelectItem key="50">50</SelectItem>
                  <SelectItem key="100">100</SelectItem>
                  <SelectItem key="250">250</SelectItem>
                  <SelectItem key="500">500</SelectItem>
                  <SelectItem key="1000">1000</SelectItem>
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
            <TableHeader columns={mutasiColumns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody emptyContent={<div className="h-[calc(100vh-28rem)] flex items-center justify-center">No rows to display.</div>} items={dataMutasi?.data || []}>
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
    </div>
  )
};

export default MutasiSaldo;