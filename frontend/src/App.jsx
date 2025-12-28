import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddReview from "./pages/AddReview.jsx";
import ProductDetails from "./pages/ProductDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import AddProduct from "./pages/AddProduct";



function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={

            <Home />

        } />
        <Route path="/products" element={
              <ProtectedRoute>
                  <Products />
              </ProtectedRoute>
         } />
        <Route path="/products/:productId" element={
           <ProtectedRoute>
            <ProductDetails />

           </ProtectedRoute>
        } />

       <Route path="/products/:productId/review" element={
           <ProtectedRoute>
                <AddReview />
            </ProtectedRoute>
       } />

         <Route
           path="/add-product"
           element={
             <ProtectedRoute>
               <AddProduct />
             </ProtectedRoute>
           }
         />


        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
