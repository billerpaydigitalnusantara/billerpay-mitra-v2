"use client";

import React, { useEffect, useState } from "react";
import { Button, Divider, Input, Link } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import api from "@/lib/axios";
import Cookies from "js-cookie"
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { getCurrentBrowserFingerPrint } from "@rajesh896/broprint.js";

const LoginPage = () => {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [clientInfo, setClientInfo] = useState([])
  const [uniqueID, setUniqueID] = useState<string>("")
  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    async function fetch() {
      const res = await api.get('https://us1.api-bdc.net/data/client-info')
      const uniqueID = await getCurrentBrowserFingerPrint()
      setClientInfo(res.data)
      setUniqueID(uniqueID)
    }
    fetch()
  }, [])


  const onHandleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElements = event.currentTarget.elements as HTMLFormControlsCollection
    const data = {
      tipe: 'LOGIN',
      username: (formElements.namedItem('username') as HTMLInputElement)?.value,
      password: (formElements.namedItem('password') as HTMLInputElement)?.value,
      appid: uniqueID,
      token: '',
      website: 'transaksi',
      detail: clientInfo
    }

    try {
      const response = await api.post('/LOGIN/LOGIN_V2/WEB', data)

      if(response.data.status === 'SUKSESLOGIN') {
        const {token, appid, noid, username, nama } = response.data
        Cookies.set('token', token)
        Cookies.set('noid', noid)
        Cookies.set('appid', appid)
        Cookies.set('username', username)
        Cookies.set('nama', nama)
        router.push('/')
      }

      if(response.data.status === 'GAGAL') {
        toast(response.data.message)
      }
      
    } catch (error) {
      const err = error as AxiosError
      if(err.status && err.status >= 500) {
        toast('Terjadi kesalahan sistem')
      }
    }
  }

  return (
    <div className="h-screen pl-4 pr-4 md:px-32 bg-primary-50">
      <div className="absolute left-[50%] translate-x-[-50%] top-24 lg:top-12 lg:left-48">
        <Image
          src="/images/logo_billerpay.png"
          width={150}
          height={0}
          alt="Download playstore"
        />
      </div>
      <div className="flex h-full items-center justify-center lg:justify-between">
        <div className="w-96 hidden lg:block">
          <h2 className="font-bold text-2xl">Selamat Datang</h2>
          <h2 className="font-bold text-4xl">Mitra Billerpay</h2>
          <p className="mt-12">Nikmati kemudahan transaksi kapanpun dan dimanapun dalam genggaman Anda dengan Transaksi melalui <strong>Mobile App Billerpay</strong></p>
          <p className="mt-12"><strong>Download Billerpay Mobile App</strong></p>
          <a href="https://play.google.com/store/apps/details?id=id.billerpay.app" target="_blank">
            <Image
              src="/images/play_store.png"
              width={120}
              height={0}
              alt="Download playstore"
            />
          </a>
        </div>
        <div className="hidden xl:block">
          <Image 
            src="/images/two_phone_nomargin.png"
            width={350}
            height={0}
            alt="Aplikasi Billerpay"
          />
        </div>
        <div className="w-full max-w-md p-8 space-y-8 rounded-lg bg-white shadow-lg">
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <form className="mt-8 space-y-6" onSubmit={onHandleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <Input
                  id="username"
                  label="Username"
                  placeholder="Masukan Username"
                  autoComplete="username"
                  type="text"
                  size="md"
                  variant="flat"
                  isRequired
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <Input
                  id="password"
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeSlashIcon className="size-5 text-default-400" />
                      ) : (
                        <EyeIcon className="size-5 text-default-400" />
                      )}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                  label="Password"
                  placeholder="Masukan Password"
                  size="md"
                  variant="flat"
                  autoComplete="password"
                  isRequired
                />
              </div>
            </div>
            <div>
              <Button
                type="submit"
                className="w-full" 
                color="primary"
              >
                Sign in
              </Button>
            </div>
          </form>
          <div className="w-full text-center flex flex-col gap-4">
            <label className="text-gray-600 text-sm">
              Butuh bantuan? Hubungi CS  <a href="https://wa.me/6281333301320" target="_blank"><strong className="font-bold text-primary-600">0813-3330-1320</strong></a> 
            </label>
            <Divider />
            <span className="text-sm font-medium text-gray-600">Belum punya akun? <Link href="/register" className="text-sm">Daftar disini</Link></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
