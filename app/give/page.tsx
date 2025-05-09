/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { OrderItem, Product } from "@/type";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { readProducts } from "../actions";
import Wrapper from "../components/Wrapper";
import ProductComponent from "../components/ProductComponent";
import EmptyState from "../components/EmptyState";

const page = () => {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const fetchProducts = async () => {
    try {
      if (email) {
        const products = await readProducts(email);
        if (products) {
          setProducts(products);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (email) fetchProducts();
  }, [email]);

  const filteredAvaibleProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) => !selectedProductIds.includes(product.id))
    .slice(0, 10);

  const handleAddToCart = (product: Product) => {
    setOrder((prevOrder) => {
      const existingProduct = prevOrder.find(
        (item) => item.productId === product.id
      );
      let updatedOrder;
      if (existingProduct) {
        updatedOrder = prevOrder.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, product.quantity),
              }
            : item
        );
      } else {
        updatedOrder = [
          ...prevOrder,
          {
            productId: product.id,
            quantity: 1,
            unit: product.unit,
            imageUrl: product.imageUrl,
            name: product.name,
            availableQuantity: product.quantity,
          },
        ];
      }

      setSelectedProductIds((prevSelected) =>
        prevSelected.includes(product.id)
          ? prevSelected
          : [...prevSelected, product.id]
      );

      return updatedOrder;
    });
  };

  return (
    <Wrapper>
      <div className="flex md:flex-row flex-col-reverse">
        <div className="md:w-1/3">
          <input
            type="text"
            placeholder="Rechercher un produit"
            className="input input-bordered w-full mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="space-y-4">
            {filteredAvaibleProducts.length > 0 ? (
              filteredAvaibleProducts.map((product, index) => (
                <ProductComponent
                  product={product}
                  key={index}
                  add={true}
                  handleAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <EmptyState
                message="Aucun produit disponible"
                IconComponent="PackageSearch"
              />
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default page;
