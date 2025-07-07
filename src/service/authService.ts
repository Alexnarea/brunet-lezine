import { jwtDecode } from 'jwt-decode';
import api from './apiService';

const AuthService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    const { jwt } = response.data;
    if (jwt) {
      localStorage.setItem('token', jwt);
    }
    return jwt;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  decodeToken: (token: string) => {
    try {
      return jwtDecode<{ authorities: string }>(token);
    } catch (e) {
      return null;
    }
  }
};

export default AuthService;
