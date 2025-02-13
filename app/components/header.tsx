"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from 'next/link';
import ChangePassword from "./change-password";
import AppInfo from "./app-info";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, Badge, Popover, PopoverTrigger, PopoverContent, Button, Divider, useDisclosure } from "@heroui/react";
import { ChevronDownIcon, WalletIcon } from "@heroicons/react/16/solid";
import { BellIcon, Cog6ToothIcon, PrinterIcon, ShieldCheckIcon, ComputerDesktopIcon, DocumentCheckIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import Cookies from 'js-cookie'
import api from "@/lib/axios";
import { NotificationResponse } from "@/types";
import { formatThousands } from "@/utils/formatter";

const Header = () => {
  const {isOpen: isOpenPassword, onOpen: onOpenPassword, onOpenChange: onOpenChangePassword, onClose: onClosePassword} = useDisclosure();
  const {isOpen: isOpenApp, onOpen: onOpenApp, onOpenChange: onOpenChangeApp} = useDisclosure();
  const [notifMessage, setNotifMessage] = useState<NotificationResponse>({} as NotificationResponse)
  const [totalMessage, setTotalMessage] = useState<string>("0")
  const [saldo, setSaldo] = useState<string>("0")
  const [name, setName] = useState<string>("")
  const pathname = usePathname()
  const router = useRouter()

  const fetchHeader = async () => {
    const pages = {
      page: 1,
      perPage: 10
    }

    const notifResponse = await api.post('/REQUEST/act/REPORT_PAGING/rpaging_log_notification/WEB', { pages })
    const saldoResponse = await api.post('/REQUEST/act/PROCESS/menu_cek_saldo/WEB', { versi: 'V1' })
    const totalMsgResponse = await api.post('/REQUEST/act/PROCESS/service_cek_new_message/WEB', { pages })
    setNotifMessage(notifResponse.data)
    setSaldo(saldoResponse.data.saldo)
    setTotalMessage(totalMsgResponse.data.totalPesan)
  }

  const fetchReadMessage = async () => {
    await api.post('REQUEST/act/PROCESS/menu_tandai_message_dibaca/WEB')
    fetchHeader()
  }

  useEffect(() => {
    setName(Cookies.get('nama') || "")
    fetchHeader()
  }, [])

  

  const onHandleDownloadCert = async () => {
    const noid = Cookies.get('noid')
    const response = await api.post('https://api.billerpay.id/sertifikat/index.php?noid='+noid, {}, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SERTIFIKAT ${name}`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const onHandleLogout = () => {
    Cookies.remove('token')
    Cookies.remove('appid')
    Cookies.remove('noid')
    Cookies.remove('username')
    Cookies.remove('nama')
    router.push('/login')
  }

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
            Rp. { formatThousands(saldo) }
          </div>
          <WalletIcon className="size-6 text-primary" />
        </div>
        <Popover placement="bottom" showArrow={true}>
          <PopoverTrigger>
            <div className="flex items-center cursor-pointer">
              <Badge color="danger" content={totalMessage} shape="circle" size="md">
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
              <div className="overflow-y-auto h-[270px]">
                {
                  notifMessage.data?.map((notif, index) => (
                    <div className={`p-4 pb-0 last:pb-2 ${notif.stat === '0' ? 'bg-primary-100': ''}`} key={notif.id}>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2 text-gray-600">
                          <div className="text-xs">{notif.time.split(' ')[0]}</div>
                          <div className="text-xs">{notif.time.split(' ')[1]}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-600">{notif.tittle}</div>
                          <div className="text-xs text-gray-700">{notif.message}</div>
                        </div>
                      </div>
                      <Divider className={`${notifMessage.data.length === (index+1) ? 'hidden' : ''}`}/>
                    </div>
                  ))
                }
              </div>
              <div className="flex items-center gap-2 p-4">
                <Button size="sm" onPress={fetchReadMessage}>Tandai Semua Dibaca</Button>
                <Button size="sm" color="primary" onPress={() => router.push('/notification')}>Lihat Selengkapnya</Button>
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
            <DropdownItem key="sertifikat" startContent={<DocumentCheckIcon className="size-5" />} onPress={onHandleDownloadCert}>Download Sertifikat</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Dropdown>
          <DropdownTrigger>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar size="sm" showFallback src="https://images.unsplash.com/broken" />
              <div className="font-semibold">{ name }</div>
            </div>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem onPress={onHandleLogout} key="logout" startContent={<ArrowLeftStartOnRectangleIcon className="size-5" />}>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <ChangePassword isOpen={isOpenPassword} onOpenChange={onOpenChangePassword} onClose={onClosePassword} />
      <AppInfo isOpen={isOpenApp} onOpenChange={onOpenChangeApp} />
    </header>
  );
}

export default Header;
