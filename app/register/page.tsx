"use client";

import RowSteps from "./_components/row-steps";
import Verifikasi from "./_components/verifikasi";
import Validasi from "./_components/validasi";
import Aktivasi from "./_components/aktivasi";
import React, { useState } from "react";
import DataDiri from "./_components/data-diri";
import CreateAccount from "./_components/create-account";
import { DataDetailRegistration, DataRegistration } from "@/types";
import Image from "next/image";
import Link from 'next/link';
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const RegisterPage = () => {
  const [step, setStep] = useState(0);
  const [dataRegistration, setDataRegistration] = useState<DataRegistration>({} as DataRegistration)
  const [agentCode, setAgentCode] = useState<string>("")
  const route = useRouter()

  const onHandleVerification = (nohp_email: string) => {
    setDataRegistration({
      nohp_email
    })
    setStep(1)
  }

  const onHandleValidation = (kode_agen: string) => {
    setAgentCode(kode_agen)
    setStep(2)
  }

  const onHandleActivation = (token_aktivasi: string) => {
    setDataRegistration(data => ({
      ...data,
      token_aktivasi
    }))
    setStep(3)
  }

  const onHandlePersonalData = (detail: DataDetailRegistration) => {
    setDataRegistration(data => ({
      ...data,
      detail
    }))
    setStep(4)
  }

  const onHandleCreateAccount = async (password: string) => {
    const detail: DataDetailRegistration | undefined = dataRegistration.detail;

    if(detail){
      detail.password = password
      detail.appid = ""
    }

    setDataRegistration(data => ({
      ...data,
      detail,
      versi: "V2"
    }))

    try {
      const response = await api.post('/REQUEST_OPEN/act/PROCESS_OPEN/validasi_update/MOBILE', dataRegistration)
      if(response.data.response_code === '0000') {
        toast(response.data.response_message);
        route.push('/login')
      } else {
        toast(response.data.response_message)
      }
    } catch (error) {
      const err = error as AxiosError
      if(err.status && err.status >= 500) {
        toast.error('Terjadi kesalahan sistem')
      }
    }
  } 
  

  return(
    <div className="bg-primary-50 flex flex-col min-h-screen items-center justify-start">
      <div className="h-20 w-full px-4 md:px-24 flex items-center justify-between">
        <Link href="/">
            <Image 
              src="/images/logo_billerpay.png"
              width={150}
              height={0}
              alt="Logo Billerpay"
            />
          </Link>
          <div className="text-right w-72">
            <div className="text-sm font-medium text-gray-600 w-full">Sudah punya akun?</div>
            <Link href="/login" className="text-sm font-medium text-blue-500 w-full">Login disini</Link>
          </div>
      </div>
      <div className="mb-3">
        <RowSteps
          defaultStep={0}
          currentStep={step}
          onStepChange={(step) => setStep(step)}
          steps={[
            {
              title: "Verifikasi",
            },
            {
              title: "Validasi",
            },
            {
              title: "Aktivasi",
            },
            {
              title: "Data Diri",
            },
            {
              title: "Buat Akun",
            },
          ]}
        />
      </div>
      <div className="flex items-start justify-center w-full mb-6 mt-3">
        {
          step === 0 ? (
            <Verifikasi onVerification={onHandleVerification}/>
          ) : (step === 1) ? (
            <Validasi nohp={dataRegistration.nohp_email} onValidation={onHandleValidation}/>
          ) : (step === 2) ? (
            <Aktivasi 
              dataActivation={{
                nohp_email: dataRegistration.nohp_email,
                kode_agen: agentCode
              }} 
              onActivation={onHandleActivation}/>
          ) : (step === 3) ? (
            <DataDiri onPersonalData={onHandlePersonalData}/>
          ) : (step === 4) ? (
            <CreateAccount onCreateAccount={onHandleCreateAccount} />
          ) : null
        }
      </div>
    </div>
  );
}

export default RegisterPage;
