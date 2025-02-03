"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button, Card, CardBody, CardHeader, DateRangePicker, Divider, getKeyValue, Input, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs } from "@heroui/react";
import { ClipboardDocumentIcon, MagnifyingGlassIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { today } from "@internationalized/date";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Line } from "react-chartjs-2";
import { useState } from "react";
ChartJS.register(CategoryScale, LineElement, LinearScale, PointElement, Title, Tooltip, Legend, Filler);

const transaksiColumns = [
  { key: "tanggal", label: "Tanggal" },
  { key: "trx", label: "Trx" },
  { key: "lembar", label: "Lembar" },
  { key: "nominal", label: "Nominal" },
  { key: "admin", label: "Admin" },
  { key: "profit", label: "Profit" }
]

const transaksiRows = [
  { key: "1", tanggal: "2021-10-10", trx: "1", lembar: "1", nominal: "Rp. 200.000", admin: "Rp. 2.000", profit: "Rp. 202.000"},
  { key: "2", tanggal: "2021-10-10", trx: "1", lembar: "1", nominal: "Rp. 200.000", admin: "Rp. 2.000", profit: "Rp. 202.000"},
  { key: "3", tanggal: "2021-10-11", trx: "2", lembar: "2", nominal: "Rp. 300.000", admin: "Rp. 3.000", profit: "Rp. 303.000"},
  { key: "4", tanggal: "2021-10-12", trx: "3", lembar: "3", nominal: "Rp. 400.000", admin: "Rp. 4.000", profit: "Rp. 404.000"},
  { key: "5", tanggal: "2021-10-13", trx: "4", lembar: "4", nominal: "Rp. 500.000", admin: "Rp. 5.000", profit: "Rp. 505.000"},
  { key: "6", tanggal: "2021-10-14", trx: "5", lembar: "5", nominal: "Rp. 600.000", admin: "Rp. 6.000", profit: "Rp. 606.000"},
  { key: "7", tanggal: "2021-10-15", trx: "6", lembar: "6", nominal: "Rp. 700.000", admin: "Rp. 7.000", profit: "Rp. 707.000"},
  { key: "8", tanggal: "2021-10-16", trx: "7", lembar: "7", nominal: "Rp. 800.000", admin: "Rp. 8.000", profit: "Rp. 808.000"},
  { key: "9", tanggal: "2021-10-17", trx: "8", lembar: "8", nominal: "Rp. 900.000", admin: "Rp. 9.000", profit: "Rp. 909.000"},
  { key: "10", tanggal: "2021-10-18", trx: "9", lembar: "9", nominal: "Rp. 1.000.000", admin: "Rp. 10.000", profit: "Rp. 1.010.000"},
  { key: "11", tanggal: "2021-10-19", trx: "10", lembar: "10", nominal: "Rp. 1.100.000", admin: "Rp. 11.000", profit: "Rp. 1.111.000"},
  { key: "12", tanggal: "2021-10-20", trx: "11", lembar: "11", nominal: "Rp. 1.200.000", admin: "Rp. 12.000", profit: "Rp. 1.212.000"},
  { key: "13", tanggal: "2021-10-21", trx: "12", lembar: "12", nominal: "Rp. 1.300.000", admin: "Rp. 13.000", profit: "Rp. 1.313.000"},
  { key: "14", tanggal: "2021-10-22", trx: "13", lembar: "13", nominal: "Rp. 1.400.000", admin: "Rp. 14.000", profit: "Rp. 1.414.000"},
  { key: "15", tanggal: "2021-10-23", trx: "14", lembar: "14", nominal: "Rp. 1.500.000", admin: "Rp. 15.000", profit: "Rp. 1.515.000"},
  { key: "16", tanggal: "2021-10-24", trx: "15", lembar: "15", nominal: "Rp. 1.600.000", admin: "Rp. 16.000", profit: "Rp. 1.616.000"},
  { key: "17", tanggal: "2021-10-25", trx: "16", lembar: "16", nominal: "Rp. 1.700.000", admin: "Rp. 17.000", profit: "Rp. 1.717.000"},
  { key: "18", tanggal: "2021-10-26", trx: "17", lembar: "17", nominal: "Rp. 1.800.000", admin: "Rp. 18.000", profit: "Rp. 1.818.000"},
  { key: "19", tanggal: "2021-10-27", trx: "18", lembar: "18", nominal: "Rp. 1.900.000", admin: "Rp. 19.000", profit: "Rp. 1.919.000"},
  { key: "20", tanggal: "2021-10-28", trx: "19", lembar: "19", nominal: "Rp. 2.000.000", admin: "Rp. 20.000", profit: "Rp. 2.020.000"},
  { key: "21", tanggal: "2021-10-29", trx: "20", lembar: "20", nominal: "Rp. 2.100.000", admin: "Rp. 21.000", profit: "Rp. 2.121.000"},
  { key: "22", tanggal: "2021-10-30", trx: "21", lembar: "21", nominal: "Rp. 2.200.000", admin: "Rp. 22.000", profit: "Rp. 2.222.000"}
]

const labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];

// Data want to show on chart
const datasets = [12, 45, 67, 43, 89, 34, 67, 43, 89, 34, 67, 43, 89, 34, 67, 43];

const data = {
  labels: labels,
  datasets: [
    {
      // Title of Graph
      label: "Transaksi",
      data: datasets,
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.3)",
      fill: false,
      tension: 0,
    },
    // insert similar in dataset object for making multi line chart
  ],
};

// To make configuration
const options = {
  scales: {
    y: {
      title: {
        display: true,
        text: "Jumlah Transaksi",
      },
      display: true,
      min: 10,
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

const TransaksiFee = () => {
  const [selected, setSelected] = useState("list");
   
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
                  start: today('Asia/Jakarta').subtract({ days: 14 }),
                  end: today('Asia/Jakarta'),
                }} 
              />
              <Button color="primary">Terapkan</Button>
            </div>
            <div className="flex gap-2">
              <Button variant="bordered" color="default" isIconOnly startContent={<ClipboardDocumentIcon className="size-5"/>}/>
              <Input className="max-w-48" startContent={<MagnifyingGlassIcon className="size-5"/>} placeholder="Cari tiket deposit"/>
              <Button variant="bordered" color="primary" isIconOnly startContent={<ArrowPathIcon className="size-5"/>}/>
            </div>
          </div>
          <Table
             isStriped
             isHeaderSticky
             removeWrapper
             className="h-[calc(100vh-20rem)] z-0"
             classNames={{ base: ["overflow-y-scroll overflow-x-hidden"], th: ["bg-primary text-white"] }}
          >
            <TableHeader columns={transaksiColumns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={transaksiRows}>
              {(item) => (
                <TableRow key={item.key}>
                  {(columnKey) => (
                    <TableCell>
                      {columnKey === "tanggal" ? (
                        <span>
                          <a href={`/laporan/transaksi-fee/` + item.tanggal} className="text-blue-700 underline">{getKeyValue(item, columnKey)}</a>
                        </span>
                      ) : (
                        getKeyValue(item, columnKey)
                      )}
                    </TableCell>
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
              <h4 className="font-bold text-xl">0</h4>              
            </CardBody>
          </Card>
          <Card className="p-4 bg-danger text-white">
            <CardHeader className="flex-col items-start">
              <span className="text-sm uppercase font-bold">Total Nominal</span>
            </CardHeader>
            <CardBody className="overflow-visible flex items-end py-2">
              <h4 className="font-bold text-large">Rp. 200.000</h4>              
            </CardBody>
          </Card>
          <Card className="p-4 bg-blue-500 text-white">
            <CardHeader className="flex-col items-start">
              <span className="text-sm uppercase font-bold">Total Profit</span>
            </CardHeader>
            <CardBody className="overflow-visible flex items-end py-2">
              <h4 className="font-bold text-xl">Rp. 20.000</h4>              
            </CardBody>
          </Card>
        </div>
        <Tabs
          className="mt-4" 
          aria-label="options-layout" 
          color="primary" 
          variant="solid"
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key.toString())}
        >
          <Tab 
            value="transaksi" 
            title="Transaksi"
            className="w-full"
          >
            <Line data={data} options={options} />
          </Tab>
          <Tab 
            value="produk" 
            title="Produk"
            className="w-full"
          >
            <Line data={data} options={options} />
          </Tab>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}

export default TransaksiFee;
