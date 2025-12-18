import { createContext, useState,useEffect } from "react";
import { getUserIdFromToken } from "../utils/jwtUtils";
import React from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);





   useEffect(() => {
      const token = localStorage.getItem("token");
     // const email = localStorage.getItem("email");

      const userId = getUserIdFromToken();

       if (token && userId) {
          setUser({ userId });
        }

//       if (token && email) {
//         setUser({ email });
//       }
    }, []);



  const login = (email) => {
       localStorage.setItem("email", email);
       setUser({ email });
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
         userId: user?.userId,
         isAuthenticated: !!user,
         login,
         logout
          }}
     >
      {children}
    </AuthContext.Provider>
  );
}
