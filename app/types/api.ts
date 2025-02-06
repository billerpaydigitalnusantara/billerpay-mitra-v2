export interface GridProduct {
  category: string
  product: ListProduct[]
}

export interface ListProduct {
  id_product: string
  product: string
  code: string
  icon?: string
  isActive: string
  map_product_detail: string
  list_product_detail?: ListProductDetail[]
  config?: Config
}

export interface ListProductDetail {
  product_detail: string
  icon?: string
  config: Config
}

export interface Config {
  code: string
  layout: Layout[]
  payload_detail: PayloadDetail
}

export interface Layout {
  id: string
  tipe: string
  label?: string
  is_number?: string
  max_length?: number
  min_length?: number
  placeholder?: string
  comma_decimal?: string
  focus?: boolean
  phonebook?: boolean
  event?: EventLayout
  value?: Value
}

export interface EventLayout {
  event: string
  payload: Payload
  endpoint: string
  set_value: string
}

export interface Value {
  metode: string
  payload?: Payload
  endpoint?: string
}

export interface PayloadDetail {
  periode?: string
  admin_bank?: string
  admin_plus?: string
  nominal?: string
}

export interface Payload {
  noid?: string
}

export interface UserInfo {
  status: string
  tipe: string
  noid: string
  jenis: string
  nama: string
  saldo: string
  token: string
  informasi: string
  appid: string
  versi: string
  interface: string
  message: string
  username: string
  merchant: string
  alamat: string
  jenis_member: string
  poin: string
  status_aktivasi: string
  info_aktivasi: string
  hak_saldo: string
  hak_plafon: number
  hak_saldo_upline: string
}

export interface NotificationResponse {
  page: number
  totalData: string
  data: DataNotification[]
}

export interface DataNotification {
  id: string
  time: string
  tittle: string
  message: string
  media: string
  stat: string
}

export interface DataTrxResponse {
  page: number,
  recordsTotal: string,
  data: DataTrx[]
  statTotal: StatTotal
}

export interface StatTotal {
  gagal: string,
  pending: string,
  sukses: string
}

export interface DataTrx {
  id_trx: string
  noid: string
  nama_member: string
  alias: string
  time: string
  product: string
  idpel: string
  nama: string
  lembar: string
  tagihan: string
  admin: string
  total: string
  reff: string
  reffpay: string
  status: string
}
