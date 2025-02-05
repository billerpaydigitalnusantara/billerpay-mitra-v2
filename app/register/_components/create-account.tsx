"use client";

import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "@heroui/react";
import { useState } from "react";

interface CreateAccountProps {
  onCreateAccount: (password: string) => void
}

const CreateAccount = ({ onCreateAccount }: CreateAccountProps) => {
  const [isVisiblePasswordNew, setIsVisiblePasswordNew] = useState(false);
  const toggleVisibilityPasswordNew = () => setIsVisiblePasswordNew(!isVisiblePasswordNew);
  const [isVisiblePasswordConfirm, setIsVisiblePasswordConfirm] = useState(false);
  const toggleVisibilityPasswordConfirm = () => setIsVisiblePasswordConfirm(!isVisiblePasswordConfirm);
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('') 

  const onHandleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onCreateAccount(passwordConfirmation)
  }

  return (
    <div className="w-full max-w-md p-8 space-y-8 rounded-lg bg-white shadow-lg">
      <h2 className="text-2xl font-bold text-center">Buat Password</h2>
      <form className="mt-8 space-y-6" onSubmit={onHandleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="kode-agen" className="sr-only">
              Buat Password
            </label>
            <Input
              endContent={
                <button
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
              placeholder="Password" 
              isRequired
              onValueChange={setPassword}
            />
          </div>
          <div>
            <label htmlFor="kode-agen" className="sr-only">
              Konfirmasi Password
            </label>
            <Input 
              endContent={
                <button
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
              placeholder="Konfirmasi Password"
              isRequired
              onValueChange={setPasswordConfirmation}
              validate={(value) => {
                if (value !== password) {
                  return "Password konfirmasi tidak sama dengan password";
                }
      
                return null
              }}
            />
          </div>
        </div>
        <div>
          <Button
            type="submit"
            className="w-full" 
            color="primary"
          >
            Buat Akun
          </Button>
        </div>
      </form>
    </div>
  )
};

export default CreateAccount;
