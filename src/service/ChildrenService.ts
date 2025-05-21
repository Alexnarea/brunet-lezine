// src/service/ChildrenService.ts
import axios from "axios";
import type { ChildPayload, Children } from "../models/Children";

const BASE_URL = "http://localhost:8082/children";

const childrenService = {
  getAll: async (): Promise<Children[]> => {
    const response = await axios.get(BASE_URL);
    return response.data.data;
  },

  create: async (payload: ChildPayload): Promise<Children> => {
    const response = await axios.post(BASE_URL, payload);
    return response.data.data;
  },

  update: async (id: string, payload: ChildPayload): Promise<Children> => {
    const response = await axios.put(`${BASE_URL}/${id}`, payload);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },
};

export default childrenService;
