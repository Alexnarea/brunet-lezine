import { jwtDecode } from 'jwt-decode';
import api from './apiService';

interface DecodedToken {
  authorities?: string | string[];
  userId?: number;
  exp?: number;
  [key: string]: any;
}

const AuthService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    const { jwt } = response.data;

    if (jwt) {
      localStorage.setItem('token', jwt);

      const decoded: DecodedToken = jwtDecode(jwt);

      // Procesar roles (authorities puede venir como string separado por comas o como array)
      const rawAuthorities = decoded.authorities;
      let roles: string[] = [];

      if (typeof rawAuthorities === 'string') {
        roles = rawAuthorities.split(',');
      } else if (Array.isArray(rawAuthorities)) {
        roles = rawAuthorities;
      }

      // Guardar los roles como string separado por comas
      localStorage.setItem('role', roles.join(','));

      if (decoded.userId) {
        localStorage.setItem('userId', decoded.userId.toString());
      }
    }

    return jwt;
  },

  logout: () => {
    localStorage.clear(); // Limpia token, roles y userId
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  getRole: (): string[] => {
    const roleStr = localStorage.getItem('role');
    return roleStr ? roleStr.split(',') : [];
  },

  getUserId: (): number | null => {
    const id = localStorage.getItem('userId');
    return id ? parseInt(id) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  decodeToken: (token: string): DecodedToken | null => {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (e) {
      return null;
    }
  }
};

export default AuthService;
