"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button, Card, CardBody, CardHeader, DateRangePicker, Divider, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs } from "@heroui/react";
import { ClipboardDocumentIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { CalendarDate, today, parseDate } from "@internationalized/date";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Line } from "react-chartjs-2";
import { useCallback, useEffect, useState } from "react";
import { DataReportTrxFeeResponse, DataTrxFeeResponse } from "@/types";
import jsonToClipboard from "@/utils/json-to-cllipboard";
import api from "@/lib/axios";
import { formatThousands } from "@/utils/formatter";
import Link from "next/link";
ChartJS.register(CategoryScale, LineElement, LinearScale, PointElement, Title, Tooltip, Legend, Filler);

const transaksiColumns = [
  { key: "tanggal", label: "Tanggal" },
  { key: "total_transaksi", label: "Trx" },
  { key: "total_lembar", label: "Lembar" },
  { key: "total_nominal", label: "Nominal" },
  { key: "total_admin", label: "Admin" },
  { key: "profit", label: "Profit" }
]

interface Filters {
  end_date: string,
  end_time: string,
  start_date: string,
  start_time: string,
  tab?: string
}

interface DataChart {
  labels: string[], 
  datasets: {
    label: string,
    data: number[],
    borderColor: string,
    backgroundColor: string,
    fill?: boolean,
    tension?: number,
    borderDash?: number[]
  }[]
}

const TransaksiFee = () => {
  const [selectedTab, setSelectedTab] = useState("transaksi");
  const [startDate, setStartDate] = useState<CalendarDate>(new CalendarDate(today('Asia/Jakarta').year, today('Asia/Jakarta').month, 1))
  const [endDate, setEndDate] = useState<CalendarDate>(today('Asia/Jakarta'))
  const [dataTrxFee, setDataTrxFee] = useState<DataTrxFeeResponse[]>([] as DataTrxFeeResponse[])
  const [dataReportTrxFee, setDataReportTrxFee] = useState<DataReportTrxFeeResponse>({} as DataReportTrxFeeResponse)
  const [dataChartTrx, setDataChartTrx] = useState<DataChart>({
    labels: [],
    datasets: [
      {
        label: "Transaksi",
        data: [],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.3)",
        fill: true,
        tension: 0.3,
      }
    ],
  })
  
  const [optionChart, setOptionChart] = useState({})

  const fetchDataFee = async () => {
    const filters: Filters = {
      end_date: endDate.toString(),
      end_time: "23:59:00",
      start_date: startDate.toString(),
      start_time: "00:00:00",
    }

    const response = await api.post('/REQUEST/act/REPORT/web_transaksi_bulan/WEB', { filters })
    const data: DataTrxFeeResponse[] = response.data.data
    const report: DataReportTrxFeeResponse = response.data.report
    const dataTrxFee: DataTrxFeeResponse[] = [ ...data, {
      tanggal: "Total",
      total_transaksi: report.total_trx,
      total_lembar: report.total_lembar,
      total_tagihan: report.total_tagihan,
      total_nominal: report.total_nominal,
      total_admin: report.total_admin,
      profit: report.total_profit,
      stat: 0,
      abnormal: "",
    }]
    setDataTrxFee(dataTrxFee)
    setDataReportTrxFee(report)
  }

  const fetchDataChart = async () => {
    const filters: Filters = {
      end_date: endDate.toString(),
      end_time: "23:59:00",
      start_date: startDate.toString(),
      start_time: "00:00:00",
      tab: selectedTab
    }

    const response = await api.post('/REQUEST/act/DASHBOARD/transaksi_month/WEB', { filters })
    const data = response.data.data
    if(data.data) {
      if(selectedTab === 'transaksi'){
        const labels = Object.keys(data.data)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataLembar = Object.values(data.data).map((entry: any) => entry.lembar)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataNominal = Object.values(data.data).map((entry: any) => entry.nominal);
        const chartData = {
          labels: labels,
          datasets: [
            {
              label: "Transaksi",
              data: dataLembar,
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.3)",
              fill: true,
              tension: 0.3,
            }
          ],
        }
  
        const options = {
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
            tooltip: {
              callbacks: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                label: (context: any) => {
                  const index = context.dataIndex;
                  return `Lembar: ${dataLembar[index]}, Nominal: Rp ${formatThousands(dataNominal[index])}`;
                },
              },
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Jumlah Transaksi",
              },
              display: true,
            },
            x: {
              title: {
                display: true,
                text: "Tanggal Transaksi",
              },
              display: true,
            },
          },
        };
        
        setOptionChart(options)
        setDataChartTrx(chartData)
      } else {
        const labels = Object.keys(data.data);
        const products = [...new Set(Object.values(data.data).flatMap((value) => Object.keys(value as object)))];
        const dataLembar = products.map((product, index) => product !== 'nominal' && product !== 'lembar' ? ({
          label: `${product}`,
          data: labels.map(date => data.data[date][product]?.lembar || 0),
          borderColor: `hsl(${index * 86}, 70%, 50%)`,
          backgroundColor: `hsl(${index * 86}, 70%, 50%)`,
          tension: 0.3
         }) : null).filter(dataset => dataset !== null) as DataChart['datasets'];

        const chartData = {
          labels: labels,
          datasets: dataLembar
        };

        const options = {
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
            tooltip: {
              callbacks: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                label: (context: any) => {
                  return `${context.dataset.label}: ${context.raw}`;
                },
              },
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Jumlah Transaksi",
              },
              display: true,
            },
            x: {
              title: {
                display: true,
                text: "Tanggal Transaksi",
              },
              display: true,
            },
          },
        };

        setOptionChart(options)
        setDataChartTrx(chartData)
      }
    }
  }

  useEffect(() => {
    fetchDataFee()
    fetchDataChart()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchDataChart()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab])

  const onHandleApplyFilter = () => {
    fetchDataFee()
    fetchDataChart()
  }

  const onHandleReload = () => {
    fetchDataFee()
    fetchDataChart()
  }

  const onHandleCopyClipboard = () => {
    jsonToClipboard(dataTrxFee)
  }

  const isWeekend = (date: string) => {
    const dayOfWeek = parseDate(date).toDate('Asia/Jakarta').getUTCDay();
    return dayOfWeek === 5 || dayOfWeek === 6;
  }

  const renderCell = useCallback((trx: DataTrxFeeResponse, columnKey: React.Key) => {
    const cellValue = trx[columnKey as keyof DataTrxFeeResponse];

    if(cellValue === 'Total') {
      return cellValue
    }

    switch (columnKey) {
      case "tanggal":
        return (
          <Link href={`/laporan/transaksi-fee/` + cellValue} className={`underline ${isWeekend(cellValue.toString()) ? 'text-red-700' : 'text-blue-700'}`}>{cellValue}</Link>
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
  }, [])
   
  return (
    <div className="bg-gray-100 w-full min-h-screen grid grid-cols-2 grid-rows-[1fr, 2fr, 1fr] gap-4">
      <Header />
      <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] ml-4 p-4">
        <h4 className="text-xl font-medium text-gray-600">Transaksi & Fee</h4>
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
              <Button onPress={onHandleCopyClipboard} variant="bordered" color="default" isIconOnly startContent={<ClipboardDocumentIcon className="size-5"/>}/>
              <Button onPress={onHandleReload} variant="bordered" color="primary" isIconOnly startContent={<ArrowPathIcon className="size-5"/>}/>
            </div>
          </div>
          <Table
             isStriped
             isHeaderSticky
             removeWrapper
             className="h-[calc(100vh-20rem)] z-0"
             classNames={{ base: ["overflow-y-scroll overflow-x-hidden"], th: ["bg-primary text-white"], tbody: ["[&>tr]:first:rounded-lg"], tr: ["last:bg-primary-50 [&>td]:last:font-semibold [&>td]:last:text-gray-700"], td: ["first:rounded-s-lg last:rounded-e-lg"]}}
          >
            <TableHeader columns={transaksiColumns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody emptyContent={<div className="h-[calc(100vh-28rem)] flex items-center justify-center">No rows to display.</div>} items={dataTrxFee}>
              {(item: DataTrxFeeResponse) => (
                <TableRow key={item.tanggal}>
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
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-success text-white">
            <CardHeader className="flex-col items-start">
              <span className="text-sm uppercase font-bold">Total Lembar</span>
            </CardHeader>
            <CardBody className="overflow-visible flex items-end py-2">
              <h4 className="font-bold text-xl">{dataReportTrxFee.total_lembar}</h4>              
            </CardBody>
          </Card>
          <Card className="p-4 bg-danger text-white">
            <CardHeader className="flex-col items-start">
              <span className="text-sm uppercase font-bold">Total Nominal</span>
            </CardHeader>
            <CardBody className="overflow-visible flex items-end py-2">
              <h4 className="font-bold text-large">Rp. {formatThousands(dataReportTrxFee.total_nominal || 0)}</h4>              
            </CardBody>
          </Card>
          <Card className="p-4 bg-blue-500 text-white">
            <CardHeader className="flex-col items-start">
              <span className="text-sm uppercase font-bold">Total Profit</span>
            </CardHeader>
            <CardBody className="overflow-visible flex items-end py-2">
              <h4 className="font-bold text-xl">Rp. {formatThousands(dataReportTrxFee.total_profit || 0)}</h4>              
            </CardBody>
          </Card>
        </div>
        <Tabs
          className="mt-4" 
          aria-label="options-layout" 
          color="primary" 
          variant="solid"
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
        >
          <Tab 
            key="transaksi" 
            title="Transaksi"
            className="w-full"
          >
            <Line data={dataChartTrx} options={optionChart} />
          </Tab>
          <Tab 
            key="product" 
            title="Produk"
            className="w-full"
          >
            <Line data={dataChartTrx} options={optionChart} />
          </Tab>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}

export default TransaksiFee;
