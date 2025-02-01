"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

interface ChangePasswordProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ isOpen, onOpenChange }) => {
  const [isVisiblePasswordOld, setIsVisiblePasswordOld] = useState(false);
  const toggleVisibilityPasswordOld = () => setIsVisiblePasswordOld(!isVisiblePasswordOld);
  const [isVisiblePasswordNew, setIsVisiblePasswordNew] = useState(false);
  const toggleVisibilityPasswordNew = () => setIsVisiblePasswordNew(!isVisiblePasswordNew);
  const [isVisiblePasswordConfirm, setIsVisiblePasswordConfirm] = useState(false);
  const toggleVisibilityPasswordConfirm = () => setIsVisiblePasswordConfirm(!isVisiblePasswordConfirm);

  return (
    <>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Ubah Password</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibilityPasswordOld}
                    >
                      {isVisiblePasswordOld ? (
                        <EyeSlashIcon className="size-5 text-default-400" />
                      ) : (
                        <EyeIcon className="size-5 text-default-400" />
                      )}
                    </button>
                  } 
                  type={isVisiblePasswordOld ? "text" : "password"}
                  placeholder="Password Lama" 
                />
                <Input
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibilityPasswordNew}
                    >
                      {isVisiblePasswordNew ? (
                        <EyeSlashIcon className="size-5 text-default-400" />
                      ) : (
                        <EyeIcon className="size-5 text-default-400" />
                      )}
                    </button>
                  } 
                  type={isVisiblePasswordNew ? "text" : "password"}
                  placeholder="Password Baru" 
                />
                <Input 
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibilityPasswordConfirm}
                    >
                      {isVisiblePasswordConfirm ? (
                        <EyeSlashIcon className="size-5 text-default-400" />
                      ) : (
                        <EyeIcon className="size-5 text-default-400" />
                      )}
                    </button>
                  }
                  type={isVisiblePasswordConfirm ? "text" : "password"}
                  placeholder="Konfirmasi Password Baru" 
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="default" onPress={onClose} startContent={<XMarkIcon className="size-5"/>}>Batal</Button>
              <Button color="primary" onPress={onClose} startContent={<CheckIcon className="size-5" />}>Simpan</Button>
            </ModalFooter>
          </>
        )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChangePassword;
