// src/utils/PrivateRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const PrivateRoute = ({ element, ...rest }) => {
  const { user } = useContext(AuthContext);
  return user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
