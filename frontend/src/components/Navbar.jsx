import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);


  return (
    <nav className="bg-blue-600 text-white px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* LEFT: APP NAME */}
        <Link
          to="/"
          className="text-lg font-bold tracking-wide hover:opacity-90"
        >
          Review System
        </Link>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center space-x-4">
          {user && (
            <Link
              to="/products"
              className="hover:underline"
            >
              Products
            </Link>
          )}

          {user ? (
            <>
              {/* USER NAME */}
              <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">
                Hi, {user .fullName?.split(" ")[0]}
              </span>

              {/* LOGOUT */}
              <button
                onClick={logout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
