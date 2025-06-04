// src/service/TestItemService.ts
import axios from "axios";
import type { TestItem, TestItemPayload } from "../models/TestItem";

const BASE_URL = "http://localhost:8082/api/test-items";

const testItemService = {
  getAll: async (): Promise<TestItem[]> => {
    const response = await axios.get(BASE_URL);
    return response.data.data;
  },

  create: async (payload: TestItemPayload): Promise<TestItem> => {
    const response = await axios.post(BASE_URL, payload);
    return response.data.data;
  },

  update: async (id: string, payload: TestItemPayload): Promise<TestItem> => {
    const response = await axios.put(`${BASE_URL}/${id}`, payload);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },
};

export default testItemService;
