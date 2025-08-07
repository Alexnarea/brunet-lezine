import React from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../service/authService";

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[]; // permite múltiples roles
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRoles }) => {
  const token = AuthService.getToken();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const decoded = AuthService.decodeToken(token);
  const rawAuthorities = decoded?.authorities;

  // Convertir authorities a un array, ya sea que venga como string separado por comas o como array
  const userRoles: string[] = Array.isArray(rawAuthorities)
    ? rawAuthorities
    : typeof rawAuthorities === "string"
    ? rawAuthorities.split(",")
    : [];

  // Verificar si tiene al menos uno de los roles requeridos
  if (requiredRoles && requiredRoles.length > 0) {
    const hasPermission = requiredRoles.some(role => userRoles.includes(role));
    if (!hasPermission) {
      return <Navigate to="/" />;
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;
