import axios from 'axios';
import AuthService from './authService';

const api = axios.create({
baseURL: 'https://api.brunetlezinetest.com/api',
  //baseURL: 'http://localhost:8082/api'
});

api.interceptors.request.use((config) => {
  const token = AuthService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
