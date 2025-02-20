export interface PrinterSettings {
  auto: boolean
  type: string
  config: PrinterConfig | undefined
}

export interface PrinterConfig {
  spaceMatrix?: number
  space?: number
  paper?: number
  font?: number
}