import { atom } from 'jotai'

export interface DataTransaksi {
  no: string
  product: string
  idpel: string
  idpel_name: string
  tagihan: string
  admin_bank: string
  total_tagihan: string
  traceId: string
  reff: string
  detail: string
  status: string
  responseMessage: string
}

export const dataTransaksiAtom = atom<DataTransaksi[]>([] as DataTransaksi[])
export const selectedTrx = atom<Set<string> | string>("all")