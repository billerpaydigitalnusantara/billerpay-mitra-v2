"use client"

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

interface ModalInfoProps {
  title: string,
  message: string,
  onCancel: () => void,
  isOpen: boolean,
  onClose: () => void
}

const ModalInfo: React.FC<ModalInfoProps> = ({ title, message, onCancel, isOpen, onClose }) => {
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
            Tutup
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalInfo;