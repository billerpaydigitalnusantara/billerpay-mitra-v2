"use client"

import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Chip, Divider } from "@heroui/react"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { AxiosError } from "axios"
import toast from "react-hot-toast"
import api from "@/lib/axios"

interface UploadFileProps {
  idGroup: string
  isOpen: boolean
  onClose: () => void
  onProcessed: () => void
}

interface ResponseUpload {
  response_code: string
  response_message: string
}

const UploadFile: React.FC<UploadFileProps> = ({ idGroup, isOpen, onClose, onProcessed }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState<boolean>(false)
  const [responseUpload, setResponseUpload] = useState<ResponseUpload[]>([])
  const [countSuccess, setCountSuccess] = useState<number>(0)
  const [countFailed, setCountFailed] = useState<number>(0)

  useEffect(() => {
    setFile(null)
    setIsUploaded(false)
    setResponseUpload([])
    setCountSuccess(0)
    setCountFailed(0)
  }, [isOpen])

  const uploadFile = async () => {
    const token = Cookies.get('token')
    const noid = Cookies.get('noid')
    const appid = Cookies.get('appid')
    const username = Cookies.get('username')
    const formData = new FormData();

    if (file) {
      formData.append('fileXls', file);
    }

    formData.append('request', JSON.stringify({
      token,
      noid,
      appid,
      username,
      versi: 'V2',
      detail: {
        id_group: idGroup
      }
    }))

    try {
      const response = await api.post('/UPLOADXLS/uploadXls/upload/kolektif_detail/WEB', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if(response.data.response_code === '0000') {
        toast.success(response.data.response_message)
      } else {
        toast.error(response.data.response_message)
      }

      if(response.data.data){
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const counts = response.data.data.reduce((acc: any, item: ResponseUpload) => {
          acc[item.response_code] = (acc[item.response_code] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        setCountSuccess(counts["0000"] || 0)
        setCountFailed(counts["9001"] || 0)
        setResponseUpload(response.data.data)
      }

      setIsUploaded(true)
      onProcessed()

    } catch (error) {
      const err = error as AxiosError
      if(err.status && err.status >= 500) {
        toast.error('Terjadi kesalahan sistem')
      }
    }
  }

  const onHandleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  }

  const onHandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    uploadFile()
  }

  return (
    <>
      <Modal isOpen={isOpen} placement="top-center" onClose={onClose}>
        <ModalContent>
          <form onSubmit={(event) => onHandleSubmit(event)}>
            <ModalHeader>Upload File Excel Data Pelanggan</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div className="flex justify-end gap-2">
                  <Chip color="success" classNames={{ content: ["font-semibold text-white"] }} >Sukses: {countSuccess}</Chip>
                  <Chip color="danger" classNames={{ content: ["font-semibold text-white"] }}>Gagal: {countFailed}</Chip>
                </div>
                <div>
                  <span className="font-medium text-gray-600 text-sm">Keterangan Upload</span>
                  <div className="border border-gray-500 rounded-lg flex flex-col gap-2 overflow-y-scroll h-32 p-2">
                    {
                      responseUpload.map((item) => (
                        <div key={item.response_code}>
                          <span className="text-gray-600 text-sm">{item.response_message}</span>
                          <Divider />
                        </div>
                      ))
                    }
                  </div>
                </div>
                <Input 
                  name="fileXls"
                  label="File Excel"
                  type="file"
                  onChange={onHandleFileChange}
                  isRequired
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="default" onPress={onClose} startContent={<XMarkIcon className="size-5"/>}>Tutup</Button>
              {
                !isUploaded ? (
                  <Button color="primary" type="submit" startContent={<CheckIcon className="size-5" />}>Proses</Button>
                ) : null
              }
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UploadFile