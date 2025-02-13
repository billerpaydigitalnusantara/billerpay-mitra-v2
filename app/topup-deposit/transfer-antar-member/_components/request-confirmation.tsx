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

interface RequestConfirmationProps {
  isOpen: boolean
  onOpenChange: () => void
  nominal: string
  receiver: string
  nama: string
  onProcess: () => void
}

const RequestConfirmation: React.FC<RequestConfirmationProps> = ({ isOpen, onOpenChange, nominal, receiver, nama, onProcess }) => {
  return (
    <>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Proses Transfer</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <span>Periksa Kembali Detail Tujuan Transfer</span>
                <div className="font-medium text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-36">Tujuan Transfer</span>
                    <span> : </span>
                    <span>{receiver}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-36">Nama Pengguna</span>
                    <span> : </span>
                    <span>{nama}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-36">Nominal</span>
                    <span> : </span>
                    <span>{formatToCurrency(nominal)}</span>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="default" onPress={onClose} startContent={<XMarkIcon className="size-5"/>}>Batal</Button>
              <Button color="primary" onPress={onProcess} startContent={<CheckIcon className="size-5" />}>Proses</Button>
            </ModalFooter>
          </>
        )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default RequestConfirmation;