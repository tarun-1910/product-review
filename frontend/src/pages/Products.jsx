import { useEffect, useState, useContext } from "react";
import { getAllProducts, deleteProduct } from "../api/productApi";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  const loadProducts = () => {
    getAllProducts()
      .then(res => setProducts(res.data))
      .catch(() => setError("Failed to load products"));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ✅ FIXED: accept event + id
  const handleDelete = async (e, id) => {
    e.preventDefault();     // prevent navigation
    e.stopPropagation();   // stop bubbling

    if (!window.confirm("Delete this product?")) return;

    try {
      await deleteProduct(id);
      loadProducts();
    } catch {
      alert("Failed to delete product");
    }
  };

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!products || products.length === 0)
    return <p className="p-6">No products found.</p>;

  return (
    <div className="p-6 grid grid-cols-3 gap-4">
      {products.map(p => (
        <div
          key={p.id}
          className="border rounded-lg shadow-sm bg-white overflow-hidden"
        >
          {/* HEADER (NOT CLICKABLE) */}
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <h2 className="text-lg font-semibold truncate">
              {p.name}
            </h2>

            {isAuthenticated && (
              <button
                onClick={(e) => handleDelete(e, p.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                 Delete
              </button>
            )}
          </div>

          {/* CLICKABLE CONTENT */}
          <Link to={`/products/${p.id}`} className="block">
            {/* IMAGE */}
            <div className="h-40 w-full bg-gray-100 flex items-center justify-center">
              {p.imageUrl ? (
                <img
                  src={`http://localhost:8080${p.imageUrl}`}
                  alt={p.name}
                  className="h-full w-full object-contain"
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : (
                <span className="text-gray-400 text-sm">No Image</span>
              )}
            </div>

            {/* BODY */}
            <div className="p-4">
              <p className="text-gray-700 text-sm max-h-10 overflow-hidden">
                {p.description}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
