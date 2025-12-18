// frontend/src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Review System</h1>

      <p className="mb-6">
        This is a simple product review platform where users can add reviews.
      </p>

      <div className="space-x-4">
        <Link to="/products" className="bg-blue-600 text-white px-4 py-2 rounded">
          Browse Products
        </Link>

        <Link to="/add-review" className="bg-green-600 text-white px-4 py-2 rounded">
          Add a Review
        </Link>
      </div>


    </div>
  );
}
