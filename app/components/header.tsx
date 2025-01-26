"use client";

import React from "react";
import Image from "next/image";
import Link from 'next/link';
import ChangePassword from "./change-password";
import AppInfo from "./app-info";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, Badge, Popover, PopoverTrigger, PopoverContent, Button, Divider, useDisclosure } from "@nextui-org/react";
import { ChevronDownIcon, WalletIcon } from "@heroicons/react/16/solid";
import { BellIcon, Cog6ToothIcon, PrinterIcon, ShieldCheckIcon, ComputerDesktopIcon, DocumentCheckIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

const Header = () => {
  const {isOpen: isOpenPassword, onOpen: onOpenPassword, onOpenChange: onOpenChangePassword} = useDisclosure();
  const {isOpen: isOpenApp, onOpen: onOpenApp, onOpenChange: onOpenChangeApp} = useDisclosure();
  const pathname = usePathname()

  const handleClick = async () => {
    const response = await fetch('https://api.billerpay.id/sertifikat/index.php?noid=123456');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sertifikat.png';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <header className="bg-white w-full h-16 shadow-lg flex justify-between items-center px-4 md:px-24 col-span-2">
      <div className="flex items-center gap-12">
        <Link href="/">
          <Image 
            src="/images/logo_billerpay.png"
            width={120}
            height={44}
            alt="Logo Billerpay"
          />
        </Link>
        <div>
          <ul className="flex items-center gap-4">
            <li><Link href="/" className={`text-sm px-4 font-medium ${pathname === '/' ? 'bg-primary-100 rounded-full text-primary py-2': 'text-gray-600'}`}>Transaksi</Link></li>
            <li>
              <Dropdown>
                <DropdownTrigger>
                  <div className={`flex items-center gap-2 py-2 pl-4 pr-2 cursor-pointer ${pathname.includes('/topup-deposit') ? 'text-primary bg-primary-100 rounded-full' : 'text-gray-600'} `}>
                    <div className="text-sm font-medium">Topup Deposit</div>
                    <ChevronDownIcon className="size-6" />
                  </div>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="rtd" className={`${pathname.includes('/request-tiket-deposit') ? 'text-primary' : 'text-gray-600'}`} href="/topup-deposit/request-tiket-deposit">Request Ticket Deposit</DropdownItem>
                  <DropdownItem key="tam" className={`${pathname.includes('/transfer-antar-member') ? 'text-primary' : 'text-gray-600'}`} href="/topup-deposit/transfer-antar-member">Transfer Antar Member</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </li>
            <li>
              <Dropdown>
                <DropdownTrigger>
                  <div className={`flex items-center gap-2 py-2 pl-4 pr-2 cursor-pointer ${pathname.includes('/kolektif') ? 'text-primary bg-primary-100 rounded-full' : 'text-gray-600'}`}>
                    <div className="text-sm font-medium">Kolektif</div>
                    <ChevronDownIcon className="size-6" />
                  </div>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="mk" className={`${pathname.includes('/master') ? 'text-primary' : 'text-gray-600'}`} href="/kolektif/master">Master Kolektif</DropdownItem>
                  <DropdownItem key="pk" className={`${pathname.includes('/proses') ? 'text-primary' : 'text-gray-600'}`} href="/kolektif/proses">Proses Kolektif</DropdownItem>
                  <DropdownItem key="rk" className={`${pathname.includes('/reprint') ? 'text-primary' : 'text-gray-600'}`} href="/kolektif/reprint">Reprint Kolektif</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </li>
            <li>
              <Dropdown>
                <DropdownTrigger>
                  <div className={`flex items-center gap-2 py-2 pl-4 pr-2 cursor-pointer ${pathname.includes('/laporan') ? 'text-primary bg-primary-100 rounded-full' : 'text-gray-600'}`}>
                    <div className="text-sm font-medium">Laporan</div>
                    <ChevronDownIcon className="size-6" />
                  </div>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="dt" className={`${pathname.includes('/data-transaksi') ? 'text-primary' : 'text-gray-600'}`} href="/laporan/data-transaksi">Data Transaksi</DropdownItem>
                  <DropdownItem key="ms" className={`${pathname.includes('/mutasi-saldo') ? 'text-primary' : 'text-gray-600'}`} href="/laporan/mutasi-saldo">Mutasi Saldo</DropdownItem>
                  <DropdownItem key="rtf" className={`${pathname.includes('/transaksi-fee') ? 'text-primary' : 'text-gray-600'}`} href="/laporan/transaksi-fee">Reporting Transaksi & Fee</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="font-semibold text-primary">
            Rp. 58.984
          </div>
          <WalletIcon className="size-6 text-primary" />
        </div>
        <Popover placement="bottom" showArrow={true}>
          <PopoverTrigger>
            <div className="flex items-center cursor-pointer">
              <Badge color="danger" content="99" shape="circle" size="sm">
                  <BellIcon className="size-6 text-gray-600" />
              </Badge>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div className="h-96 w-80">
              <div className="p-4 font-semibold">
                Pemberitahuan
              </div>
              <Divider/>
              <div className="p-4 overflow-y-auto h-[270px]">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2 text-gray-600">
                    <div className="text-xs">14 Jan 2025</div>
                    <div className="text-xs">10.00</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-600">Informasi Tagihan !!</div>
                    <div className="text-xs text-gray-700">Mitra Billerpay, Demi kelancaran transaksi segera stor tagihan sebelum jam 12.00 WIB</div>
                  </div>
                </div>
                <Divider className="my-4"/>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2 text-gray-600">
                    <div className="text-xs">14 Jan 2025</div>
                    <div className="text-xs">10.00</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-600">Informasi Tagihan !!</div>
                    <div className="text-xs text-gray-700">Mitra Billerpay, Demi kelancaran transaksi segera stor tagihan sebelum jam 12.00 WIB</div>
                  </div>
                </div>
                <Divider className="my-4"/>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2 text-gray-600">
                    <div className="text-xs">14 Jan 2025</div>
                    <div className="text-xs">10.00</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-600">Informasi Tagihan !!</div>
                    <div className="text-xs text-gray-700">Mitra Billerpay, Demi kelancaran transaksi segera stor tagihan sebelum jam 12.00 WIB</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4">
                <Button size="sm">Tandai Semua Dibaca</Button>
                <Button size="sm" color="primary">Lihat Selengkapnya</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Dropdown>
          <DropdownTrigger>
            <Cog6ToothIcon className="size-6 text-gray-600 cursor-pointer" />
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="printer" startContent={<PrinterIcon className="size-5"/>} href="/printer">Printer</DropdownItem>
            <DropdownItem key="ubah-password" startContent={<ShieldCheckIcon className="size-5" />} onPress={onOpenPassword}>Ubah Password</DropdownItem>
            <DropdownItem key="informasi" startContent={<ComputerDesktopIcon className="size-5" />} onPress={onOpenApp}>Informasi Aplikasi</DropdownItem>
            <DropdownItem key="sertifikat" startContent={<DocumentCheckIcon className="size-5" />} onPress={handleClick}>Download Sertifikat</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Dropdown>
          <DropdownTrigger>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar size="sm" src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
              <div className="font-semibold">HAMZAH NURSAUFA</div>
            </div>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="logout" startContent={<ArrowLeftStartOnRectangleIcon className="size-5" />}>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <ChangePassword isOpen={isOpenPassword} onOpenChange={onOpenChangePassword} />
      <AppInfo isOpen={isOpenApp} onOpenChange={onOpenChangeApp} />
    </header>
  );
}

export default Header;
