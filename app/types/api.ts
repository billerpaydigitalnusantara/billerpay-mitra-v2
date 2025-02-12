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

export interface DataMutasiResponse {
  page: number,
  recordsTotal: string,
  data: DataMutasi[]
}

export interface DataMutasi {
  id_trx: string
  noid: string
  nama_member: string
  alias: string
  time: string
  keterangan: string
  total: string
  saldo: string
  status: string
}

export interface DataTrxFeeDayResponse {
  product: string
  stat: number
  abnormal: string
  total_transaksi: number
  total_lembar: number
  total_nominal: number
  total_tagihan: number
  total_admin: number
  profit: number
}

export interface DataTrxFeeDayDetailResponse {
  no: string
  noid: string
  nama_member: string
  alias: string
  id_trx: string
  time: string
  idpel: string
  nama: string
  reff: string
  lembar: string
  tagihan: string
  admin: string
  nominal_transaksi: string
  fee_m3: string
  profit: string
}

export interface DataTrxFeeResponse {
  tanggal: string
  stat: number
  abnormal: string
  total_transaksi: number
  total_lembar: number
  total_nominal: number
  total_tagihan: number
  total_admin: number
  profit: number
}

export interface DataReportTrxFeeResponse {
  total_trx: number
  total_lembar: number
  total_nominal: number
  total_tagihan: number
  total_profit: number
  total_admin: number
}

export interface DataMasterKolektifResponse {
  page: number
  totalData: string
  data: DataMasterKolektif[]
}

export interface DataMasterKolektif {
  no: string
  id_goup: string
  jenis: string
  nama_group: string
  alamat: string
  jml_idpel: string
}

export interface DataMasterDetailKolektifResponse {
  page: number
  totalData: string
  data: DataMasterDetailKolektif[]
}

export interface DataMasterDetailKolektif {
  id: string
  idpel: string
  idpel_name: string
  tarif_daya: string
  tagihan: string
}

export interface DataReprintKolektifResponse {
  page: number
  totalData: string
  data: DataReprintKolektif[]
}

export interface DataReprintKolektif {
  no: string
  id_goup: string
  jenis: string
  nama_group: string
  alamat: string
  jml_idpel: string
  last_pay: string
}

export interface DataReprintDetailKolektif {
  reff: string
  idpel: string
  idpel_name: string
  tagihan: string
  admin_bank: string
  total_tagihan: string
}

export interface DataProsesKolektifResponse {
  page: number
  totalData: string
  data: DataProsesKolektif[]
}

export interface DataProsesKolektif {
  no: string
  id_goup: string
  jenis: string
  nama_group: string
  alamat: string
  jml_idpel: string
  status: string
  last_transaksi: string
}


export interface ListAdminResponse {
  id: string
  admin: string
}