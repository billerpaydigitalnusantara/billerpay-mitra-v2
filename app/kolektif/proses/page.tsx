"use client";

import dynamic from "next/dynamic";
import Header from "../../components/header";
import Footer from "../../components/footer";
const ProsesData = dynamic(() => import("./_components/proses-data"), { ssr: false });

import { 
  Input, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableColumn, 
  TableHeader, 
  TableRow, 
  Divider,
  Pagination,
  Select,
  SelectItem,
  SharedSelection,
  Tooltip,
} from "@heroui/react";
import { MagnifyingGlassIcon, ArrowPathIcon, CheckIcon } from "@heroicons/react/24/outline";
import { DataProsesKolektif, DataProsesKolektifResponse, ListAdminResponse } from "@/types";
import { Key, useCallback, useEffect, useState } from "react";
import api from "@/lib/axios";
import { formatThousands } from "@/utils/formatter";
import { debounce, isEmpty } from "lodash";

const prosesColumns = [
  { key: "no", label: "No" },
  { key: "jenis", label: "Jenis" },
  { key: "nama_group", label: "Nama" },
  { key: "alamat", label: "Alamat" },
  { key: "jml_idpel", label: "Jml Pel" },
  { key: "status", label: "Status" }
]

export type Selection = 'all' | Set<Key>

const ProsesKolektif = () => {
  const [dataProses, setDataProses] = useState<DataProsesKolektifResponse>({} as DataProsesKolektifResponse)
  const [listAdmin, setListAdmin] = useState<string[]>([])
  const [page, setPage] = useState<number>(1)
  const [perPage, setPerPage] = useState<string>("20")
  const [totalPage, setTotalPage] = useState<number>(1)
  const [search, setSearch] = useState<string>("")
  const [selectedGroup, setSelectedGroup] = useState<DataProsesKolektif>({} as DataProsesKolektif)
  const [selectedAdmin, setSelecteAdmin] = useState<string>("")

  const fetchListAdmin = async () => {
    const response = await api.post('/KONFIG/ADMIN/GALANGAN')
    const listAdmin = response.data.filter((item: ListAdminResponse) => item.id !== 'admin_default').map((item: ListAdminResponse) => item.admin)
    const defaultAdmin: ListAdminResponse = response.data.find((item: ListAdminResponse) => item.id === 'admin_default')
    setListAdmin(listAdmin)
    setSelecteAdmin(defaultAdmin.admin)
  }

  const fetchProsesKolektif = async () => {
    const pages = {
      tab: 'proses',
      page: page,
      perPage: parseInt(perPage)
    }

    const response = await api.post('/REQUEST/act/REPORT_PAGING/rpaging_kolektif/WEB' , { filters: { search: search }, pages })
    const data: DataProsesKolektifResponse = response.data
    setTotalPage(Math.ceil(parseInt(data.totalData || "0") / parseInt(perPage)))
    setDataProses(data) 
  }

  useEffect(() => {
    fetchListAdmin()
  }, [])

  useEffect(() => {
    fetchProsesKolektif()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, search])

  useEffect(() => {
    setPage(1)
  }, [perPage, search])

  const onHandleSelectAdmin = (keys: SharedSelection) => {
    if(keys.currentKey) {
      setSelecteAdmin(keys.currentKey)
    }
  }

  const onHandleSearch = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }, 500)

  const onHandleReload = () => {
    fetchProsesKolektif()
  }

  const onHanleSelectPerPage = (keys: SharedSelection) => {
    if (keys.currentKey) {
      setPerPage(keys.currentKey)
    }
  }

  const onHandleSelectRow = (keys: Selection) => {
    const selectedRow = dataProses.data.find((item) => item.no === Array.from(keys)[0])
    if(selectedRow) {
      setPage(1)
      setSelectedGroup(selectedRow)
    }
  }

  const renderCell = useCallback((trx: DataProsesKolektif, columnKey: React.Key) => {
    const cellValue = trx[columnKey as keyof DataProsesKolektif];
  
    switch (columnKey) {
      case "jenis":
        return (
          <div className={`font-semibold px-2 py-1 inline-block rounded ${cellValue === 'PLN' ? 'bg-yellow-100 text-yellow-500' : cellValue === 'PDAM' ? 'bg-blue-100 text-blue-500' : 'bg-red-100 text-red-500'}`}>
            {cellValue}
          </div>
        )
      case "jml_idpel":
        return (
          <div className={`font-semibold px-2 py-1 inline-block rounded ${parseInt(cellValue) > 0 ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
            {cellValue}
          </div>
        )
      case "status":
          return (
            <div className="flex gap-1 items-center">
              <Tooltip isDisabled={trx['last_transaksi'] === ''} content={trx['last_transaksi']}>
                <span className={`w-1 h-6 rounded-lg ${cellValue === 'INQ' ? 'bg-blue-500' : cellValue === 'PAY' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
              </Tooltip>
              {cellValue}
            </div>
          )
      default:
        return cellValue
    }
  }, [])

  return (
    <div className="bg-gray-100 w-full min-h-screen grid grid-cols-[1fr,1.3fr] grid-rows-[1fr, 2fr, 1fr] gap-4">
      <Header />
      <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] ml-4 p-4">
        <div className="max-h-[calc(100vh-11rem)] space-y-6">
          <h4 className="text-xl font-medium text-gray-600">Proses Kolektif</h4>
          <Divider />
          <div className="flex justify-between items-end">
            <div className="flex gap-2">
              <Button onPress={onHandleReload} variant="bordered" color="primary" isIconOnly startContent={<ArrowPathIcon className="size-5"/>}/>
              <Input onChange={onHandleSearch} className="max-w-48" startContent={<MagnifyingGlassIcon className="size-5"/>} placeholder="Cari"/>
            </div>
            {
              !isEmpty(selectedGroup) ? (
                <div className="flex gap-2">
                  <div className="flex items-center font-medium text-gray-600 text-sm">Admin</div>
                    <Select className="w-24" variant="bordered" selectedKeys={[selectedAdmin]} onSelectionChange={onHandleSelectAdmin}>
                      {listAdmin.map((admin) => (
                        <SelectItem key={admin} value={admin}>{formatThousands(admin)}</SelectItem>
                      ))}
                    </Select>
                  <Button color="primary" startContent={<CheckIcon className="size-5" />}>Proses</Button>
                </div>
              ): null
            }
          </div>
          <Table
            isStriped
            isHeaderSticky
            removeWrapper
            className="h-[calc(100vh-20rem)] z-0"
            classNames={{ base: ["overflow-y-scroll overflow-x-hidden box-content"], th: ["bg-primary text-white"] }}
            onSelectionChange={onHandleSelectRow}
            selectionMode="single"
            selectionBehavior="replace"
            color="primary"
            selectedKeys={[selectedGroup.no]}
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
            <TableHeader columns={prosesColumns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody emptyContent={<div className="h-[calc(100vh-28rem)] flex items-center justify-center">No rows to display.</div>} items={dataProses?.data || []}>
              {(item) => (
                <TableRow key={item.no}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <ProsesData />
      <Footer />
    </div>
  )
}

export default ProsesKolektif;