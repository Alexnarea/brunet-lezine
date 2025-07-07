import React from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../service/authService";

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // ✅ ahora sí está declarado
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const token = AuthService.getToken();

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Validar rol si se requiere
  if (requiredRole) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const authorities: string = payload["authorities"] || "";

      if (!authorities.includes(requiredRole)) {
        return <Navigate to="/" />;
      }
    } catch (e) {
      console.error("Error al decodificar el token", e);
      return <Navigate to="/login" />;
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;
