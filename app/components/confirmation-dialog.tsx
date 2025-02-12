"use client"

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

interface ConfirmationDialogProps {
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel: () => void,
  isOpen: boolean,
  onClose: () => void
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ title, message, onConfirm, onCancel, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} placement="top-center" onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          {title}
        </ModalHeader>
        <ModalBody>
          {message}
        </ModalBody>
        <ModalFooter>
          <Button color="default" onPress={onCancel}>
            Batal
          </Button>
          <Button color="danger" onPress={onConfirm}>
            Yakin
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationDialog;