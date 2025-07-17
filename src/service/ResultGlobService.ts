import type { EvaluationResult,EvaluationResultPayload } from "../models/GlobalResul";
import api from "./apiService";

const BASE_URL = "/global-results";

const resultGlobService = {
  getAll: async (): Promise<EvaluationResult[]> => {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  getById: async (id: string): Promise<EvaluationResult> => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (payload: EvaluationResultPayload): Promise<EvaluationResult> => {
    const response = await api.post(BASE_URL, payload);
    return response.data;
  },

  update: async (id: string, payload: EvaluationResultPayload): Promise<EvaluationResult> => {
    const response = await api.put(`${BASE_URL}/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },
};

export default resultGlobService;