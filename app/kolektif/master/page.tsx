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
  Divider,
  Pagination,
  Select,
  SelectItem,
  SharedSelection,
  useDisclosure
} from "@heroui/react";
import { MagnifyingGlassIcon, ArrowPathIcon, ClipboardDocumentIcon, ArrowUpTrayIcon, PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { DataMasterDetailKolektif, DataMasterDetailKolektifResponse, DataMasterKolektif, DataMasterKolektifResponse } from "@/types";
import { Key, useCallback, useEffect, useState } from "react";
import api from "@/lib/axios";
import { debounce, isEmpty } from "lodash";
import jsonToClipboard from "@/utils/json-to-cllipboard";
import { formatThousands } from "@/utils/formatter";
import CreateEditMaster from "./_components/create-edit-master";
import ConfirmationDialog from "@/components/confirmation-dialog";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import CreateEditCustomer from "./_components/create-edit-customer";
import UploadFile from "./_components/upload-file";


const masterColumns = [
  { key: "no", label: "No" },
  { key: "jenis", label: "Jenis" },
  { key: "nama_group", label: "Nama" },
  { key: "alamat", label: "Alamat" },
  { key: "jml_idpel", label: "Jml Pel" },
  { key: "aksi", label: "Aksi" }
]

const customerColumns = [
  { key: "no", label: "No"},
  { key: "idpel", label: "ID Pel" },
  { key: "idpel_name", label: "Nama" },
  { key: "tarif_daya", label: "Tarif/Daya" },
  { key: "tagihan", label: "Tagihan Terakhir" },
  { key: "aksi", label: "Aksi" }
]

export type Selection = 'all' | Set<Key>

const MasterKolektif = () => {
  const [dataMaster, setDataMaster] = useState<DataMasterKolektifResponse>({} as DataMasterKolektifResponse)
  const [pageMaster, setPageMaster] = useState<number>(1)
  const [perPageMaster, setPerPageMaster] = useState<string>("20")
  const [totalPageMaster, setTotalPageMaster] = useState<number>(1)
  const [searchMaster, setSearchMaster] = useState<string>("")
  const [pageDetail, setPageDetail] = useState<number>(1)
  const [perPageDetail, setPerPageDetail] = useState<string>("20")
  const [totalPageDetail, setTotalPageDetail] = useState<number>(1)
  const [searchDetail, setSearchDetail] = useState<string>("")
  const [selectedGroup, setSelectedGroup] = useState<DataMasterKolektif>({} as DataMasterKolektif)
  const [dataCustomers, setDataCustomers] = useState<DataMasterDetailKolektifResponse>({} as DataMasterDetailKolektifResponse)
  const {isOpen: isOpenCreateEditMaster, onOpen: onOpenCreateEditMaster, onClose: onCloseCreateEditMaster} = useDisclosure()
  const {isOpen: isOpenCreateEditCustomer, onOpen: onOpenCreateEditCustomer, onClose: onCloseCreateEditCustomer} = useDisclosure()
  const {isOpen: isOpenDiaglogMaster, onOpen: onOpenDialogMaster, onClose: onCloseDialogMaster } = useDisclosure()
  const {isOpen: isOpenDiaglogCustomer, onOpen: onOpenDialogCustomer, onClose: onCloseDialogCustomer } = useDisclosure()
  const [selectedEditMaster, setSelectedEditMaster] = useState<{id: string, nama: string, alamat: string }>({ id: "", nama: "", alamat: "" })
  const [selectedEditCustomer, setSelectedEditCustomer] = useState<{id: string, idpel: string, id_group: string }>({ id: "", id_group: "", idpel: "" })
  const [selectedDeleteMaster, setSelectedDeleteMaster] = useState<{id: string, nama: string}>({ id: "", nama: "" })
  const [selectedDeleteCustomer, setSelectedDeleteCustomer] = useState<{id: string, nama: string}>({ id: "", nama: "" })
  const [typeActionMaster, setTypeActionMaster] = useState("")
  const [typeActionCustomer, setTypeActionCustomer] = useState("")
  const {isOpen: isOpenUploadFile, onOpen: onOpenUploadFile, onClose: onCloseUploadFile} = useDisclosure()

  const fetchMasterKolektif = async () => {
    const pages = {
      page: pageMaster,
      perPage: parseInt(perPageMaster)
    }

    const response = await api.post('/REQUEST/act/REPORT_PAGING/rpaging_kolektif/WEB', { filters: { search: searchMaster }, pages })
    const data: DataMasterKolektifResponse = response.data
    setTotalPageMaster(Math.ceil(parseInt(data.totalData || "0") / parseInt(perPageMaster)))
    setDataMaster(data) 
  }

  const fetchDetailKolektif = async () => {
    const pages = {
      page: pageDetail,
      perPage: parseInt(perPageDetail)
    }

    const response = await api.post('/REQUEST/act/REPORT_PAGING/rpaging_kolektif_detail/WEB', { filters: { search: searchDetail, id_group: selectedGroup.id_goup }, pages  })
    const data: DataMasterDetailKolektifResponse = response.data
    let mapData: { no: number; id: string; idpel: string; idpel_name: string; tarif_daya: string; tagihan: string; }[] = []
    if (data.data) {
      mapData = data.data?.map((item, index) => {
        return {
          ...item,
          no: index+1
        }
      })
    }
    setTotalPageDetail(Math.ceil(parseInt(data.totalData || "0") / parseInt(perPageDetail)))
    setDataCustomers({
      ...data,
      data: mapData
    }) 
  }

  useEffect(() => {
    fetchMasterKolektif()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchMasterKolektif()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageMaster, perPageMaster, searchMaster])

  useEffect(() => {
    setPageMaster(1)
  }, [perPageMaster, searchMaster])

  useEffect(() => {
    if(!isEmpty(selectedGroup)) {
      fetchDetailKolektif()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup, pageDetail, perPageDetail, searchDetail])

  useEffect(() => {
    setPageDetail(1)
  }, [perPageDetail, searchDetail])
  
  const onHandleReloadMaster = () => {
    fetchMasterKolektif()
  }

  const onHandleReloadDetail = () => {
    fetchDetailKolektif()
  }

  const onHanleSelectPerPageMaster = (keys: SharedSelection) => {
    if (keys.currentKey) {
      setPerPageMaster(keys.currentKey);
    }
  }

  const onHanleSelectPerPageDetail = (keys: SharedSelection) => {
    if (keys.currentKey) {
      setPerPageDetail(keys.currentKey);
    }
  }

  const onHandleCopyClipboard = (type: string) => {
    if(type === 'master'){
      jsonToClipboard(dataMaster?.data || [])
    } else if(type === 'detail') {
      jsonToClipboard(dataCustomers?.data || [])
    }
  }

  const onHandleSearchMaster = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchMaster(event.target.value)
  }, 500)

  const onHandleSearchDetail = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDetail(event.target.value)
  }, 500)

  const onHandleSelectRowMaster = (keys: Selection) => {
    const selectedRow = dataMaster.data.find((item) => item.no === Array.from(keys)[0])
    if(selectedRow) {
      setPageDetail(1)
      setSelectedGroup(selectedRow)
    }
  }

  const onHandleCreateMaster = () => {
    setTypeActionMaster('create')
    onOpenCreateEditMaster()
  }

  const onHandleEditMaster = ({ id, nama, alamat }: { id: string; nama: string; alamat: string }) => {
    setTypeActionMaster('update')
    setSelectedEditMaster({
      id,
      nama,
      alamat
    })
    onOpenCreateEditMaster()
  }

  const onHandleProcessed = () => {
    fetchMasterKolektif()
  }

  const onHandleDelete = async({ id, nama }: { id: string, nama: string }) => {
    setSelectedDeleteMaster({
      id,
      nama
    })
    onOpenDialogMaster()
  }

  const onConfirmDeleteMaster = async () => {
    await deleteMaster(selectedDeleteMaster.id)
    onCloseDialogMaster()
  }

  const deleteMaster = async (id: string) => {
    const detail = {
      id
    }

    try {
      const response = await api.post('/REQUEST/act/TABLE/tbl_group_kolektif_delete/WEB', { detail, versi: 'V1' })

      if(response.data.response_code === '0000') {
        toast.success(response.data.response_message)
        setSelectedGroup({} as DataMasterKolektif)
        fetchMasterKolektif()
        fetchDetailKolektif()
      } else {
        toast.error(response.data.response_message)
      }
    } catch (error) {
      const err = error as AxiosError
      if(err.status && err.status >= 500) {
        toast.error('Terjadi kesalahan sistem')
      }
    }
  }

  const onHandleCreateCustomer = () => {
    setTypeActionCustomer('create')
    setSelectedEditCustomer({
      id: "",
      idpel: "",
      id_group: selectedGroup.id_goup
    })
    onOpenCreateEditCustomer()
  }

  const onHandleEditCustomer = ({ id, idpel }: { id: string; idpel: string }) => {
    setTypeActionCustomer('update')
    setSelectedEditCustomer({
      id,
      idpel,
      id_group: selectedGroup.id_goup
    })
    onOpenCreateEditCustomer()
  }

  const onHandleProcessedCustomer = () => {
    fetchMasterKolektif()
    fetchDetailKolektif()
  }

  const onHandleDeleteCustomer = async({ id, nama }: { id: string, nama: string }) => {
    setSelectedDeleteCustomer({
      id,
      nama
    })
    onOpenDialogCustomer()
  }

  const onConfirmDeleteCustomer = async () => {
    await deleteCustomer(selectedDeleteCustomer.id)
    onCloseDialogCustomer()
  }

  const deleteCustomer = async (id: string) => {
    const detail = {
      id
    }

    try {
      const response = await api.post('/REQUEST/act/TABLE/tbl_group_kolektifdetail_delete/WEB', { detail, versi: 'V1' })

      if(response.data.response_code === '0000') {
        toast.success(response.data.response_message)
        fetchMasterKolektif()
        fetchDetailKolektif()
      } else {
        toast.error(response.data.response_message)
      }
    } catch (error) {
      const err = error as AxiosError
      if(err.status && err.status >= 500) {
        toast.error('Terjadi kesalahan sistem')
      }
    }
  }

  const onHandleProcessedUploadFile = () => {
    fetchMasterKolektif()
    fetchDetailKolektif()
  }

  const renderCell = useCallback((trx: DataMasterKolektif, columnKey: React.Key) => {
    const cellValue = trx[columnKey as keyof DataMasterKolektif];

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
      case "aksi":
        return (
          <div>
            <Button onPress={() => onHandleEditMaster({ id: trx['id_goup'], nama: trx['nama_group'], alamat: trx['alamat']})} color="default" size="sm" variant="light" isIconOnly startContent={<PencilSquareIcon  className="size-5"/>} />
            <Button onPress={() => onHandleDelete({ id: trx['id_goup'], nama: trx['nama_group']})} color="danger" size="sm" variant="light" isIconOnly startContent={<TrashIcon  className="size-5"/>} />
          </div>
        )
      default:
        return cellValue
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderCellDetail = useCallback((trx: DataMasterDetailKolektif, columnKey: React.Key) => {
    const cellValue = trx[columnKey as keyof DataMasterDetailKolektif];

    switch (columnKey) {
      case "tagihan":
        return (
          <div className='text-right'>
            Rp {formatThousands(cellValue)}
          </div>
        )
      case "aksi":
        return (
          <div>
            <Button onPress={() => onHandleEditCustomer({ id: trx['id'], idpel: trx['idpel']})} color="default" size="sm" variant="light" isIconOnly startContent={<PencilSquareIcon  className="size-5"/>} />
            <Button onPress={() => onHandleDeleteCustomer({ id: trx['id'], nama: trx['idpel'] })} color="danger" size="sm" variant="light" isIconOnly startContent={<TrashIcon  className="size-5"/>} />
          </div>
        )
      default:
        return cellValue
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bg-gray-100 w-full min-h-screen grid grid-cols-[1fr,1fr] grid-rows-[1fr, 2fr, 1fr] gap-4">
      <CreateEditMaster 
        data={selectedEditMaster} 
        type={typeActionMaster} 
        isOpen={isOpenCreateEditMaster} 
        onClose={onCloseCreateEditMaster}
        onProcessed={onHandleProcessed} 
      />
      <CreateEditCustomer 
        data={selectedEditCustomer} 
        type={typeActionCustomer} 
        isOpen={isOpenCreateEditCustomer} 
        onClose={onCloseCreateEditCustomer}
        onProcessed={onHandleProcessedCustomer} 
      />
      <ConfirmationDialog 
        title="Konfirmasi Dialog"
        message={`Apakah anda yakin ingin menghapus data ${selectedDeleteMaster.nama}?`}
        isOpen={isOpenDiaglogMaster}
        onClose={onCloseDialogMaster}
        onConfirm={onConfirmDeleteMaster}
        onCancel={onCloseDialogMaster}
      />
      <ConfirmationDialog 
        title="Konfirmasi Dialog"
        message={`Apakah anda yakin ingin menghapus data ${selectedDeleteCustomer.nama}?`}
        isOpen={isOpenDiaglogCustomer}
        onClose={onCloseDialogCustomer}
        onConfirm={onConfirmDeleteCustomer}
        onCancel={onCloseDialogCustomer}
      />
      <UploadFile 
        idGroup={selectedGroup.id_goup}
        isOpen={isOpenUploadFile}
        onClose={onCloseUploadFile}
        onProcessed={onHandleProcessedUploadFile}
      />
      <Header />
      <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] ml-4 p-4">
        <div className="max-h-[calc(100vh-11rem)] space-y-6">
          <h4 className="text-xl font-medium text-gray-600">Master Koletif</h4>
          <Divider />
          <div className="flex justify-between items-end">
            <Button onPress={onHandleCreateMaster} color="primary" startContent={<PlusIcon className="size-5"/>}>Tambah</Button>
            <div className="flex gap-2">
              <Button onPress={() => onHandleCopyClipboard('master')} variant="bordered" color="default" isIconOnly startContent={<ClipboardDocumentIcon className="size-5"/>}/>
              <Input onChange={onHandleSearchMaster} className="max-w-48" startContent={<MagnifyingGlassIcon className="size-5"/>} placeholder="Cari"/>
              <Button onPress={onHandleReloadMaster} variant="bordered" color="primary" isIconOnly startContent={<ArrowPathIcon className="size-5"/>}/>
            </div>
          </div>
          <Table
            isStriped
            isHeaderSticky
            removeWrapper
            className="h-[calc(100vh-20rem)] z-0"
            classNames={{ base: ["overflow-y-scroll overflow-x-hidden box-content"], th: ["bg-primary text-white"] }}
            onSelectionChange={onHandleSelectRowMaster}
            selectionMode="single"
            selectionBehavior="replace"
            color="primary"
            selectedKeys={[selectedGroup.no]}
            bottomContent={
              <div className="flex justify-between items-center sticky bottom-0 bg-white p-2">
                <Select placeholder="10" className="w-24" variant="bordered" selectedKeys={[perPageMaster]} onSelectionChange={onHanleSelectPerPageMaster}>
                    {["20", "50", "100", "250", "500", "1000"].map((value) => (
                      <SelectItem key={value}>{value}</SelectItem>
                    ))}
                </Select>
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={pageMaster}
                  initialPage={1}
                  total={totalPageMaster}
                  onChange={setPageMaster}
                />
              </div>
            }
          >
            <TableHeader columns={masterColumns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody emptyContent={<div className="h-[calc(100vh-28rem)] flex items-center justify-center">No rows to display.</div>} items={dataMaster?.data || []}>
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
      <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] mr-4 p-4">
      <div className="max-h-[calc(100vh-11rem)] space-y-6">
        <h4 className="text-xl font-medium">Data Pelanggan {selectedGroup.nama_group}</h4>
          <Divider />
          <div className={`flex justify-between items-end ${isEmpty(selectedGroup) ? 'hidden': ''}`}>
            <div className="flex gap-2">
              <Button onPress={onHandleCreateCustomer} color="primary" startContent={<PlusIcon className="size-5"/>} isIconOnly/>
              <Button onPress={onOpenUploadFile} variant="bordered" color="primary" startContent={<ArrowUpTrayIcon className="size-5"/>}>Upload</Button>
            </div>
            <div className="flex gap-2">
              <Button onPress={() => onHandleCopyClipboard('detail')} variant="bordered" color="default" isIconOnly startContent={<ClipboardDocumentIcon className="size-5"/>}/>
              <Input onChange={onHandleSearchDetail} className="max-w-48" startContent={<MagnifyingGlassIcon className="size-5"/>} placeholder="Cari"/>
              <Button onPress={onHandleReloadDetail} variant="bordered" color="primary" isIconOnly startContent={<ArrowPathIcon className="size-5"/>}/>
            </div>
          </div>
          <Table
            isStriped
            isHeaderSticky
            removeWrapper
            className="h-[calc(100vh-20rem)] z-0"
            classNames={{ base: ["overflow-y-scroll overflow-x-hidden box-content"], th: ["bg-primary text-white"] }}
            bottomContent={
              <div className="flex justify-between items-center sticky bottom-0 bg-white p-2">
                <Select placeholder="10" className="w-24" variant="bordered" selectedKeys={[perPageDetail]} onSelectionChange={onHanleSelectPerPageDetail}>
                    {["20", "50", "100", "250", "500", "1000"].map((value) => (
                      <SelectItem key={value}>{value}</SelectItem>
                    ))}
                </Select>
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={pageDetail}
                  initialPage={1}
                  total={totalPageDetail}
                  onChange={setPageDetail}
                />
              </div>
            }
          >
            <TableHeader columns={customerColumns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody emptyContent={<div className="h-[calc(100vh-28rem)] flex items-center justify-center">No rows to display.</div>} items={dataCustomers?.data || []}>
              {(item) => (
                <TableRow key={item.id}>
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

export default MasterKolektif;