// frontend/src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">404 — Page not found</h1>
      <p className="mb-6">The page you are looking for doesn't exist.</p>
      <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded">
        Go back home
      </Link>
    </div>
  );
}
