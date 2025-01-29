"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  SelectItem,
  Select,
  Input
} from "@nextui-org/react";
import { ListProduct, ListProductDetail } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { NumericFormat } from "react-number-format";

interface ProductDetailProps {
  isOpen: boolean;
  onOpenChange: () => void;
  product: ListProduct;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ isOpen, onOpenChange, product }) => {
  const [selectedProductDetail, setSelectedProductDetail] = useState<ListProductDetail>({} as ListProductDetail);
  return (
    <>
      <Drawer
        hideCloseButton
        backdrop="transparent"
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        size="sm" 
        placement="left"
        isDismissable={false}
        classNames={{ base: "top-20 bottom-16 left-1 rounded-lg" }}
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
                { product.isActive === '1' ? (
                  <>
                    { product.map_product_detail === 'list' && product.list_product_detail && product.list_product_detail.length <= 3 ? (
                      <div className="flex flex-col gap-6">
                        <div className={`grid gap-2 grid-cols-${product.list_product_detail.length}`}>
                          {product.list_product_detail?.map((item) => (
                            <div
                              onClick={() => setSelectedProductDetail(item)}
                              key={item.product_detail} 
                              className={`flex flex-col h-28 items-center justify-center rounded-lg border-2 gap-4 cursor-pointer ${item.product_detail === selectedProductDetail?.product_detail ? "border-primary bg-primary-100" : "border-gray-200"}`}
                            >
                              {
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
                          Object.keys(selectedProductDetail).length !== 0 && selectedProductDetail.config ? (
                            selectedProductDetail.config.layout.map((layoutItem) => (
                              <div key={layoutItem.label}>
                                <label htmlFor={layoutItem.label} className="sr-only">{layoutItem.label}</label>
                                {
                                  layoutItem.tipe === 'textfield' ? (
                                    layoutItem.is_number ? (
                                      <NumericFormat
                                        allowLeadingZeros
                                        placeholder={layoutItem.label}
                                        type="text"
                                        isRequired
                                        thousandSeparator={layoutItem.comma_decimal === 'yes' ? '.' : false}
                                        decimalSeparator={layoutItem.comma_decimal === 'yes' ? '.' : ''}
                                        maxLength={layoutItem.max_length === 0 ? undefined : layoutItem.max_length}
                                        minLength={layoutItem.min_length === 0 ? undefined : layoutItem.min_length}
                                        customInput={Input}
                                      />
                                    ) : (
                                      <Input 
                                        type="text"
                                        placeholder={layoutItem.label}
                                      />
                                    )
                                  ) : layoutItem.tipe === 'dropdown' ? (
                                    <Select placeholder={layoutItem.placeholder}>
                                      <SelectItem></SelectItem>
                                    </Select>
                                  ) : null
                                }
                              </div>
                            ))
                          ) : null
                        }
                      </div>
                    ) : product.map_product_detail === 'list' && product.list_product_detail && product.list_product_detail.length > 3 ? (
                      <div className="flex flex-col gap-6">
                        <Select placeholder="Pilih Layanan" onSelectionChange={(keys) => {
                          const selectedDetail = product.list_product_detail?.find(item => item.product_detail === keys.currentKey);
                          if (selectedDetail) {
                            setSelectedProductDetail(selectedDetail);
                          }
                        }}>
                          { product.list_product_detail?.map((item) => (
                            <SelectItem key={item.product_detail}>{item.product_detail}</SelectItem>
                          ))}
                        </Select>
                        {
                          Object.keys(selectedProductDetail).length !== 0 && selectedProductDetail.config ? (
                            selectedProductDetail.config.layout.map((layoutItem) => (
                              <div key={layoutItem.label}>
                                <label htmlFor={layoutItem.label} className="sr-only">{layoutItem.label}</label>
                                {
                                  layoutItem.tipe === 'textfield' ? (
                                    layoutItem.is_number ? (
                                      <NumericFormat
                                        allowLeadingZeros
                                        placeholder={layoutItem.label}
                                        type="text"
                                        isRequired
                                        thousandSeparator={layoutItem.comma_decimal === 'yes' ? '.' : false}
                                        decimalSeparator={layoutItem.comma_decimal === 'yes' ? '.' : ''}
                                        maxLength={layoutItem.max_length === 0 ? 100 : layoutItem.max_length}
                                        minLength={layoutItem.min_length === 0 ? 100 : layoutItem.min_length}
                                        customInput={Input}
                                      />
                                    ) : (
                                      <Input 
                                        type="text"
                                        placeholder={layoutItem.label}
                                      />
                                    )
                                  ) : layoutItem.tipe === 'dropdown' ? (
                                    <Select placeholder={layoutItem.placeholder}>
                                      <SelectItem></SelectItem>
                                    </Select>
                                  ) : null
                                }
                              </div>
                            ))
                          ) : null
                        }
                      </div>
                    ) : (

                      <div>
                        {}
                      </div>
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
                <Button color="danger" variant="light" onPress={() => {
                  setSelectedProductDetail({} as ListProductDetail);
                  onClose()
                }}>
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
    </>
  );
};

export default ProductDetail;
