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
import { Layout, ListProduct, ListProductDetail } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import api from "@/lib/axios";
import { debounce } from "lodash";
import { formatThousands } from "@/utils/formatter";


interface ProductDetailProps {
  isOpen: boolean;
  onOpenChange: () => void;
  product: ListProduct;
}

export interface DataResponse {
  id: string
  default?: Default
  list: List[]
}

export interface Default {
  label: string
  value: string
}

export interface List {
  label: string
  value: string
  detail?: string 
  desc?: string
  price?: number
}

export interface DataPayload {
  id: string,
  value: string | number
}


const ProductDetail: React.FC<ProductDetailProps> = ({ isOpen, onOpenChange, product }) => {
  const [selectedProductDetail, setSelectedProductDetail] = useState<ListProductDetail>({} as ListProductDetail)
  const [dataApiResponse, setDataApiResponse] = useState<Array<DataResponse>>([])
  const [selectedPackage, setSelectedPackage] = useState<List>({} as List)
  const [dataPayload, setDataPayload] = useState<Array<DataPayload>>([])

  useEffect(() => {
    const fetchData = async () => {
      const response = product.config?.layout.filter((layout) => layout.value?.endpoint).map(async (layoutItem) => {
        if(layoutItem.value?.endpoint) {
          const url = layoutItem.value.endpoint.replace('{{interface}}', 'WEB')
          const res = await api.get(url)
          const id = layoutItem.id
          return {...res.data, id}
        }
      })
      const responses: Array<DataResponse> = await Promise.all(response || [])
      setDataApiResponse(responses)
    }

    if(product.isActive === '1' && product.map_product_detail === 'no') {
      fetchData()
    }

    if(product.list_product_detail && product.list_product_detail.length > 0){
      setSelectedProductDetail(product?.list_product_detail[0])
    }

  }, [product]);

  useEffect(() => {
    const fetchData = async () => {
      const response = selectedProductDetail.config?.layout.filter((layout) => layout.value?.endpoint).map(async (layoutItem) => {
        if(layoutItem.value?.endpoint) {
          const url = layoutItem.value.endpoint.replace('{{interface}}', 'WEB')
          const res = await api.get(url)
          const id = layoutItem.id
          return {...res.data, id}
        }
      })
      const responses: Array<DataResponse> = await Promise.all(response || [])
      setDataApiResponse(responses)
      setSelectedPackage(responses[0]?.list[0])
      responses.forEach((data) => {
        const mapPayload = dataPayload.map((payload) => {
          if(payload.id === data.id) {
            return {
              id: data.id,
              value: data.default?.value || ''
            }
          }
          return payload;
        })
        setDataPayload(mapPayload)
      })
    }
    fetchData()
  }, [selectedProductDetail]);

  useEffect(() => {
    const fetchData = async () => {
      const response = product.config?.layout.filter((layout) => layout.event?.endpoint).map(async (layoutItem) => {
        if(layoutItem.event?.endpoint) {
          const lastItem = dataPayload.pop()
          const url = layoutItem.event.endpoint.replace(`{{${lastItem?.id}}}`, String(lastItem!.value))
          const res = await api.get(url)
          const id = layoutItem.event.set_value
          return {...res.data, id}
        }
      })

      const responses: Array<DataResponse> = await Promise.all(response || [])
      // setDataApiResponse(unionBy(dataApiResponse, responses))
      const updatedData = responses.map(response => {
        const existing = dataApiResponse.find(item => item.id === response.id);
        return existing ? { ...existing, ...response } : response;
      });
      setDataApiResponse([...dataApiResponse.filter(item => !responses.some(response => response.id === item.id)), ...updatedData]);
    }

    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataPayload])


  const onHandleSelectedProductDetail = (keys: SharedSelection) => {
    const selectedKey = product.list_product_detail?.find((item) => item.product_detail === keys.currentKey)
    if(selectedKey) {
      setSelectedProductDetail(selectedKey)
    }
  }

  const onHandleSelectedDropdown = (e: React.ChangeEvent<HTMLSelectElement>, id: string) => {
    setDataPayload(dataPayload => [...dataPayload, {
      id,
      value: e.target.value
    }])
  }

  const onHandleSelectedKeyDropdown = (layoutItem: Layout): Array<string | undefined> | undefined => {
    if(dataPayload.find(item => item.id === layoutItem.id)?.value){
      return [(dataPayload.find(item => item.id === layoutItem.id)!.value)!.toString()]
    } 
    return undefined
  }

  const onHandleInputChange = debounce((e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if(e.target.value.length > 3) {
      setDataPayload([...dataPayload, {
        id,
        value: e.target.value
      }])
    }
  }, 500)

  const renderProductDetailComponent = ( layoutItem: Layout ) => {
    return (
      layoutItem.tipe === 'textfield' ? (
        layoutItem.is_number ? (
          <NumericFormat
            key={layoutItem.id}
            id={layoutItem.id}
            allowLeadingZeros
            label={layoutItem.label}
            type="text"
            isRequired
            thousandSeparator={layoutItem.comma_decimal === 'yes' ? '.' : false}
            decimalSeparator={layoutItem.comma_decimal === 'yes' ? ',' : ''}
            maxLength={layoutItem.max_length !== 0 ?  layoutItem.max_length : undefined }
            minLength={layoutItem.min_length !== 0 ?  layoutItem.max_length : undefined }
            customInput={Input}
            onChange={(e) => onHandleInputChange(e, layoutItem.id)}
          />
        ) : (
          <Input 
            key={layoutItem.id}
            id={layoutItem.id}
            type="text"
            label={layoutItem.label}
            onChange={(e) => onHandleInputChange(e, layoutItem.id)}
          />
        )
      ) : layoutItem.tipe === 'dropdown' ? (
        <Select  
          key={layoutItem.id}
          label={layoutItem.label}
          items={dataApiResponse.find(item => item.id === layoutItem.id)?.list || []}
          isRequired
          selectedKeys={onHandleSelectedKeyDropdown(layoutItem)?.filter((key): key is string => key !== undefined)}
          placeholder={layoutItem.placeholder}
          onChange={(e) => onHandleSelectedDropdown(e, layoutItem.id)}
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
          dataApiResponse
            .filter((data: DataResponse) => data.id === layoutItem.id)
                .flatMap((data: DataResponse) => 
                  <div 
                    key={layoutItem.id}
                    id={layoutItem.id} 
                    className="flex flex-col gap-2"
                  >
                    {
                      data.list.map((item) => (
                        <div onClick={() => setSelectedPackage(item)} key={item.value} className={`p-4 border rounded-lg cursor-pointer space-y-2 ${selectedPackage?.value === item.value ? "bg-primary-100 border-primary" : "border-gray-200"}`}>
                          <div className="text-sm text-gray-600 font-medium">{item.label}</div>
                          <div className="text-xs text-gray-600 font-medium">{item.desc}</div>
                          <div className="text-xs font-semibold">Rp. {formatThousands(item.price || '0')}</div>
                        </div>
                      ))
                    }   
                  </div> 
                )
      ) : layoutItem.tipe === 'card' ? (
          dataApiResponse
            .filter((data: DataResponse) => data.id === layoutItem.id)
                .flatMap((data: DataResponse) => 
                  <div
                    key={layoutItem.id}
                    id={layoutItem.id}
                    className="grid grid-cols-3 gap-2"
                  >
                    {
                      data.list.map((item) => (
                        <div onClick={() => setSelectedPackage(item)} key={item.value} className={`p-4 border rounded-lg cursor-pointer space-y-2 ${selectedPackage?.value === item.value ? "bg-primary-100 border-primary" : "border-gray-200"}`}>
                          <div className="text-xs font-medium text-gray-600">{item.label}</div>
                          <div className="text-xs font-medium text-gray-600">{item.detail}</div>
                          <div className="text-xs font-medium">Rp. {formatThousands(item.price || '0')}</div>
                        </div>
                      ))
                    }   
                  </div> 
                )
      ) : layoutItem.tipe === 'hidden' ? (
          <Input key={layoutItem.id} id={layoutItem.id} className="hidden" type="hidden" />
        ) : (
          null
        )
    )
  }

  return (<>
    <Drawer
      hideCloseButton
      backdrop="transparent"
      isOpen={isOpen} 
      onOpenChange={onOpenChange} 
      placement="left"
      classNames={{ base: "top-20 bottom-16 left-1 rounded-lg max-w-[calc(26vw)] w-[calc(26vw)]" }}
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
          <>
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
              <Button className={product.isActive === '0' ? 'hidden' : ''}  color="primary" onPress={onClose}>
                Proses
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  </>);
};

export default ProductDetail;
