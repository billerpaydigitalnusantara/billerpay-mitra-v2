"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { AppInfoResponse } from "@/types";

interface AppInfoProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

const AppInfo: React.FC<AppInfoProps> = ({ isOpen, onOpenChange }) =>  {
  const [appInfo, setAppInfo] = useState<AppInfoResponse>({} as AppInfoResponse)

  const fetchAppInfo = async () => {
    const response = await api.get('/KONFIG/URL_REQUEST/MITRA')
    setAppInfo(response.data)
  }

  const onHandleReload = () => {
    fetchAppInfo()
  }

  useEffect(() => {
    fetchAppInfo()
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Informasi Aplikasi</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="font-medium text-gray-600">Versi Aplikasi</h4>
                  <p className="text-sm text-gray-600">{ appInfo.versi }</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-600">Server Info</h4>
                  <div className="grid grid-cols-[1fr,1fr,3fr] gap-2">
                    <div className="text-sm text-gray-600 flex items-center">Transaksi</div>
                    <div> : </div>
                    <div className="text-sm text-gray-600 font-medium">{ appInfo.transaksi }</div>
                  </div>
                  <div className="grid grid-cols-[1fr,1fr,3fr] gap-2">
                    <div className="text-sm text-gray-600 flex items-center">Kolektif</div>
                    <div> : </div>
                    <div className="text-sm text-gray-600 font-medium">{ appInfo.kolektif }</div>
                  </div>
                  <div className="grid grid-cols-[1fr,1fr,3fr] gap-2">
                    <div className="text-sm text-gray-600 flex items-center">Laporan</div>
                    <div> : </div>
                    <div className="text-sm text-gray-600 font-medium">{ appInfo.laporan }</div>
                  </div>
                  <div className="grid grid-cols-[1fr,1fr,3fr] gap-2">
                    <div className="text-sm text-gray-600 flex items-center">Excel</div>
                    <div> : </div>
                    <div className="text-sm text-gray-600 font-medium">{ appInfo.excel }</div>
                  </div>
                </div>
                <Button color="primary" startContent={<ArrowPathIcon className="size-5"/>} onPress={onHandleReload}>Reload Server</Button>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="default" startContent={<XMarkIcon className="size-5"/>} onPress={onClose}>
                Tutup
              </Button>
            </ModalFooter>    
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AppInfo;
