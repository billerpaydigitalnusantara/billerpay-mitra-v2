"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import api from "@/lib/axios";
import { NotificationResponse } from "@/types";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Button, Divider, Pagination, Select, SelectItem, SharedSelection } from "@heroui/react";
import { useEffect, useState } from "react";

const data = Array.from({ length: 20 }, (_, index) => ({
  id: `id-${index}`,
  time: `2025-02-13 21:47:31`,
  tittle: `TOPUP Saldo ${index + 1}`,
  message: `Mitra Billerpay, TOPUP SALDO Rp. 10.745 BERHASIL. Saldo Tersedia Rp. 125.761`,
  stat: "1"
}));

const Notification = () => {
  const [page, setPage] = useState<number>(1)
  const [perPage, setPerPage] = useState<string>("20")
  const [totalPage, setTotalPage] = useState<number>(1)
  const [dataNotification, setDataNotification] = useState<NotificationResponse>({} as NotificationResponse)

  const fetchNotification = async () => {
    const pages = {
      page: page,
      perPage: parseInt(perPage)
    }

    const response = await api.post('REQUEST/act/REPORT_PAGING/rpaging_log_notification/WEB', { pages })
    const data: NotificationResponse = response.data
    setTotalPage(Math.ceil(parseInt(data.totalData || "0") / parseInt(perPage)))
    setDataNotification(data)
  }

  const fetchReadMessage = async () => {
    await api.post('REQUEST/act/PROCESS/menu_tandai_message_dibaca/WEB')
    fetchNotification()
  }

  useEffect(() => {
    fetchNotification()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage])

  useEffect(() => {
    setPage(1)
  }, [perPage])

  const onHanleSelectPerPage = (keys: SharedSelection) => {
    if (keys.currentKey) {
      setPerPage(keys.currentKey);
    }
  }
  
  return(
    <div className="bg-gray-100 w-full min-h-screen grid grid-cols-1 gap-4">
      <Header />
      <div className="flex items-center justify-center col-span-2">
        <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] w-[1024px] p-4">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-xl font-semibold">Pemberitahuan</h1>
            <Button onPress={fetchReadMessage} color="default" startContent={<CheckIcon className="size-5" />}>Tandai Semua pesan</Button>
          </div>
          <Divider />
          <div className="overflow-y-scroll h-[calc(100vh-19rem)]">
            {
              dataNotification.data?.map((item, index) => (
                <div className={`p-4 pb-0 last:pb-2 ${item.stat === '0' ? 'bg-primary-100': ''}`} key={item.id}>
                  <div className="mb-4"> 
                    <div className="flex items-center justify-between mb-2 text-gray-600">
                      <div className="text-sm">{item.time.split(' ')[0]}</div>
                      <div className="text-sm">{item.time.split(' ')[1]}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-gray-600">{item.tittle}</div>
                      <div className="text-gray-700">{item.message}</div>
                    </div>
                  </div>
                  <Divider className={`${data.length === (index+1) ? 'hidden' : ''}`}/>
                </div>
              ))
            }
          </div>
          <div className="flex justify-between items-center sticky bottom-0 bg-white pt-2">
            <Select className="w-24" variant="bordered" selectedKeys={[perPage]} onSelectionChange={onHanleSelectPerPage}>
              <SelectItem key="20">20</SelectItem>
              <SelectItem key="50">50</SelectItem>
              <SelectItem key="100">100</SelectItem>
              <SelectItem key="250">250</SelectItem>
              <SelectItem key="500">500</SelectItem>
              <SelectItem key="1000">1000</SelectItem>
            </Select>
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              initialPage={1}
              total={totalPage}
              onChange={setPage}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Notification