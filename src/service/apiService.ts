import axios from "axios";

const api = axios.create({
  baseURL: "http://682e7f8a746f8ca4a47d3608.mockapi.io/children", // URL directamente aquí
  //baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

export default api;
