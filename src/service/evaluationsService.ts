import axios from "axios";
import type { Evaluation, EvaluationPayload } from "../models/Evaluation";

const BASE_URL = "http://682e7f8a746f8ca4a47d3608.mockapi.io/children/evaluation";

const evaluationService = {
  getAll: async (): Promise<Evaluation[]> => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },

  create: async (payload: EvaluationPayload): Promise<Evaluation> => {
    const response = await axios.post(BASE_URL, payload);
    return response.data;
  },

  update: async (id: number | string, payload: EvaluationPayload): Promise<Evaluation> => {
    const response = await axios.put(`${BASE_URL}/${id}`, payload);
    return response.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },
};

export default evaluationService;
