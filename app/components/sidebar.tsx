"use client";

import { Tabs, Tab, useDisclosure } from "@nextui-org/react";
import { Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useState } from "react";
import ProductDetail from "./product-detail";
import { ListProduct, GridProduct } from "@/types";
import api from "@/lib/axios";

const Sidebar = () => {
  const [productsList, setProductsList] = useState([] as ListProduct[]);
  const [productsGrid, setProductsGrid] = useState([] as GridProduct[]);
  const [selectedTabs, setSelectedTabs] = useState("list");
  const [selectedProduct, setSelectedProduct] = useState({} as ListProduct);
  const { isOpen: isOpenProductDetail, onOpen: onOpenProductDetail, onOpenChange: onOpenChangeProductDetail } = useDisclosure()

  const onSelectedProduct = (product: ListProduct) => {
    setSelectedProduct(product)
    onOpenProductDetail()
  }
 
  useEffect(() => {
    async function fetchProductsList() {
      const res = await api.get('/KONFIG/PRODUCT_LIST/LIST')
      const data = await res.data
      setProductsList(data)
    }

    async function fetchProductsGrid() {
      const res = await api.get('/KONFIG/PRODUCT_LIST/WEB')
      const data = await res.data
      setProductsGrid(data)
    }

    fetchProductsList()
    fetchProductsGrid()
  }, []);
  
  return(
    <div className="bg-white rounded-lg h-[calc(100vh-4rem-3rem-2rem)] ml-4 p-4 space-y-4">
      <ProductDetail isOpen={isOpenProductDetail} onOpenChange={onOpenChangeProductDetail} product={selectedProduct} />
      <div className="flex flex-col items-end">
        <Tabs 
          aria-label="options-layout" 
          color="primary" 
          variant="solid"
          selectedKey={selectedTabs}
          onSelectionChange={(key) => setSelectedTabs(key.toString())}
        >
          <Tab 
            value="list" 
            title={
              <div className="flex items-center space-x-2">
                <ListBulletIcon className="h-6 w-6" />
                <span className="font-medium">List</span>
              </div>
            }
            className="w-full"
          >
            <div className="h-[calc(100vh-15rem)] overflow-y-auto space-y-2">
              {productsList.map((product: ListProduct) => (
                <div key={product.id_product} className="flex items-center h-12 w-full rounded-lg border p-4 gap-4 cursor-pointer" onClick={onSelectedProduct.bind(this, product)}>
                  {
                    product.icon === null ? (
                      <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                    ) : (
                      <Image 
                        src={product.icon || ""}
                        alt="icon"
                        width={32}
                        height={32}
                      />
                    )
                  }
                  <span className="text-sm font-semibold text-gray-600 tracking-wide">{product.product}</span>
                </div>
              ))}
            </div>
          </Tab>
          <Tab 
            value="grid" 
            title={
              <div className="flex items-center space-x-2">
                <Squares2X2Icon className="h-6 w-6" />
                <span className="font-medium">Grid</span>
              </div>
            }
            className="w-full"
          >
          <div className="max-h-[calc(100vh-15rem)] overflow-y-auto space-y-4">
            {productsGrid.map((item: GridProduct) => (
              <div key={item.category}>
                <h2 className="text-lg font-semibold text-gray-600">{item.category}</h2>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">
                {item.product.map((product: ListProduct) => (
                  <div key={product.id_product} className="flex flex-col h-28 items-center justify-start rounded-lg border p-4 gap-4 cursor-pointer" onClick={onSelectedProduct.bind(this, product)}>
                    {
                      product.icon === null ? (
                        <div className="w-10 min-h-10 bg-gray-200 rounded-lg"></div>
                      ) : (
                        <Image 
                          src={product.icon || ""}
                          alt="icon"
                          width={40}
                          height={40}
                        />
                      )
                    }
                    <span className="text-xs font-semibold text-gray-600 text-center">{product.product}</span>
                  </div>
                ))}
                </div>
              </div>
            ))}
          </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Sidebar;