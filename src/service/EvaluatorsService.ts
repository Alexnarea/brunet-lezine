import axios from "axios";
import type { Evaluator ,EvaluatorPayload  } from "../models/Evaluator";

const BASE_URL = "http://682e7f8a746f8ca4a47d3608.mockapi.io/children/evaluator";

const evaluatorsService = {
  getAll: async (): Promise<Evaluator[]> => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },

  create: async (payload: EvaluatorPayload): Promise<Evaluator> => {
    const response = await axios.post(BASE_URL, payload);
    return response.data;
  },

  update: async (id: string, payload: EvaluatorPayload): Promise<Evaluator> => {
    const response = await axios.put(`${BASE_URL}/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },
};

export default evaluatorsService;
