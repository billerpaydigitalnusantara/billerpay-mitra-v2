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