import api from "./apiService";
import type { Evaluator, EvaluatorPayload } from "../models/Evaluator";

const BASE_URL = "http://localhost:8082/api/evaluators";

const evaluatorService = {
  getAll: async (): Promise<Evaluator[]> => {
    const response = await api.get(BASE_URL);
    return response.data.data;
  },

  getByUserId: async (userId: number): Promise<Evaluator> => {
    const response = await api.get(`/api/evaluators/by-user-id/${userId}`);
    return response.data.data;
  },

    getByUsername: async (username: string): Promise<Evaluator> => {
    const res = await api.get(`/api/evaluators/by-username`, {
      params: { username }
    });
    return res.data.data;
  },

  create: async (payload: EvaluatorPayload): Promise<Evaluator> => {
    const response = await api.post(BASE_URL, payload);
    return response.data.data;
  },

  update: async (id: number, payload: EvaluatorPayload): Promise<Evaluator> => {
    const response = await api.put(`${BASE_URL}/${id}`, payload);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },
};

export default evaluatorService;
