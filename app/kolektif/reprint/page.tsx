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
} from "@heroui/react";
import { MagnifyingGlassIcon, ArrowPathIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Key, useCallback, useEffect, useState } from "react";
import api from "@/lib/axios";
import { DataReprintKolektifResponse, DataReprintKolektif } from "@/types";
import { debounce, isEmpty } from "lodash";

const reprintColumns = [
  { key: "no", label: "No" },
  { key: "jenis", label: "Jenis" },
  { key: "nama_group", label: "Nama" },
  { key: "alamat", label: "Alamat" },
  { key: "jml_idpel", label: "Jml Pel" },
  { key: "last_pay", label: "Trx Terakhir" }
]

export type Selection = 'all' | Set<Key>

const ReprintKolektif = () => {
  const [dataReprint, setDataReprint] = useState<DataReprintKolektifResponse>({} as DataReprintKolektifResponse)
  const [page, setPage] = useState<number>(1)
  const [perPage, setPerPage] = useState<string>("20")
  const [totalPage, setTotalPage] = useState<number>(1)
  const [search, setSearch] = useState<string>("")
  const [selectedGroup, setSelectedGroup] = useState<DataReprintKolektif>({} as DataReprintKolektif)
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth()+1).toString())
  const [selectedFilters, setSelectedFilters] = useState<{ id_group: string, month: string, year: string } | null>(null)
  

  const fetchReprintKolektif = async () => {
    const pages = {
      tab: 'reprint',
      page: page,
      perPage: parseInt(perPage)
    }
  
    const response = await api.post('/REQUEST/act/REPORT_PAGING/rpaging_kolektif/WEB', { filters: { search: search }, pages })
    const data: DataReprintKolektifResponse = response.data
    setTotalPage(Math.ceil(parseInt(data.totalData || "0") / parseInt(perPage)))
    setDataReprint(data) 
  }

  useEffect(() => {
    fetchReprintKolektif()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, search])

  useEffect(() => {
    setPage(1)
  }, [perPage, search])

  const onHanleSelectPerPage = (keys: SharedSelection) => {
    if (keys.currentKey) {
      setPerPage(keys.currentKey)
    }
  }

  const onHandleSearch = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }, 500)

  const onHandleSelectRow = (keys: Selection) => {
    const selectedRow = dataReprint.data.find((item) => item.no === Array.from(keys)[0])
    if(selectedRow) {
      setPage(1)
      setSelectedGroup(selectedRow)
    }
  }

  const onHandleReload = () => {
    fetchReprintKolektif()
  }

  const onHandleSelectMonth = (keys: SharedSelection) => {
    if (keys.currentKey) {
      setSelectedMonth(keys.currentKey)
    }
  }

  const onHandleSelectYear = (keys: SharedSelection) => {
    if (keys.currentKey) {
      setSelectedYear(keys.currentKey)
    }
  }

  const onHandleProcess = () => {
    setSelectedFilters({
      id_group: selectedGroup.id_goup,
      month: selectedMonth,
      year: selectedYear
    })
  }
  
  const renderCell = useCallback((trx: DataReprintKolektif, columnKey: React.Key) => {
    const cellValue = trx[columnKey as keyof DataReprintKolektif];
  
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
      default:
        return cellValue
    }
  }, [])

  return (
    <div className="bg-gray-100 w-full min-h-screen grid grid-cols-2 grid-rows-[1fr, 2fr, 1fr] gap-4">
      <Header />
      <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] ml-4 p-4">
        <div className="max-h-[calc(100vh-11rem)] space-y-6">
          <h4 className="text-xl font-medium text-gray-600">Reprint Kolektif</h4>
          <Divider />
          <div className="flex justify-between items-end">
            <div className="flex gap-2">
              <Button onPress={onHandleReload} variant="bordered" color="primary" isIconOnly startContent={<ArrowPathIcon className="size-5"/>}/>
              <Input onChange={onHandleSearch} className="max-w-48" startContent={<MagnifyingGlassIcon className="size-5"/>} placeholder="Cari"/>
            </div>
            {
              !isEmpty(selectedGroup) ? (
                <div className="flex gap-2">
                  <Select selectedKeys={[selectedMonth]} onSelectionChange={onHandleSelectMonth} className="w-[130px]" variant="bordered">
                    {Array.from({ length: selectedYear === new Date().getFullYear().toString() ? new Date().getMonth() + 1 : 12 }, (_, i) => {
                      const month = new Date(0, i).toLocaleString('id-ID', { month: 'long' });
                      const value = (new Date(0, i).getMonth() + 1).toString()
                      return <SelectItem key={value}>{month}</SelectItem>
                    })}
                  </Select>
                  <Select selectedKeys={[selectedYear]} onSelectionChange={onHandleSelectYear} className="w-24" variant="bordered">
                    {
                      ["2025", "2024", "2023", "2022"].map((year) => (
                        <SelectItem key={year}>{year}</SelectItem>
                      ))
                    }
                  </Select>
                  <Button onPress={onHandleProcess} color="primary" startContent={<CheckIcon className="size-5" />}>Proses</Button>
                </div>
              ) : null
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
            <TableHeader columns={reprintColumns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody emptyContent={<div className="h-[calc(100vh-28rem)] flex items-center justify-center">No rows to display.</div>} items={dataReprint?.data || []}>
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
      <ProsesData filters={selectedFilters}/>
      <Footer />
    </div>
  )
}

export default ReprintKolektif;