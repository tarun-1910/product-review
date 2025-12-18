import { useEffect, useState } from "react";
import { getAllProducts } from "../api/productApi";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllProducts()
      .then(res => {
        console.log("API RESPONSE:", res);
        console.log("API DATA:", res.data);
         setProducts(res.data);
      })
      .catch(err => {
        console.error("API ERROR:", err);
        setError("Failed to load products");
      });
  }, []);

  if (error) return <p className="p-6 text-red-600">{error}</p>;

  if (!products || products.length === 0) {
    return <p className="p-6">No products found.</p>;
  }

  return (
    <div className="p-6 grid grid-cols-3 gap-4">
      {products.map(p => (
        <Link
          key={p.id}
          to={`/products/${p.id}`}
          className="border p-4 rounded shadow"
        >
          <h2 className="text-lg font-bold">{p.name}</h2>
          <p>{p.description}</p>
        </Link>
      ))}
    </div>
  );
}
