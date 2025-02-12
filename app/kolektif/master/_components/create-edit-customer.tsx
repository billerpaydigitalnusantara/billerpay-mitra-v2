"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input
} from "@heroui/react";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { NumericFormat } from "react-number-format";

interface CreateEditCustomerProps {
  data: {
    id: string,
    id_group: string,
    idpel: string
  }
  type: string
  isOpen: boolean;
  onClose: () => void;
  onProcessed: () => void
}

const CreateEditCustomer: React.FC<CreateEditCustomerProps> = ({ data, type, isOpen, onClose, onProcessed }) => {
  const [id, setId] = useState("")
  const [idGroup, setIdGroup ] = useState("")
  const [idPel, setIdPel] = useState("")

  useEffect(() => {
    if(type === 'update') {
      setId(data.id)
      setIdGroup(data.id_group)
      setIdPel(data.idpel)
    } else if(type === 'create') {
      setIdPel("")
      setIdGroup(data.id_group)
    }
  }, [data, type, isOpen])
  
  const createMaster = async (detail: { idpel: string, id_group: string }) => {
    try {
      const response = await api.post('/REQUEST/act/TABLE/tbl_group_kolektifdetail_add/WEB', { detail, versi: 'V1' })

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

  const updateMaster = async (detail: { idpel_new: string, id_group: string, id: string}) => {
    try {
      const response = await api.post('/REQUEST/act/TABLE/tbl_group_kolektifdetail_edit/WEB', { detail, versi: 'V1' })

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
    const dataCreate: { id_group: string, idpel: string } = {
      idpel: formData.idpel as string,
      id_group: idGroup
    };

    const dataUpdate: { id_group: string, id: string, idpel_new: string } = {
      id,
      id_group: idGroup,
      idpel_new: idPel   
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
            <ModalHeader>Tambah Data Pelanggan</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-6">
                <NumericFormat
                  name="idpel"
                  label="ID Pelanggan"
                  type="text"
                  value={idPel}
                  onValueChange={(values) => setIdPel(values.value)}
                  isRequired
                  customInput={Input}
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

export default CreateEditCustomer;
