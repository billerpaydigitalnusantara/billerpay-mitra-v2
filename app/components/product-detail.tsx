import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  SelectItem,
  Select,
  Input,
  SharedSelection
} from "@heroui/react";
import { Config, Layout, ListProduct, ListProductDetail } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import api from "@/lib/axios";
import { debounce, isEmpty } from "lodash";
import { formatThousands } from "@/utils/formatter";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useAtom, useSetAtom } from 'jotai';
import { dataTransaksiAtom, selectedTrx } from "@/atoms/transaksi";

interface ProductDetailProps {
  isOpen: boolean;
  onOpenChange: () => void;
  product: ListProduct;
}

export interface OptionsResponse {
  id: string
  type: string
  default?: Default
  list: DataList[]
}

export interface Default {
  label: string
  value: string
}

export interface DataList {
  label: string
  value: string
  detail?: string 
  desc?: string
  price?: number
}

export interface DataPayload {
  id: string,
  value: string
}


const ProductDetail: React.FC<ProductDetailProps> = ({ isOpen, onOpenChange, product }) => {
  const [selectedProductDetail, setSelectedProductDetail] = useState<ListProductDetail>({} as ListProductDetail)
  const [selectedPackage, setSelectedPackage] = useState<DataList>({} as DataList)
  const [dataOptions, setDataOptions] = useState<OptionsResponse[]>([] as OptionsResponse[])
  const [dataPayload, setDataPayload] = useState<DataPayload[]>([] as DataPayload[])
  const [codeProduct, setCodeProduct] = useState<string>('')
  const [dataTransaksi, setDataTransaksi] = useAtom(dataTransaksiAtom)
  const setSelectedTransaksi = useSetAtom(selectedTrx)


  const fetchProductLayout = async () => {
    const response = product.config?.layout.filter((layout) => layout.value?.endpoint).map(async (layout) => {
      if(layout.value?.endpoint) {
        const url = layout.value.endpoint.replace('{{interface}}', 'WEB')
        const res = await api.post(url)
        const id = layout.id
        const type = layout.tipe
        return {...res.data, id, type}
      }
    })
    const responses: Array<OptionsResponse> = await Promise.all(response || [])
    setDataOptions(responses)
  }

  const fetchProductDetailLayout = async () => {
    const response = selectedProductDetail.config?.layout.filter((layout) => layout.value?.endpoint).map(async (layout) => {
      if(layout.value?.endpoint) {
        const url = layout.value.endpoint.replace('{{interface}}', 'WEB')
        const res = await api.post(url)
        const id = layout.id
        const type = layout.tipe
        return {...res.data, id, type}
      }
    })
    const responses: Array<OptionsResponse> = await Promise.all(response || [])
    setDataOptions(responses)

    if(!isEmpty(responses.find(item => item.type === 'card' || item.type === 'list'))){
      setSelectedPackage(responses[0]?.list[0])
    }

    const defaultValue = responses.map((item) => {
      return {
        id: item.id,
        value: item.default?.value || responses[0]?.list[0].value
      }
    })

    setDataPayload(upsertData(initiatePayload(selectedProductDetail.config), defaultValue))
  }

  const fetchEventLayout = async () => {
    const response = product.config?.layout.filter((layout) => layout.event?.endpoint).map(async (layout) => {
      const payload = dataPayload.find((payload) => payload.id === layout.id)
      if(layout.event?.endpoint && payload?.value) {
        const url = layout.event.endpoint.replace(`{{${payload?.id}}}`, String(payload?.value))
        const id = layout.event.set_value
        const type = layout.tipe
        const res = await api.post(url)
        return {...res.data, id, type}
      }

      return {
        id: layout.event?.set_value,
        type: layout.tipe,
        list: []
      }
    })

    const responses: Array<OptionsResponse> = await Promise.all(response || [])
    setDataOptions(upsertData(dataOptions, responses))
  }

  useEffect(() => {
    if(!isOpen){
      setSelectedProductDetail({} as ListProductDetail)
      setSelectedPackage({} as DataList)
      setDataPayload([])
      setCodeProduct('')
    }
    
    if(isOpen && product.isActive === '1' && product.map_product_detail === 'no') {
      fetchProductLayout()
      setCodeProduct(product.config?.code || '')
      setDataPayload(initiatePayload(product.config as Config))
    }

    if(isOpen && product.isActive === '1' && product.list_product_detail && product.map_product_detail === 'list'){
      setSelectedProductDetail(product?.list_product_detail[0])
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    setDataPayload([])
    fetchProductDetailLayout()
    setCodeProduct(selectedProductDetail.config?.code || '')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProductDetail]);

  useEffect(() => {
    if(!isEmpty(dataPayload)){
      fetchEventLayout()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataPayload])
  
  const initiatePayload = ( selectedConfig: Config ) => {
    const payload = selectedConfig?.layout?.map((item) => {
      if(item.tipe === 'hidden'){
        return {
          id: item.id,
          value: String(item.value || '')
        }
      }

      return {
        id: item.id,
        value: ''
      }
    })

    if(payload) {
      return payload
    }

    return []
  }

  const upsertData = <T extends { id: string }>(existingData: T[], newData: T[]): T[] => {
    if (!existingData || existingData.length === 0) {
      return [...newData]
    }
    
    if (!newData || newData.length === 0) {
      return [...existingData]
    }
    
    const dataMap = new Map(existingData.map(item => [item.id, item]))
    
    newData.forEach(item => {
      dataMap.set(item.id, item)
    });
    
    return Array.from(dataMap.values())
  }

  const onHandleSelectedProductDetail = (keys: SharedSelection) => {
    const selectedKey = product.list_product_detail?.find((item) => item.product_detail === keys.currentKey)
    if(selectedKey) {
      setSelectedProductDetail(selectedKey)
    }
  }

  const onHandleSelectedDropdown = (event: React.ChangeEvent<HTMLSelectElement>, id: string) => {
    const payload = {
      id,
      value: event.target.value
    }
    setDataPayload(upsertData(dataPayload, [payload]))
  }

  const selectedKeyDropdown = (layout: Layout): Array<string> => {
    const foundItem = dataPayload.find(item => item.id === layout.id)?.value;
    if (foundItem) {
      return [foundItem.toString()];
    }
    return [""];
  }

  const onHandleInputChange = debounce((event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const payload = {
      id,
      value: event.target.value.replace(/[.,]/g, '')
    }
    setDataPayload(upsertData(dataPayload, [payload]))
  }, 300)

  const onHandleSelectPackage = (itemList: DataList, id: string) => {
    setSelectedPackage(itemList)
    const payload = {
      id,
      value: itemList.value
    }
    setDataPayload(upsertData(dataPayload, [payload]))
  }

  const transformPayloadDetail = (a: { id: string; value: string }[], b: Record<string, string>): Record<string, string> => {
    const aMap = new Map(a.map(item => [item.id, item.value]));
    
    return Object.fromEntries(
      Object.entries(b).map(([key, val]) => {
        const match = val.match(/{{(.*?)}}/);
        if (match) {
          const extractedKey = match[1];
          if (aMap.has(extractedKey)) {
            return [key, aMap.get(extractedKey) as string];
          }
        }
        return [key, val];
      })
    );
  }

  const generateTraceID = (length: number = 8): string => {
    let tranceId: string = Date.now().toString();
    tranceId = tranceId.slice(-8);
    
    for (let i = 0; i < length; i++) {
        tranceId += Math.floor(Math.random() * 10).toString();
    }
    
    return tranceId;
  }

  const onHandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    let productDetail = ''
    const regexBrackets =  /[{}]/
    const code = codeProduct.replace(/[{]+|[}]+/g, "")
    const isNotFilled = dataPayload.some((item) => item.value === '')
    const idpel = dataPayload.reduce((acc, item) => item.id === 'idpel' ? item.value : acc, '')
    const traceId = generateTraceID()
    let detail = {}

    if(!isEmpty(selectedProductDetail)){
      detail = transformPayloadDetail(dataPayload, selectedProductDetail.config?.payload_detail as Record<string, string> || {})
    } else {
      detail = transformPayloadDetail(dataPayload, product.config?.payload_detail as Record<string, string> || {})
    }

    if (regexBrackets.test(codeProduct)) {
      productDetail = dataPayload.reduce((acc, item) => item.id === code ? item.value : acc, '')
    } else {
      productDetail = code
    }

    const isExist = dataTransaksi.some((item) => item.idpel === idpel && item.product === `${product.code} - ${productDetail}`)

    if(isNotFilled){
      toast.error('Anda belum mengisi semua kolom. Periksa kembali data anda')
    } else if (isExist) {
      toast.error(`Product ${product.code} - ${productDetail} dengan ID Pelanggan ${idpel} sudah ada pada table`)
      setDataPayload(upsertData(dataPayload, [{
        id: 'idpel',
        value: ''
      }]))
    } else {
      try {
        const response = await api.post(`TRXINQUIRY/act/${product.code}/${productDetail}/${idpel}/${traceId}/WEB`, { detail, versi: 'V1' })
        const data = response.data
        if(response.data.response_code === '0000') {
          toast.success(response.data.response_message)
          setDataTransaksi((transaksi) => {
            const existTrx = transaksi.filter((item) => item.status === '-').map((item, index) => ({...item, no: String(index + 1)}))
            const newTrx =  {
              no: (existTrx.length + 1).toString(),
              product: product.code + ' - ' + productDetail,
              idpel: data.idpel,
              idpel_name: data.idpel_name,
              tagihan: data.tagihan,
              admin_bank: data.admin_bank,
              total_tagihan: data.total_tagihan,
              status: '-',
              traceId: data.trace_id,
              reff: data.reff,
              detail: data.response_html,
              responseMessage: '' 
            }
            
            return [...existTrx, newTrx]
          })
          setSelectedTransaksi((trx) => new Set([...trx, data.trace_id]))
          setDataPayload(upsertData(dataPayload, [{
            id: 'idpel',
            value: ''
          }]))
        } else {
          toast.error(response.data.response_message)
        }
      } catch (error) {
        const err = error as AxiosError
        if(err.status && err.status >= 500) {
          toast.error('Terjadi kesalahan sistem')
        }
      }
    }
  } 

  const renderProductDetailComponent = ( layoutItem: Layout ) => {
    return (
      layoutItem.tipe === 'textfield' ? (
        layoutItem.is_number ? (
          <NumericFormat
            key={layoutItem.id}
            allowLeadingZeros
            label={layoutItem.label}
            type="text"
            isRequired
            thousandSeparator={layoutItem.comma_decimal === 'yes' ? '.' : false}
            decimalSeparator={layoutItem.comma_decimal === 'yes' ? ',' : ''}
            maxLength={layoutItem.max_length !== 0 ?  layoutItem.max_length : undefined }
            minLength={layoutItem.min_length !== 0 ?  layoutItem.min_length : undefined }
            customInput={Input}
            value={dataPayload.reduce((acc, item) => item.id === layoutItem.id ? item.value : acc, '')}
            onChange={(event) => onHandleInputChange(event, layoutItem.id)}
            autoFocus={layoutItem.focus}
            validate={(value) => {
              if(layoutItem.min_length && value.length < layoutItem.min_length){
                return `Nomor yang anda masukan kurang dari ${layoutItem.min_length} digit`
              }
              return null
            }}
          />
        ) : (
          <Input 
            key={layoutItem.id}
            type="text"
            label={layoutItem.label}
            value={dataPayload.reduce((acc, item) => item.id === layoutItem.id ? item.value : acc, '')}
            onChange={(event) => onHandleInputChange(event, layoutItem.id)}
            isRequired
          />
        )
      ) : layoutItem.tipe === 'dropdown' ? (
        <Select  
          key={layoutItem.id}
          label={layoutItem.label}
          items={dataOptions.find(item => item.id === layoutItem.id)?.list || []}
          isRequired
          selectedKeys={selectedKeyDropdown(layoutItem)}
          placeholder={layoutItem.placeholder}
          onChange={(event) => onHandleSelectedDropdown(event, layoutItem.id)}
        >
          {
            (item) => (
              <SelectItem key={item.value} value={item.value}>
                {
                  layoutItem.comma_decimal === 'yes' ? (
                    formatThousands(item.label)
                  ) : (
                    item.label
                  )
                }
              </SelectItem>
            )
          }
        </Select>
      ) : layoutItem.tipe === 'list' ? (
          dataOptions
            .filter((data: OptionsResponse) => data.id === layoutItem.id)
                .flatMap((data: OptionsResponse) => 
                  <div
                    key={layoutItem.id}
                    className="flex flex-col gap-2"
                  >
                    {
                      data.list.map((item) => (
                        <div tabIndex={0} onClick={() => onHandleSelectPackage(item,layoutItem.id)} key={item.value} className={`p-4 border rounded-lg cursor-pointer space-y-2 ${selectedPackage?.value === item.value ? "bg-primary-100 border-primary" : "border-gray-200"}`}>
                          <div className="text-sm text-gray-600 font-medium">{item.label}</div>
                          <div className="text-xs text-gray-600 font-medium">{item.desc}</div>
                          <div className="text-xs font-semibold">Rp. {formatThousands(item.price || '0')}</div>
                        </div>
                      ))
                    }   
                  </div> 
                )
      ) : layoutItem.tipe === 'card' ? (
          dataOptions
            .filter((data: OptionsResponse) => data.id === layoutItem.id)
                .flatMap((data: OptionsResponse) => 
                  <div
                    key={layoutItem.id}
                    className="grid grid-cols-3 gap-2"
                  >
                    {
                      data.list.map((item) => (
                        <div tabIndex={0} onClick={() => onHandleSelectPackage(item,layoutItem.id)} key={item.value} className={`p-4 border rounded-lg cursor-pointer space-y-2 ${selectedPackage?.value === item.value ? "bg-primary-100 border-primary" : "border-gray-200"}`}>
                          <div className="text-xs font-medium text-gray-600">{item.label}</div>
                          <div className="text-xs font-medium text-gray-600">{item.detail}</div>
                          <div className="text-xs font-medium">Rp. {formatThousands(item.price || '0')}</div>
                        </div>
                      ))
                    }   
                  </div> 
                )
      ) : null
    )
  }

  return (
    <Drawer
      hideCloseButton
      backdrop="transparent"
      isOpen={isOpen} 
      onOpenChange={onOpenChange} 
      placement="left"
      classNames={{ base: ["top-20 bottom-16 left-1 rounded-lg max-w-[calc(26vw)] w-[calc(26vw)]"], footer: ["bottom-0 sticky bg-white"] }}
      motionProps={{
        variants: {
          enter: {
            opacity: 1,
            x: 14,
            transition: { duration: 0.15 },
          },
          exit: {
            x: -100,
            opacity: 0,
            transition: { duration: 0.15 },
          },
        },
      }}
    >
      <DrawerContent>
        {(onClose) => (
          <form
            onSubmit={onHandleSubmit}
          >
            <DrawerHeader className="flex flex-col gap-1 left-12 top-16">{product.product}</DrawerHeader>
            <DrawerBody>
              { 
                // if product active
                product.isActive === '1' ? (
                <>
                  { 
                    // if product has product detail and less than equal 3 items
                    product.map_product_detail === 'list' && product.list_product_detail && product.list_product_detail.length <= 3 ? (
                    (<div className="flex flex-col gap-4">
                      <div className={`grid gap-2 grid-cols-${product.list_product_detail.length}`}>
                        {product.list_product_detail?.map((item) => (
                          <div
                            onClick={() => setSelectedProductDetail(item)}
                            key={item.product_detail} 
                            className={`flex flex-col h-28 items-center justify-center rounded-lg border gap-4 cursor-pointer ${item.product_detail === selectedProductDetail?.product_detail ? "border-primary bg-primary-100" : "border-gray-200"}`}
                          >
                            {
                              // if product detail doesn't have icon
                              item.icon === null ? (
                                <div className="w-10 min-h-10 bg-gray-200 rounded-lg"></div>
                              ) : (
                                <div className="h-10 w-20 flex items-center justify-center relative">
                                  <Image 
                                    src={item.icon || "/default-icon.png"}
                                    alt="icon"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              )
                            }
                            <span className="font-medium text-sm text-gray-600 text-center">{item.product_detail}</span>
                          </div>
                        ))}
                      </div>
                        {
                          // if product detail is not empty and has a config data
                          Object.keys(selectedProductDetail).length !== 0 && selectedProductDetail.config ? (
                            selectedProductDetail.config.layout.map((layoutItem) => renderProductDetailComponent(layoutItem))
                          ) : null
                        }
                    </div>)
                    // if product has product detail and more than 3 items 
                  ) : product.map_product_detail === 'list' && product.list_product_detail && product.list_product_detail.length > 3 ? (
                    <div className="flex flex-col gap-4">
                      <Select isRequired label="Pilih Layanan" defaultSelectedKeys={[product.list_product_detail[0].product_detail]} onSelectionChange={(keys) => onHandleSelectedProductDetail(keys)}>
                        { product.list_product_detail?.map((item) => (
                          <SelectItem key={item.product_detail}>{item.product_detail}</SelectItem>
                        ))}
                      </Select>
                      {
                        Object.keys(selectedProductDetail).length !== 0 && selectedProductDetail.config ? (
                          selectedProductDetail.config.layout.map((layoutItem) => renderProductDetailComponent(layoutItem))
                        ) : null
                      }
                    </div>
                  ) : (
                    // if product doesn't have product details
                    (<div className="flex flex-col gap-4">
                      {
                        product.config ? (
                          product.config.layout.map((layoutItem) => renderProductDetailComponent(layoutItem))
                        ) : null
                      }
                    </div>)
                  )}
                </>
              ) : (
                <>
                  <h4 className="font-semibold text-large">Uppss...</h4>
                  <p>Produk {product.product} Sedang Offline!.</p>
                </>
              )}
            </DrawerBody>
            <DrawerFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Kembali
              </Button>
              <Button className={product.isActive === '0' ? 'hidden' : ''}  color="primary" type="submit">
                Proses
              </Button>
            </DrawerFooter>
          </form>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default ProductDetail;
