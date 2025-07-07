import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  sub: string; // username
  authorities: string;
  exp: number;
  iat: number;
  iss: string;
}

export const getDecodedToken = (): DecodedToken | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
};
