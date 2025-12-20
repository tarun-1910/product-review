import { createContext, useState,useEffect } from "react";
import { getUserIdFromToken } from "../utils/jwtUtils";
import React from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);





   useEffect(() => {
      const token = localStorage.getItem("token");
      // console.log("TOKEN ON REFRESH:", token);

      const userId = getUserIdFromToken();
      //console.log("USER FROM TOKEN:", userId);

       if (token && userId) {
          setUser({ userId });
        }


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
