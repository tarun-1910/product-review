import { createContext, useState, useEffect } from "react";
import { getUserIdFromToken } from "../utils/jwtUtils";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthReady(true);
      return;
    }

    const decoded = getUserIdFromToken();
    // decoded = { userId, email, fullName }

    if (decoded?.userId) {
      setUser({
        userId: decoded.userId,
        email: decoded.email,
        fullName: decoded.fullName
      });
    }

    setAuthReady(true);
  }, []);

  const login = () => {
    const decoded = getUserIdFromToken();

    if (!decoded?.userId) return;

    setUser({
      userId: decoded.userId,
      email: decoded.email,
      fullName: decoded.fullName
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userId: user?.userId ?? null,   // ✅ NUMBER
        email: user?.email ?? null,
        isAuthenticated: !!user,
        authReady,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
