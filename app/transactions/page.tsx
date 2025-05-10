"use client";
import { Product, Transaction } from "@/type";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import { getTransactions, readProducts } from "../actions";

const page = () => {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const fetchData = async () => {
    try {
      if (email) {
        const products = await readProducts(email);
        const txs = await getTransactions(email);
        if (products) {
          setProducts(products);
        }
        if (txs) {
          setTransactions(txs);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (email) fetchData();
  }, [email]);

  return (
    <Wrapper>
      <div className="flex justify-between item-center flex-wrap gap-4">
        <div className="flex md:justify-between w-full mb-4 space-x-2 md:space-x-0">
          <div className="">
            <select
              className="select select-bordered md:w-64"
              value={selectedProduct?.id || ""}
              onChange={(e) => {
                const product =
                  products.find((p) => p.id === e.target.value) || null;
                setSelectedProduct(product);
              }}
            >
              <option value="">Tous les produits</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Date de Début"
              className="input input-bordered"
              value={dateFrom}
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = "text";
              }}
              onChange={(e) => setDateFrom(e.target.value)}
            />

            <input
              type="text"
              placeholder="Date de Fin"
              className="input input-bordered"
              value={dateTo}
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = "text";
              }}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default page;
