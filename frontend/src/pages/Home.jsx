
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { searchProducts, getAllProducts } from "../api/productApi";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searched, setSearched] = useState(false);


    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();


    const loadAllProducts = async () => {

        try {
          const res = await getAllProducts();
          setAllProducts(res.data);
        }    catch {
            setAllProducts([]);
        }

    };
    useEffect(() => {
        loadAllProducts();
      }, []);

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
    <div className="p-6 max-w-6xl mx-auto ">
        <h1 className="text-2xl font-bold mb-4">Search Products</h1>
        {/*search */}
      <input
        className="border p-2 w-full rounded"
        placeholder="Search product..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}

      />
        {/*search results*/}
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



         {/* ALL PRODUCTS GRID */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
           {allProducts.map((p) => (
             <div
               key={p.id}
               className="border rounded-lg shadow-sm bg-white overflow-hidden cursor-pointer hover:shadow-md transition"
               onClick={() => navigate(`/products/${p.id}`)}
             >
               {/* IMAGE */}
               <div className="h-40 w-full bg-gray-100 flex items-center justify-center">
                 {p.imageUrl ? (
                   <img
                     src={`http://localhost:8080${p.imageUrl}`}
                     alt={p.name}
                     className="h-full w-full object-contain"
                     loading="lazy"
                   />
                 ) : (
                   <span className="text-gray-400 text-sm">No Image</span>
                 )}
               </div>

               {/* CONTENT */}
               <div className="p-4">
                 <h2 className="font-semibold text-lg truncate mb-1">
                   {p.name}
                 </h2>
                 <p className="text-sm text-gray-600 line-clamp-2">
                   {p.description}
                 </p>
               </div>
             </div>
           ))}
         </div>



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
