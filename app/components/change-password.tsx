"use client";

import { useEffect, useState } from "react";
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
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface ChangePasswordProps {
  isOpen: boolean;
  onOpenChange: () => void
  onClose: () => void
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ isOpen, onOpenChange, onClose }) => {
  const [isVisiblePasswordOld, setIsVisiblePasswordOld] = useState(false);
  const toggleVisibilityPasswordOld = () => setIsVisiblePasswordOld(!isVisiblePasswordOld);
  const [isVisiblePasswordNew, setIsVisiblePasswordNew] = useState(false);
  const toggleVisibilityPasswordNew = () => setIsVisiblePasswordNew(!isVisiblePasswordNew);
  const [isVisiblePasswordConfirm, setIsVisiblePasswordConfirm] = useState(false);
  const toggleVisibilityPasswordConfirm = () => setIsVisiblePasswordConfirm(!isVisiblePasswordConfirm);
  const [passwordOld, setPasswordOld] = useState<string>("")
  const [passwordNew, setPasswordNew] = useState<string>("")
  const [passwordConfirm, setPasswordConfirm] = useState<string>("")

  useEffect(() => {
    setPasswordOld("")
    setPasswordNew("")
    setPasswordConfirm("")
  }, [isOpen])

  const onHandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = Object.fromEntries(new FormData(event.currentTarget));
    const detail = {
      ...formData
    }
    
    try {
      const response = await api.post('/REQUEST/act/PROCESS/menu_ganti_password/WEB', { detail, versi: 'V1' })

      if(response.data.response_code === '0000') {
        toast.success(response.data.response_message)
      } else {
        toast.error(response.data.response_message)
      }

      onClose()
    } catch (error) {
      const err = error as AxiosError
      if(err.status && err.status >= 500) {
        toast.error('Terjadi kesalahan sistem')
      }
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
        {(onClose) => (
          <form onSubmit={onHandleSubmit}>
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
                  name="old_password"
                  value={passwordOld}
                  onValueChange={setPasswordOld}
                  isRequired
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
                  name="new_password1"
                  value={passwordNew}
                  onValueChange={setPasswordNew}
                  isRequired
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
                  name="new_password2"
                  value={passwordConfirm}
                  onValueChange={setPasswordConfirm}
                  isRequired
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="default" onPress={onClose} startContent={<XMarkIcon className="size-5"/>}>Batal</Button>
              <Button type="submit" color="primary" startContent={<CheckIcon className="size-5" />}>Simpan</Button>
            </ModalFooter>
          </form>
        )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChangePassword;
