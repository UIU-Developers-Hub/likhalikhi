import React, { createContext, useEffect, useState } from "react";
import { login } from "../services/authenticationsServices.js";

// Create the authentication context
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve user from local storage if available
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Update local storage whenever the user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const loginWithContext = async (credentials) => {
    try {
      const res = await login(credentials);
      console.log("Login response:", res);
      console.log("Login response.data.data:", res.data.data);
      setUser(res.data.data);
      // console.log("User set to:", res.data.data.email);
      return res;
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  };

  const logoutWithContext = () => {
    setUser(null);
    console.log("User logged out");
  };

  const authContextValue = {
    user,
    loginWithContext,
    logoutWithContext,
    setUser,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
