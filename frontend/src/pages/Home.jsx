
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchProducts } from "../api/productApi";


export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);


    const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await searchProducts(query);
        setResults(res.data);
        setSearched(true);
      } catch {
        setResults([]);
        setSearched(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="p-6 max-w-xl mx-auto relative">
        <h1 className="text-2xl font-bold mb-4">Search Products</h1>
      <input
        className="border p-2 w-full rounded"
        placeholder="Search product..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}

      />

      {results.length > 0 && (
        <div className="absolute bg-white border w-full mt-1 rounded shadow z-10">
          {results.map(p => (
            <div
              key={p.id}
              onClick={() => navigate(`/products/${p.id}`)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-gray-500 truncate">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      )}


       {/* ADD PRODUCT CTA */}
             {searched && results.length === 0 && (
               <div className="mt-3 p-4 border rounded bg-gray-50 text-center">
                 <p className="text-gray-600 mb-2">
                   Product not found
                 </p>

                 <button
                   onClick={() =>
                     navigate("/add-product", {
                       state: { name: query }
                     })
                   }
                   className="bg-purple-600 text-white px-4 py-2 rounded"
                 >
                    Add Product
                 </button>
               </div>
             )}


    </div>
  );
}

















// frontend/src/pages/Home.jsx
// import React from "react";
// import { Link } from "react-router-dom";
//
// export default function Home() {
//   return (
//     <div className="p-8 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-bold mb-4">Welcome to the Review System</h1>
//
//       <p className="mb-6">
//         This is a simple product review platform where users can add reviews.
//       </p>
//
//       <div className="space-x-4">
//         <Link to="/products" className="bg-blue-600 text-white px-4 py-2 rounded">
//           Browse Products
//         </Link>
//
//
//          <Link to="/add-product" className="bg-purple-600 text-white px-4 py-2 rounded">
//            Add Product
//          </Link>
//
//
//
//       </div>
//
//
//     </div>
//   );
// }
