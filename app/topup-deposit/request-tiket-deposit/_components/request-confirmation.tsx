"use client";

import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { formatToCurrency } from "@/utils/formatter"
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useState } from "react";

interface RequestConfirmationProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onProcessed: () => void
  nominal: string;
  bank: string;
}

const RequestConfirmation: React.FC<RequestConfirmationProps> = ({ isOpen, onOpenChange, nominal, bank, onProcessed }) => { 
  const [isProcessed, setIsProcessed] = useState<boolean>(false)
  const [responseMessage, setResponseMessage] = useState<string>("")

  const onHandleProcess = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const detail = {
      tujuan: bank,
      nominal,
    }

    try {
      const response = await api.post('/REQUEST/act/LOG/log_konfirmasi_tiket_add/WEB', { detail, versi: 'V1' })
      setResponseMessage(response.data.response_message)
      setIsProcessed(true)
    } catch (error) {
      const err = error as AxiosError
      if(err.status && err.status >= 500) {
        toast.error('Terjadi kesalahan sistem')
      }
    }

    onProcessed()
  }

  return (
    <>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
        {(onClose) => (
          <form onSubmit={onHandleProcess}>
            <ModalHeader>Konfirmasi Request</ModalHeader>
            <ModalBody>
              {
                isProcessed ? (
                  <span dangerouslySetInnerHTML={{__html: responseMessage}}></span>
                ) : (
                  <span>Anda yakin ingin melakukan Request Tiket Deposit sebesar {formatToCurrency(nominal)} melalui bank {bank}</span>
                )
              }
            </ModalBody>
            <ModalFooter>
              <Button color="default" onPress={onClose} startContent={<XMarkIcon className="size-5"/>}>Batal</Button>
              {
                !isProcessed ? (
                  <Button color="primary" type="submit" startContent={<CheckIcon className="size-5" />}>Proses</Button>
                ) : null
              }
            </ModalFooter>
          </form>
        )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default RequestConfirmation;