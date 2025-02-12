"use client";

import api from "@/lib/axios";
import { DataReprintDetailKolektif } from "@/types";
import { formatThousands } from "@/utils/formatter";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";

const dataColumns = [
  { key: "no", label: "No" },
  { key: "idpel", label: "ID Pel" },
  { key: "idpel_name", label: "Nama" },
  { key: "tagihan", label: "Tagihan" },
  { key: "admin_bank", label: "Admin" },
  { key: "total_tagihan", label: "Total Tag" }
]

interface ProsesDataProps {
  filters : {
    id_group: string
    month: string,
    year: string
  } | null
}

const ProsesData: React.FC<ProsesDataProps> = ({ filters }) => {
  const [dataReprintDetail, setDataReprintDetail] = useState<DataReprintDetailKolektif[]>([] as DataReprintDetailKolektif[])
  
  const fetchReprintDetailKolektif = async () => {
    const response = await api.post('/REQUEST/act/REPORT_PAGING/rpaging_reprint_kolektif/WEB', { filters })
    const data = response.data.data
    let mapData: DataReprintDetailKolektif[]= []
    // add no to data
    if (response.data?.data) {
      mapData = data.map((item: DataReprintDetailKolektif, index: number): DataReprintDetailKolektif & { no: number } => {
        return {
          ...item,
          no: index + 1
        }
      })
    }
    setDataReprintDetail(mapData) 
  }

  useEffect(() => {
    if(filters) {
      fetchReprintDetailKolektif()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const renderCell = useCallback((trx: DataReprintDetailKolektif, columnKey: React.Key) => {
    const cellValue = trx[columnKey as keyof DataReprintDetailKolektif];
  
    switch (columnKey) {
      case "total_tagihan": 
        return (
          <div className='text-right'>
            Rp {formatThousands(cellValue)}
          </div>
        )
      case "admin_bank": 
        return (
          <div className='text-right'>
            Rp {formatThousands(cellValue)}
          </div>
        )
      case "tagihan": 
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
    <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] mr-4 p-4">
      <div className="h-[calc(100vh-11rem)] flex flex-col gap-6 justify-between">
        <Table
          isStriped
          isHeaderSticky
          removeWrapper
          className="h-[calc(100vh-10rem)] z-0"
          classNames={{ base: ["overflow-y-scroll overflow-x-hidden box-content"], th: ["bg-primary text-white"] }}
          selectionMode="multiple"
          color="primary"
        >
          <TableHeader columns={dataColumns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody emptyContent={<div className="h-[calc(100vh-28rem)] flex items-center justify-center">No rows to display.</div>} items={dataReprintDetail || []}>
              {(item) => {
                return <TableRow key={item.reff}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              }}
            </TableBody>
        </Table>
        <div className="flex justify-end">
          <Button color="warning" startContent={<PrinterIcon className="size-5"/>}>Cetak Struk</Button>
        </div>
      </div>
    </div>
  )
}

export default ProsesData;