"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Radio,
  RadioGroup,
} from "@heroui/react";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface CreateEditMasterProps {
  data: {
    id: string,
    nama: string,
    alamat: string
  }
  type: string
  isOpen: boolean;
  onClose: () => void;
  onProcessed: () => void
}

const CreateEditMaster: React.FC<CreateEditMasterProps> = ({ data, type, isOpen, onClose, onProcessed }) => {
  const [id, setId] = useState("")
  const [nama, setNama] = useState("")
  const [jenis, setJenis] = useState("PLN")
  const [alamat, setAlamat] = useState("")

  useEffect(() => {
    if(type === 'update') {
      setId(data.id)
      setNama(data.nama)
      setAlamat(data.alamat)
    } else if(type === 'create') {
      setNama("")
      setJenis("PLN")
      setAlamat("")
    }
  }, [data, type, isOpen])
  
  const createMaster = async (detail: { nama: string, jenis: string, alamat: string }) => {
    try {
      const response = await api.post('/REQUEST/act/TABLE/tbl_group_kolektif_add/WEB', { detail, versi: 'V1' })

      if(response.data.response_code === '0000') {
        toast.success(response.data.response_message)
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

  const updateMaster = async (detail: { nama: string, id: string, alamat: string }) => {
    try {
      const response = await api.post('/REQUEST/act/TABLE/tbl_group_kolektif_edit/WEB', { detail, versi: 'V1' })

      if(response.data.response_code === '0000') {
        toast.success(response.data.response_message)
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

  const onHandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = Object.fromEntries(new FormData(event.currentTarget));
    const dataCreate: { nama: string, jenis: string, alamat: string } = {
      nama: formData.nama as string,
      jenis: formData.jenis as string,
      alamat: formData.alamat as string,
    };

    const dataUpdate: { nama: string, id: string, alamat: string } = {
      nama,
      alamat,
      id     
    }

    if(type === 'create') {
      await createMaster(dataCreate)
    } else if(type === 'update') {
      await updateMaster(dataUpdate)
    }

    onProcessed()
    onClose()
  }

  return (
    <>
      <Modal isOpen={isOpen} placement="top-center" onClose={onClose}>
        <ModalContent>
          <form onSubmit={(event) => onHandleSubmit(event)}>
            <ModalHeader>Tambah Master Kolektif</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-6">
                {
                  type === 'create' ? (
                    <RadioGroup name="jenis" value={jenis} onValueChange={setJenis} orientation="horizontal" label="Tipe Kolektif">
                      <Radio value="PLN" >PLN</Radio>
                      <Radio value="TELKOM">TELKOM</Radio>
                      <Radio value="PDAM">PDAM</Radio>
                    </RadioGroup>
                  ) : null
                }
                <Input 
                  name="nama"
                  label="Nama"
                  placeholder="Nama Kolektif"
                  value={nama}
                  onValueChange={setNama}
                  isRequired
                />
                <Input
                  name="alamat"
                  label="Alamat"
                  placeholder="Alamat Kolektif"
                  value={alamat}
                  onValueChange={setAlamat}
                  isRequired
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="default" onPress={onClose} startContent={<XMarkIcon className="size-5"/>}>Batal</Button>
              <Button color="primary" type="submit" startContent={<CheckIcon className="size-5" />}>Proses</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateEditMaster;
