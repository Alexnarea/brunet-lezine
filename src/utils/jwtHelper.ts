import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  sub: string;  // Aquí normalmente está el username
  authorities: string;
  // agrega otros campos si tu token los tiene
}

export function getCurrentUserFromToken(): TokenPayload | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded;
  } catch (error) {
    console.error("Token inválido", error);
    return null;
  }
}
