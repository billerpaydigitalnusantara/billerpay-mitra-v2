"use client";

import { useCallback, useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableColumn, 
  TableHeader, 
  TableRow, 
  Button,
  Input,
  useDisclosure,
  Tooltip,
} from "@heroui/react";
import { ArrowPathIcon, PrinterIcon, CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { NumericFormat } from "react-number-format"
import { useAtom } from 'jotai'
import { DataTransaksi, dataTransaksiAtom, selectedTrx } from "@/atoms/transaksi";
import { formatThousands } from "@/utils/formatter";
import ModalInfo from "@/components/modal-info";
import api from "@/lib/axios";
import { PaymentResponse } from "@/types";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { print } from "@/utils/print";

const columns = [
  { key: "no", label: "No" },
  { key: "product", label: "Product" },
  { key: "idpel", label: "ID Pelanggan" },
  { key: "idpel_name", label: "Nama" },
  { key: "tagihan", label: "Tagihan" },
  { key: "admin_bank", label: "Admin" },
  { key: "total_tagihan", label: "Total Tagihan" },
  { key: "status", label: "Status" },
  { key: "aksi", label: "Aksi" },
];

const Main = () => {
  const [dataTransaksi, setDataTransaksi] = useAtom(dataTransaksiAtom)
  const [selectedKeys, setSelectedKeys] = useAtom(selectedTrx)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [isPrintDisabled, setIsPrintDisabled] = useState(true)
  const [payAmount, setPayAmount] = useState<number>(0)
  const [amount, setAmount] = useState<number>(0)
  const [change, setChange] = useState<number>(0)
  const [detailMessage, setDetailMessage] = useState<string>("")
  const {isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure()
  const [isPay, setIsPay] = useState<boolean>(false)

  useEffect(() => {
    const total = dataTransaksi.filter((item) => selectedKeys === 'all' ? item : Array.from(selectedKeys).includes(item.traceId)).filter((item) => item.status === '-').reduce((acc, trx) => parseInt(trx.total_tagihan) + acc ,0)
    const dataPrint = dataTransaksi.filter((item) => selectedKeys === 'all' ? item : Array.from(selectedKeys).includes(item.traceId)).filter((item) => item.status === 'SUKSES').map((item) => item.reff)

    // tambahkan kondisi state bayar
    if(dataTransaksi.length > 0 && selectedKeys === 'all' || dataPrint.length > 0) {
      const localPrintterSettings = localStorage.getItem('printerSettings')
      const printerSettings = localPrintterSettings ? JSON.parse(localPrintterSettings) : { auto: false }

      setIsPrintDisabled(false)

      // print automatis
      if(printerSettings.auto && isPay){
        onHandleAllPrint()
      }
    } else {
      setIsPrintDisabled(true)
    }

    setAmount(total)
    setIsPay(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTransaksi, selectedKeys])

  useEffect(() => {
    if(payAmount) {
      setChange(Math.max(payAmount - amount, 0))
      if(payAmount >= amount && amount > 0) {
        setIsButtonDisabled(false)
      } else {
        setIsButtonDisabled(true)
      }
    } else {
      setChange(0)
      setIsButtonDisabled(true)
    }
  }, [payAmount, amount])

  const onHandleClickDetail = (message: string) => {
    setDetailMessage(message)
    onOpenDetail()
  }

  const onHandleDelete = (traceId: string) => {
    setDataTransaksi((transaksi) => transaksi.filter((item) => item.traceId !== traceId).map((item, index) => ({...item, no: String(index + 1)})))
  }

  const onHandleReset = () => {
    setDataTransaksi([] as DataTransaksi[])
  }

  const onHandleRecheck = async (reff: string) => {
    try {
      const response = await api.post('REQUEST/act/PROCESS/menu_cek_pending/WEB', { detail: { reff }, versi: 'V1' })
      setDataTransaksi((transaksi) => {
        const updated = transaksi.map((trx) => {
          if (trx.reff === response.data.reff) {
            return {
              ...trx,
              status: response.data.status,
              responseMessage: ''
            }
          }

          return trx;
        })

        return updated
      })
    } catch (error) {
      const err = error as AxiosError
      if(err.status && err.status >= 500) {
        toast.error('Terjadi kesalahan sistem')
      }
    }
  }

  const onHandleSinglePrint = (reff: string) => {
    print([reff])
  }

  const onHandleAllPrint = () => {
    const dataPrint = dataTransaksi.filter((item) => selectedKeys === 'all' ? item : Array.from(selectedKeys).includes(item.traceId)).filter((item) => item.status === 'SUKSES').map((item) => item.reff)
    print(dataPrint)
  }

  const onHandlePayment = async () => {
    const statusSukses = '0000'
    const statusPending = ['0005','0063','0068','1068','0099','28']
    const response = dataTransaksi.filter((item) => selectedKeys === 'all' ? item : Array.from(selectedKeys).includes(item.traceId)).filter((item) => item.status === '-').map(async (item) => {
      const response = await api.post(`/TRXPAYMENT/act/${item.traceId}/${item.reff}/WEB`)
      return response.data
    })
    const responses: PaymentResponse[] = await Promise.all(response)
    setIsPay(true)
    setDataTransaksi((transaksi) => {
      const updated = transaksi.map((trx) => {
        const updateData = responses.find((pay) => pay.trace_id === trx.traceId)

        if(updateData) {
          return {
            ...trx,
            status: updateData?.response_code.includes(statusSukses) ? 'SUKSES' : statusPending.includes(updateData?.response_code || '') ? 'PENDING' : 'GAGAL',
            responseMessage: updateData?.response_message || '',
          }
        }

        return trx
      })

      return updated
    })
    setPayAmount(0)
  }

  const renderCell = useCallback((trx: DataTransaksi, columnKey: React.Key) => {
    const cellValue = trx[columnKey as keyof DataTransaksi];

    switch (columnKey) {
      case "idpel_name":
        return (
          <div className="flex items-center">
            <Button onPress={() => onHandleClickDetail(trx['detail'])} size="sm" variant="light" isIconOnly startContent={<InformationCircleIcon className="size-5 cursor-pointer" />} />
            {cellValue}
          </div>
        )
      case "admin_bank":
          return (
            <div className="text-right">
              Rp. {formatThousands(cellValue)}
            </div>
          )
      case "tagihan":
          return (
            <div className="text-right">
              Rp. {formatThousands(cellValue)}
            </div>
          )
      case "total_tagihan":
          return (
            <div className="text-right">
              Rp. {formatThousands(cellValue)}
            </div>
          )
      case "status":
        return (
          <Tooltip isDisabled={trx['responseMessage'] === ''} content={trx['responseMessage']}>
            <span className={`font-semibold px-2 py-1 inline-block rounded ${cellValue === 'SUKSES' ? 'bg-green-100 text-green-500' : cellValue === 'PENDING' ? 'bg-orange-100 text-orange-500' : cellValue === 'GAGAL' ? 'bg-red-100 text-red-500' : ''}`}>{cellValue}</span>
          </Tooltip>
        )
      case "aksi":
          return (
            <div>
              {
                trx['status'] === 'SUKSES' ? (
                  <Button onPress={() => onHandleSinglePrint(trx['reff'])} color="default" size="sm" variant="light" isIconOnly startContent={<PrinterIcon  className="size-5"/>} />
                ) : trx['status'] === 'PENDING' ? (
                  <Button onPress={() => onHandleRecheck(trx['reff'])} color="warning" size="sm" variant="light" isIconOnly startContent={<ArrowPathIcon  className="size-5"/>} />
                ) : trx['status'] === '-' ? (
                  <Button onPress={() => onHandleDelete(trx['traceId'])} color="danger" size="sm" variant="light" isIconOnly startContent={<TrashIcon  className="size-5"/>} />
                ) : null
              }
            </div>
          )
      default:
        return cellValue
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] mr-4 p-4 flex flex-col gap-4 justify-between">
      <Table
        isStriped
        isHeaderSticky
        removeWrapper
        className="z-0"
        classNames={{ base: ["overflow-y-scroll overflow-x-hidden box-content"], th: ["bg-primary text-white"], td: ["text-sm"] }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
        color="primary"
      >
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody emptyContent={<div className="h-[calc(100vh-28rem)] flex items-center justify-center">No rows to display.</div>} items={dataTransaksi}>
          {(item) => (
            <TableRow key={item.traceId}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex flex-col gap-4">  
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center justify-between w-1/3">
            <span className="text-gray-500 text-sm font-medium">Total Bayar</span>
            <span className="text-gray-700 text-sm font-semibold">Rp. { formatThousands(amount) }</span>
          </div>
          <div className="flex items-center justify-between w-1/3">
            <span className="text-gray-500 text-sm font-medium">Nominal Bayar</span>
            <NumericFormat
              thousandSeparator="."
              decimalSeparator=","
              allowNegative={false}
              customInput={Input}
              placeholder="Nominal Bayar"
              className="w-48"
              classNames={{ input: [ "font-medium text-right" ] }}
              value={payAmount}
              onValueChange={(values) => setPayAmount(parseInt(values.value))}
            />
          </div>
          <div className="flex items-center justify-between w-1/3">
            <span className="text-gray-500 text-sm font-medium">Uang Kembali</span>
            <span className="text-gray-700 text-sm font-semibold">Rp. { formatThousands(change) }</span>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex gap-4">
            <Button startContent={<ArrowPathIcon className="size-4" />} color="danger" onPress={onHandleReset}>Reset</Button>
            <Button startContent={<PrinterIcon className="size-4" />} color="warning" isDisabled={isPrintDisabled} onPress={onHandleAllPrint}>Cetak Struk</Button>
            <Button startContent={<CheckIcon className="size-4" />} color="primary" isDisabled={isButtonDisabled} onPress={onHandlePayment}>Bayar</Button>
          </div>
        </div>
      </div>
      <ModalInfo
        title="Data Inquiry"
        message={detailMessage}
        isOpen={isOpenDetail}
        onClose={onCloseDetail}
        onCancel={onCloseDetail}
      />
    </div>
  );
}

export default Main;