"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { CalendarDate, today } from "@internationalized/date";
import { ArrowDownTrayIcon, ArrowPathIcon, ClipboardDocumentIcon, MagnifyingGlassIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { Table, Select, SelectItem, Pagination, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Divider, DateRangePicker, Input, Chip, SharedSelection, DropdownTrigger, Dropdown, DropdownItem, DropdownMenu } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { DataTrxResponse, DataTrx } from "@/types";
import api from "@/lib/axios";
import { formatToCurrency } from "@/utils/formatter";
import jsonToClipboard from "@/utils/json-to-cllipboard";
import { debounce } from "lodash";

const dataColumns = [
  { key: "time", label: "Waktu Transaksi" },
  { key: "product", label: "Produk" },
  { key: "idpel", label: "ID Pel" },
  { key: "nama_member", label: "Nama" },
  { key: "reff", label: "Reff" },
  { key: "tagihan", label: "Tagihan" },
  { key: "admin", label: "Admin" },
  { key: "total", label: "Total" },
  { key: "status", label: "Status" },
  { key: "aksi", label: "Aksi" }
]

interface Filters {
  end_date: string,
  end_time: string,
  search: string,
  start_date: string,
  start_time: string,
  status?: string,
  product?: string,
  product_detail?: string
}

interface ListProductResponse {
  label: string
}

interface ListProductDetailResponse {
  label: string,
  provider: string,
  tipe: string
}

const DataTransaksi = () => {
  const [startDate, setStartDate] = useState<CalendarDate>(today('Asia/Jakarta').subtract({ days: 14 }))
  const [endDate, setEndDate] = useState<CalendarDate>(today('Asia/Jakarta'))
  const [page, setPage] = useState<number>(1)
  const [perPage, setPerPage] = useState<string>("20")
  const [totalPage, setTotalPage] = useState<number>(1)
  const [search, setSearch] = useState<string>("")
  const [status, setStatus] = useState<string>("ALL")
  const [selectedProduct, setSelectedProduct] = useState<string>("ALL")
  const [selectedProductDetail, setSelectedProductDetail] = useState<string>("ALL")
  const [listProduct, setListProduct] = useState<ListProductResponse[]>([])
  const [listProductDetail, setListProductDetail] = useState<ListProductDetailResponse[]>([])
  const [dataTrx, setDataTrx] = useState<DataTrxResponse>({} as DataTrxResponse)

  const fetchDataTrx = async () => {
    let filters: Filters = {
      end_date: endDate.toString(),
      end_time: "23:59:00",
      search: search,
      start_date: startDate.toString(),
      start_time: "00:00:00"
    }

    delete filters.status
    delete filters.product
    delete filters.product_detail
  
    if(status !== 'ALL'){
      filters = {...filters, status: status};
    }

    if(selectedProduct !== 'ALL'){
      filters = {...filters, product: selectedProduct};
    }

    if(selectedProductDetail !== 'ALL'){
      filters = {...filters, product_detail: selectedProductDetail};
    }

    const pages = {
      page: page,
      perPage: "20"
    }
    
    const response = await api.post('REQUEST/act/REPORT_PAGING/rpaging_data_trx/WEB', { filters, pages })
    const data: DataTrxResponse = response.data
    setTotalPage(Math.ceil(parseInt(data.recordsTotal || "0") / parseInt(perPage)))
    setDataTrx(data)
  }

  const fetchListProduct = async () => {
    const response = await api.get('/FILTER/product')
    setListProduct(response.data)
  }

  const fetchListProductDetail = async (product: string) => {
    const response = await api.get('/FILTER/product_detail/' + product)
    setListProductDetail(response.data)
  }

  const fetchDownloadFileExcel = async (url: string, filename: string) => {
    let filters: Filters = {
      end_date: endDate.toString(),
      end_time: "23:59:00",
      search: search,
      start_date: startDate.toString(),
      start_time: "00:00:00"
    }

    delete filters.status
    delete filters.product
    delete filters.product_detail
  
    if(status !== 'ALL'){
      filters = {...filters, status: status};
    }

    if(selectedProduct !== 'ALL'){
      filters = {...filters, product: selectedProduct};
    }

    if(selectedProductDetail !== 'ALL'){
      filters = {...filters, product_detail: selectedProductDetail};
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

  useEffect(() => {
    fetchListProduct()
  }, [])

  useEffect(() => {
    fetchDataTrx()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[page, perPage, search])

  useEffect(() => {
    setPage(1)
  }, [perPage, search])

  const onHandleApplyFilter = () => {
    fetchDataTrx()
  }

  const onHandleReload = () => {
    fetchDataTrx()
  }

  const onHandleSearch = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }, 500)

  const onHanleSelectPerPage = (keys: SharedSelection) => {
    if (keys.currentKey) {
      setPerPage(keys.currentKey);
    }
  }

  const onHandleSelectStatus = (keys: SharedSelection) => {
    if(keys.currentKey){
      setStatus(keys.currentKey)
    }
  }

  const onHandleSelectProduct = (keys: SharedSelection) => {
    if(keys.currentKey){
      setSelectedProduct(keys.currentKey)
      fetchListProductDetail(keys.currentKey)
    }
  }

  const onHandleSelectProductDetail = (keys: SharedSelection) => {
    if(keys.currentKey){
      setSelectedProductDetail(keys.currentKey)
    }
  }

  const onHandleCopyClipboard = () => {
    jsonToClipboard(dataTrx.data)
  }

  const onHandleDownloadExcel = () => {
    fetchDownloadFileExcel('CreateReportXLS/act/EXCEL/report_data_trx/WEB', 'report_transaksi.xls')
  }

  const onHandleDownloadExcelDetail = () => {
    fetchDownloadFileExcel('/CreateReportXLS/act/EXCEL/report_pln_detail/WEB', `${selectedProduct}_${selectedProductDetail}_${endDate}.xls`)
  }


  const renderCell = useCallback((trx: DataTrx, columnKey: React.Key) => {
    const cellValue = trx[columnKey as keyof DataTrx];

    switch (columnKey) {
      case "aksi":
        return (
          trx['status'] === 'SUKSES' ? (
            <div>
              <Button color="default" size="sm" variant="light" isIconOnly startContent={<PrinterIcon  className="size-5"/>} />
            </div>
          ) : null
        )
      case "admin":
          return formatToCurrency(cellValue)
      case "tagihan":
          return formatToCurrency(cellValue)
      case "total":
        return formatToCurrency(cellValue)
      case "status":
          return (
            <Chip className="capitalize" color={cellValue === 'SUKSES' ? 'success' : 'danger'} size="sm" variant="flat">
              {cellValue}
            </Chip>
          )
      default:
        return cellValue
    }
  }, [])

  return (
    <div className="bg-gray-100 w-full min-h-screen grid grid-cols-[1fr] grid-rows-[1fr, 2fr, 1fr] gap-4">
      <Header />
      <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] ml-4 p-4">
        <h2 className="text-xl font-medium text-gray-600">Data Transaksi</h2>
        <Divider className="my-6" />
        <div className="max-h-[calc(100vh-11rem)] space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
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
              <Select placeholder="Produk" className="w-48" variant="bordered" selectedKeys={[selectedProduct]} onSelectionChange={onHandleSelectProduct}>
                <SelectItem key="ALL">Semua</SelectItem>
                <>
                  {listProduct.map((product) => (
                    <SelectItem key={product.label}>{product.label}</SelectItem>
                  ))}
                </>
              </Select>
              <Select placeholder="Produk Detail" className="w-48" variant="bordered" selectedKeys={[selectedProductDetail]} onSelectionChange={onHandleSelectProductDetail}>
                <SelectItem key="ALL">Semua</SelectItem>
                <>
                  {listProductDetail.map((product_detail) => (
                    <SelectItem key={product_detail.label}>{product_detail.label}</SelectItem>
                  ))}
                </>
              </Select>
              <Select placeholder="Status" className="w-48" variant="bordered" selectedKeys={[status]} onSelectionChange={onHandleSelectStatus}>
                <SelectItem key="ALL">Semua</SelectItem>
                <SelectItem key="SUKSES">Sukses</SelectItem>
                <SelectItem key="PENDING">Pending</SelectItem>
                <SelectItem key="GAGAL">Gagal</SelectItem>
              </Select>
              <Button color="primary" onPress={onHandleApplyFilter}>Terapkan</Button>
            </div>
            <div className="flex gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered" color="primary" isIconOnly startContent={<ArrowDownTrayIcon className="size-5"/>} />
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem key="excel" onPress={onHandleDownloadExcel}>Download Excel</DropdownItem>
                  {
                    selectedProductDetail !== 'ALL' ? (
                      <DropdownItem key="detail-excel" onPress={onHandleDownloadExcelDetail}>Download Detail Excel</DropdownItem>
                    ) : null
                  }
                </DropdownMenu>
              </Dropdown>
              <Button onPress={onHandleCopyClipboard} variant="bordered" color="default" isIconOnly startContent={<ClipboardDocumentIcon className="size-5"/>}/>
              <Input onChange={onHandleSearch} className="max-w-48" startContent={<MagnifyingGlassIcon className="size-5"/>} placeholder="Cari tiket deposit"/>
              <Button onPress={onHandleReload} variant="bordered" color="primary" isIconOnly startContent={<ArrowPathIcon className="size-5"/>}/>
            </div>
          </div>
          <Table
            isStriped
            isHeaderSticky
            removeWrapper
            className="h-[calc(100vh-20rem)] z-0"
            classNames={{ base: ["overflow-y-scroll overflow-x-hidden box-content"], th: ["bg-primary text-white"]}}
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
                <div className="flex gap-2">
                  <Chip variant="flat" color="success">{dataTrx?.statTotal?.sukses || 0} Sukses</Chip>
                  <Chip variant="flat" color="warning">{dataTrx?.statTotal?.pending || 0} Pending</Chip>
                  <Chip variant="flat" color="danger">{dataTrx?.statTotal?.gagal || 0} Gagal</Chip>
                </div>
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
            <TableHeader columns={dataColumns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody emptyContent={<div className="h-[calc(100vh-28rem)] flex items-center justify-center">No rows to display.</div>} items={dataTrx?.data || []}>
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

export default DataTransaksi;