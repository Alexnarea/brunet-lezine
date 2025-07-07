// src/service/TestItemService.ts
import type { TestItem, TestItemPayload } from "../models/TestItem";
import api from "./apiService";

const BASE_URL = "http://localhost:8082/api/test-items";

const testItemService = {
  getAll: async (): Promise<TestItem[]> => {
    const response = await api.get(BASE_URL);
    return response.data;  // 🔑 no uses .data.data porque no existe
  },

  getByAge: async (ageInMonths: number): Promise<TestItem[]> => {
    const response = await api.get(`${BASE_URL}/by-age`, {
      params: { age: ageInMonths },
    });
    return response.data;  // igual, el backend devuelve lista directamente
  },

  create: async (payload: TestItemPayload): Promise<TestItem> => {
    const response = await api.post(BASE_URL, payload);
    return response.data;  // tu backend devuelve directamente el objeto
  },

  update: async (id: string, payload: TestItemPayload): Promise<TestItem> => {
    const response = await api.put(`${BASE_URL}/${id}`, payload);
    return response.data;  // lo mismo aquí
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },
};


export default testItemService;
