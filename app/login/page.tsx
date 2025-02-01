"use client";

import React from "react";
import { Button, Input } from "@heroui/react";
import Image from 'next/image'
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const LoginPage = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

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
          <form className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <Input
                  label="Email"
                  placeholder="Enter Email address"
                  type="email"
                  autoComplete="email"
                  size="md"
                  variant="flat"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <Input
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
                  placeholder="Enter your password"
                  size="md"
                  variant="flat"
                  autoComplete="current-password"
                  required
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
          <div className="w-full text-center">
            <label className="">
              Butuh bantuan? Hubungi CS  <a href="https://wa.me/6281333301320" target="_blank"><strong className="font-bold text-primary-600">0813-3330-1320</strong></a> 
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
