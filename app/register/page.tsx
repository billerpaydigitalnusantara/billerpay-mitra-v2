"use client";

import RowSteps from "./_components/row-steps";
import Verifikasi from "./_components/verifikasi";
import Validasi from "./_components/validasi";
import Aktivasi from "./_components/aktivasi";
import React from "react";
import DataDiri from "./_components/data-diri";
import Password from "./_components/password";

const RegisterPage = () => {
  const [step, setStep] = React.useState(0);

  return(
    <div className="bg-primary-50 flex flex-col min-h-screen items-center justify-start">
      <div className="mt-6 mb-3">
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
              title: "Buat Password",
            },
          ]}
        />
      </div>
      <div className="flex items-start justify-center w-full mb-6 mt-3">
        {
          step === 0 ? (
            <Verifikasi />
          ) : (step === 1) ? (
            <Validasi />
          ) : (step === 2) ? (
            <Aktivasi />
          ) : (step === 3) ? (
            <DataDiri />
          ) : (step === 4) ? (
            <Password />
          ) : null
        }
      </div>
    </div>
  );
}

export default RegisterPage;
