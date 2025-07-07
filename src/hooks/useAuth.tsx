import { jwtDecode } from 'jwt-decode';
import AuthService from '../service/authService';

interface JwtPayload {
  authorities: string;
  sub: string;
}

export const useAuth = () => {
  const token = AuthService.getToken();
  if (!token) return { role: null, username: null };

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const role = decoded.authorities; // ejemplo: ROLE_ADMIN o ROLE_EVALUADOR
    const username = decoded.sub;
    return { role, username };
  } catch (err) {
    console.error("Token inválido", err);
    return { role: null, username: null };
  }
};
