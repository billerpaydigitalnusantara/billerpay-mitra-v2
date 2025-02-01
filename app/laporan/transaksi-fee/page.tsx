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
            aria-label="Controlled table example with dynamic content"
            classNames={{ th: ["bg-primary text-white"], tfoot: ["font-bold"] }}
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
