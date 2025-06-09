import axios from "axios";
import type { EvaluationResult,EvaluationResultPayload } from "../models/GlobalResul";

const BASE_URL = "https://682e7f8a746f8ca4a47d3608.mockapi.io/children/resultds";

const resultGlobService = {
  getAll: async (): Promise<EvaluationResult[]> => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },

  getById: async (id: string): Promise<EvaluationResult> => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (payload: EvaluationResultPayload): Promise<EvaluationResult> => {
    const response = await axios.post(BASE_URL, payload);
    return response.data;
  },

  update: async (id: string, payload: EvaluationResultPayload): Promise<EvaluationResult> => {
    const response = await axios.put(`${BASE_URL}/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },
};

export default resultGlobService;