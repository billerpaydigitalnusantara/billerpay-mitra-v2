"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { DateFormatter, parseDate } from "@internationalized/date";

import { 
  Input, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableColumn, 
  TableHeader, 
  TableRow, 
  Divider
} from "@heroui/react";
import { MagnifyingGlassIcon, ArrowPathIcon, ClipboardDocumentIcon, ArrowDownTrayIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTrxFeeDayDetailResponse, DataTrxFeeDayResponse } from "@/types";
import api from "@/lib/axios";
import { formatThousands } from "@/utils/formatter";
import jsonToClipboard from "@/utils/json-to-cllipboard";
import { debounce } from "lodash";


const produkColumns = [
  { key: "product", label: "Produk" },
  { key: "total_lembar", label: "Lembar" },
  { key: "total_nominal", label: "Nominal" },
  { key: "total_admin", label: "Admin" },
  { key: "profit", label: "Profit" },
]

const transaksiColumns = [
  { key: "idpel", label: "ID Pel" },
  { key: "nama", label: "Nama" },
  { key: "lembar", label: "Lembar" },
  { key: "nominal_transaksi", label: "Nominal" },
  { key: "admin", label: "Admin" },
  { key: "profit", label: "Profit" },
]

interface Params {
  tanggal: string;
}

const TransaksiFeeTanggal = ({
  params,
}: { params: Promise<Params> }) => {
  const router = useRouter()
  const { tanggal } = use(params);
  const formatter = new DateFormatter('id-ID', { dateStyle: 'full' });
  const [dataTrxFeeProduct, setDataTrxFeeProduct] = useState<DataTrxFeeDayResponse[]>([] as DataTrxFeeDayResponse[])
  const [dataTrxFeeDetail, setDataTrxFeeDetail] = useState<DataTrxFeeDayDetailResponse[]>([] as DataTrxFeeDayDetailResponse[])
  const [search, setSearch] = useState<string>("")
  const [product, setProduct] = useState<string>("")

  const fetchTrxByDate = async (date: string) => {
    const response = await api.post('/REQUEST/act/REPORT/web_transaksi_hari/WEB', { filters: { date }})
    if(response.data.data.length > 0 && response.data.report) {
      const data: DataTrxFeeDayResponse[] = response.data.data
      const report = response.data.report
      const dataTrxFee: DataTrxFeeDayResponse[] = [ ...data, {
        product: "Total",
        total_transaksi: report.total_trx,
        total_lembar: report.total_lembar,
        total_tagihan: report.total_tagihan,
        total_nominal: report.total_nominal,
        total_admin: report.total_admin,
        profit: report.total_profit,
        stat: 0,
        abnormal: "",
      }]

      setDataTrxFeeProduct(dataTrxFee)
    }
  }

  const fetchTrxDetail = async (date: string, product: string) => {
    const response = await api.post('/REQUEST/act/REPORT/web_transaksi_detail/WEB', { filters: { search, product, date }})
    if(response.data.data.length > 0) {
      setDataTrxFeeDetail(response.data.data)
    }

    if(response.data.data === false) {
      setDataTrxFeeDetail([])
    }
  }

  useEffect(() => {
    fetchTrxByDate(tanggal)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(product.length > 0) {
      fetchTrxDetail(tanggal,product)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const onHandleClickProduct = (product: string) => {
    setProduct(product)
    fetchTrxDetail(tanggal,product)
  }

  const onHandleSearch = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }, 500)
 
  const onHandleReloadProduct = () => {
    fetchTrxByDate(tanggal)
  }

  const onHandleReloadDetail = () => {
    if(product.length > 0) {
      fetchTrxDetail(tanggal,product)
    }
  }

  const onHandleCopyClipboard = (type: string) => {
    if(type === 'product'){
      jsonToClipboard(dataTrxFeeProduct)
    } else if(type  === 'detail'){
      jsonToClipboard(dataTrxFeeDetail)
    }
  }

  const fetchDownloadFileExcel = async (url: string, filename: string) => {
    const filters = {
      date: tanggal,
      search: search,
      product: product
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
    fetchDownloadFileExcel('/CreateReportXLS/act/EXCEL/report_trx_detail/WEB', 'report_trx_detail.xls')
  }

  const renderCell = useCallback((trx: DataTrxFeeDayResponse, columnKey: React.Key) => {
    const cellValue = trx[columnKey as keyof DataTrxFeeDayResponse];

    if(cellValue === 'Total') {
      return cellValue
    }

    switch (columnKey) {
      case "product":
        return (
          <div onClick={() => onHandleClickProduct(cellValue as string)} className="underline text-blue-700 cursor-pointer">{cellValue}</div>
        )
      case "total_nominal":
        return (
          <div className='text-right'>
            Rp {formatThousands(cellValue)}
          </div>
        )
      case "total_admin":
          return (
            <div className='text-right'>
              Rp {formatThousands(cellValue)}
            </div>
          )
      case "profit":
          return (
            <div className='text-right'>
              Rp {formatThousands(cellValue)}
            </div>
          )
      default:
        return cellValue
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderCellDetail = useCallback((trx: DataTrxFeeDayDetailResponse, columnKey: React.Key) => {
    const cellValue = trx[columnKey as keyof DataTrxFeeDayDetailResponse];

    switch (columnKey) {
      case "nominal_transaksi":
        return (
          <div className='text-right'>
            Rp {formatThousands(cellValue)}
          </div>
        )
      case "admin":
          return (
            <div className='text-right'>
              Rp {formatThousands(cellValue)}
            </div>
          )
      case "profit":
          return (
            <div className='text-right'>
              Rp {formatThousands(cellValue)}
            </div>
          )
      default:
        return cellValue
    }
  }, [])

  return (
    <div className="bg-gray-100 w-full min-h-screen grid grid-cols-[1fr,1fr] grid-rows-[1fr, 2fr, 1fr] gap-4">
      <Header />
      <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] ml-4 p-4">
        <div className="max-h-[calc(100vh-11rem)] space-y-6">
          <h4 className="text-xl font-medium text-gray-600">Transaksi & Fee {formatter.format(parseDate(tanggal).toDate('Asia/Jakarta'))}</h4>
          <Divider />
          <div className="flex justify-between items-center gap-2">
            <div>
              <Button onPress={router.back} variant="bordered" color="default" startContent={<ArrowLeftIcon className="size-5"/>}>Kembali</Button>
            </div>
            <div className="flex gap-2">
              <Button onPress={() => onHandleCopyClipboard('product')} variant="bordered" color="default" isIconOnly startContent={<ClipboardDocumentIcon className="size-5"/>}/>
              <Button onPress={onHandleReloadProduct} variant="bordered" color="primary" isIconOnly startContent={<ArrowPathIcon className="size-5"/>}/>
            </div>
          </div>
          <Table
            isStriped
            isHeaderSticky
            removeWrapper
            className="z-0"
            classNames={{ base: ["overflow-y-scroll overflow-x-hidden"], th: ["bg-primary text-white"], tbody: ["[&>tr]:first:rounded-lg"], tr: ["last:bg-primary-50 [&>td]:last:font-semibold [&>td]:last:text-gray-700"], td: ["first:rounded-s-lg last:rounded-e-lg"]}}
          >
            <TableHeader columns={produkColumns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody emptyContent={<div className="h-[calc(100vh-28rem)] flex items-center justify-center">No rows to display.</div>} items={dataTrxFeeProduct}>
              {(item: DataTrxFeeDayResponse) => (
                <TableRow key={item.product}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] mr-4 p-4">
        <div className="max-h-[calc(100vh-11rem)] space-y-6">
          <h4 className="text-xl font-medium text-gray-600 h-7">
            {
              product.length > 0 ? (
                `Detail Transaksi ${product} ${formatter.format(parseDate(tanggal).toDate('Asia/Jakarta'))}`
              ) : null
            }
          </h4>
          <Divider />
          <div className="flex justify-end items-center gap-2">
            <Button onPress={onHandleDownloadExcel} variant="bordered" color="primary" isIconOnly startContent={<ArrowDownTrayIcon className="size-5"/>} />
            <Button onPress={() => onHandleCopyClipboard('detail')} variant="bordered" color="default" isIconOnly startContent={<ClipboardDocumentIcon className="size-5"/>}/>
            <Input onChange={onHandleSearch} className="w-48" startContent={<MagnifyingGlassIcon className="size-5"/>} placeholder="Cari"/>
            <Button onPress={onHandleReloadDetail} variant="bordered" color="primary" isIconOnly startContent={<ArrowPathIcon className="size-5"/>}/>
          </div>
          <Table
            isStriped
            isHeaderSticky
            removeWrapper
            className="z-0"
            classNames={{ base: ["overflow-y-scroll overflow-x-hidden box-content"], th: ["bg-primary text-white"] }}
          >
            <TableHeader columns={transaksiColumns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody emptyContent={<div className="h-[calc(100vh-28rem)] flex items-center justify-center">No rows to display.</div>} items={dataTrxFeeDetail}>
              {(item: DataTrxFeeDayDetailResponse) => (
                <TableRow key={item.no}>
                  {(columnKey) => (
                    <TableCell>{renderCellDetail(item, columnKey)}</TableCell>
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
}

export default TransaksiFeeTanggal;