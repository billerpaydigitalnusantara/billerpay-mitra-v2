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

interface AppInfoProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

const AppInfo: React.FC<AppInfoProps> = ({ isOpen, onOpenChange }) =>  {

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
                  <p className="text-sm text-gray-600">1.0.0</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-600">Server Info</h4>
                  <div className="grid grid-cols-[1fr,1fr,3fr] gap-2">
                    <div className="text-sm text-gray-600 flex items-center">Transaksi</div>
                    <div> : </div>
                    <div className="text-sm text-gray-600 font-medium">api-report</div>
                  </div>
                  <div className="grid grid-cols-[1fr,1fr,3fr] gap-2">
                    <div className="text-sm text-gray-600 flex items-center">Kolektif</div>
                    <div> : </div>
                    <div className="text-sm text-gray-600 font-medium">api-report</div>
                  </div>
                  <div className="grid grid-cols-[1fr,1fr,3fr] gap-2">
                    <div className="text-sm text-gray-600 flex items-center">Laporan</div>
                    <div> : </div>
                    <div className="text-sm text-gray-600 font-medium">api-report</div>
                  </div>
                  <div className="grid grid-cols-[1fr,1fr,3fr] gap-2">
                    <div className="text-sm text-gray-600 flex items-center">Excel</div>
                    <div> : </div>
                    <div className="text-sm text-gray-600 font-medium">api-report</div>
                  </div>
                </div>
                <Button color="primary" startContent={<ArrowPathIcon className="size-5"/>} >Reload Server</Button>
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
