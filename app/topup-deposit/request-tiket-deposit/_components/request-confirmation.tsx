"use client";

import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { formatToCurrency } from "@/utils/formatter"

interface RequestConfirmationProps {
  isOpen: boolean;
  onOpenChange: () => void;
  nominal: string;
  bank: string;
}

const RequestConfirmation: React.FC<RequestConfirmationProps> = ({ isOpen, onOpenChange, nominal, bank }) => { 
  return (
    <>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Konfirmasi Request</ModalHeader>
            <ModalBody>
              <span>Anda yakin ingin melakukan Request Tiket Deposit sebesar {formatToCurrency(nominal)} melalui bank {bank}</span>
            </ModalBody>
            <ModalFooter>
              <Button color="default" onPress={onClose} startContent={<XMarkIcon className="size-5"/>}>Batal</Button>
              <Button color="primary" onPress={onClose} startContent={<CheckIcon className="size-5" />}>Proses</Button>
            </ModalFooter>
          </>
        )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default RequestConfirmation;