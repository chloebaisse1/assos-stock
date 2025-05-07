import { Product } from "@/type";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { readProducts } from "../actions";
import ProductComponent from "./ProductComponent";

const Stock = () => {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  const handleProductChange = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product || null);
    setSelectedProductId(productId);
  };

  return (
    <div>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}

      <dialog id="my_modal_stock" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Gestion du stock</h3>
          <p className="py-4">
            Ajoutez des quantités pour les produits disponibles.
          </p>

          <form className="space-y-2">
            <label className="block">Sélectionner un produit</label>
            <select
              value={selectedProductId}
              className="select select-bordered w-full"
              required
              onChange={(e) => handleProductChange(e.target.value)}
            >
              <option value="">Sélectionner un produit</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.categoryName}
                </option>
              ))}
            </select>

            {selectedProduct && <ProductComponent product={selectedProduct} />}
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Stock;
