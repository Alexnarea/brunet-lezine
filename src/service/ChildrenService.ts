// src/service/ChildrenService.ts
import api from "./apiService";
import type { ChildPayload, Children } from "../models/Children";

const BASE_URL = "/children";

const childrenService = {
  getAll: async (): Promise<Children[]> => {
    const response = await api.get(BASE_URL);
    return response.data.data;
  },

  getOne: async (id: string): Promise<Children> => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data.data;
  },

  create: async (payload: ChildPayload): Promise<Children> => {
    const response = await api.post(BASE_URL, payload);
    return response.data.data;
  },

  update: async (id: string, payload: ChildPayload): Promise<Children> => {
    const response = await api.put(`${BASE_URL}/${id}`, payload);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },
};

export default childrenService;
