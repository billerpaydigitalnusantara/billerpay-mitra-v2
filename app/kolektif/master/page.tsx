"use client";

import Header from "../../components/header";
import Footer from "../../components/footer";

import { 
  Input, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableColumn, 
  TableHeader, 
  TableRow, 
  getKeyValue, 
  Divider,
  Pagination,
  Select,
  SelectItem
} from "@heroui/react";
import { MagnifyingGlassIcon, ArrowPathIcon, ClipboardDocumentIcon, ArrowUpTrayIcon, PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";


const masterColumns = [
  { key: "no", label: "No" },
  { key: "jenis", label: "Jenis" },
  { key: "nama", label: "Nama" },
  { key: "alamat", label: "Alamat" },
  { key: "jml", label: "Jml Pel" },
  { key: "aksi", label: "Aksi" }
]

const masterRows = [
  { key: "1", no: "1", jenis: "PLN", nama: "Budi Sudarsono", alamat: "Jl. jalan", jml: 200, aksi: "Edit"}
]

const customerColumns = [
  { key: "no", label: "No" },
  { key: "id", label: "ID Pel" },
  { key: "nama", label: "Nama" },
  { key: "tarif", label: "Tarif/Daya" },
  { key: "tag", label: "Tag Terakhir" },
  { key: "aksi", label: "Aksi" }
]

const customerRows = [
  { key: "1", no: "1", id: "123456", nama: "Budi Sudarsono", tarif: "R1/450VA", tag: "Rp. 200.000", aksi: "Edit"}
]

const MasterKolektif = () => {
  return (
    <div className="bg-gray-100 w-full min-h-screen grid grid-cols-[1fr,1fr] grid-rows-[1fr, 2fr, 1fr] gap-4">
      <Header />
      <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] ml-4 p-4">
        <div className="max-h-[calc(100vh-11rem)] space-y-6">
          <h4 className="text-xl font-medium text-gray-600">Master Koletif</h4>
          <Divider />
          <div className="flex justify-between items-end">
            <Button color="primary" startContent={<PlusIcon className="size-5"/>}>Tambah</Button>
            <div className="flex gap-2">
              <Button variant="bordered" color="default" isIconOnly startContent={<ClipboardDocumentIcon className="size-5"/>}/>
              <Input className="max-w-48" startContent={<MagnifyingGlassIcon className="size-5"/>} placeholder="Cari"/>
              <Button variant="bordered" color="primary" isIconOnly startContent={<ArrowPathIcon className="size-5"/>}/>
            </div>
          </div>
          <Table
            isStriped
            isHeaderSticky
            removeWrapper
            className="z-0"
            classNames={{ base: ["overflow-y-scroll overflow-x-hidden box-content"], th: ["bg-primary text-white"] }}
            bottomContent={
              <div className="flex justify-between">
                <Select placeholder="10" className="w-24" variant="bordered">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </Select>
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={1}
                  total={1}
                />
              </div>
            }
          >
            <TableHeader columns={masterColumns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={masterRows}>
              {(item) => (
                <TableRow key={item.key}>
                  {(columnKey) => (
                    <TableCell>
                      {columnKey === "aksi" ? (
                        <div>
                          <Button color="default" size="sm" variant="light" isIconOnly startContent={<PencilSquareIcon  className="size-5"/>} />
                          <Button color="danger" size="sm" variant="light" isIconOnly startContent={<TrashIcon  className="size-5"/>} />
                        </div>
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
      <div className="max-h-[calc(100vh-11rem)] space-y-6">
        <h4 className="text-xl font-medium">Data Pelanggan</h4>
          <Divider />
          <div className="flex justify-between items-end">
            <div className="flex gap-2">
              <Button color="primary" startContent={<PlusIcon className="size-5"/>} isIconOnly/>
              <Button variant="bordered" color="primary" startContent={<ArrowUpTrayIcon className="size-5"/>}>Upload</Button>
            </div>
            <div className="flex gap-2">
              <Button variant="bordered" color="default" isIconOnly startContent={<ClipboardDocumentIcon className="size-5"/>}/>
              <Input className="max-w-48" startContent={<MagnifyingGlassIcon className="size-5"/>} placeholder="Cari"/>
              <Button variant="bordered" color="primary" isIconOnly startContent={<ArrowPathIcon className="size-5"/>}/>
            </div>
          </div>
          <Table
            isStriped
            isHeaderSticky
            removeWrapper
            className="z-0"
            classNames={{ base: ["overflow-y-scroll overflow-x-hidden box-content"], th: ["bg-primary text-white"] }}
            bottomContent={
              <div className="flex justify-between">
                <Select placeholder="10" className="w-24" variant="bordered">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </Select>
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={1}
                  total={3}
                />
              </div>
            }
          >
            <TableHeader columns={customerColumns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={customerRows}>
              {(item) => (
                <TableRow key={item.key}>
                  {(columnKey) => (
                    <TableCell>
                      {columnKey === "aksi" ? (
                        <div>
                          <Button color="default" size="sm" variant="light" isIconOnly startContent={<PencilSquareIcon  className="size-5"/>} />
                          <Button color="danger" size="sm" variant="light" isIconOnly startContent={<TrashIcon  className="size-5"/>} />
                        </div>
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
      <Footer />
    </div>
  )
}

export default MasterKolektif;