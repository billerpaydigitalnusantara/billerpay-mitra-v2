export interface DataRegistration {
  nohp_email?: string,
  token_aktivasi?: string,
  detail?: DataDetailRegistration
}

export interface DataDetailRegistration {
  nama_merchant?: string
  nama_pemilik?: string
  nik?: string
  tgl_lahir?: string
  alamat?: string
  id_provinsi?: string
  provinsi?: string
  id_kota_kabupaten?: string
  kota_kabupaten?: string
  id_kecamatan?: string
  kecamatan?: string
  id_kelurahan?: string
  kelurahan?: string
  rt?: string
  rw?: string
  kodepos?: string
  password?: string
  appid?: string
  interface?: string
}