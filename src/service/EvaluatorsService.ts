import axios from "axios";
import type { Evaluator ,EvaluatorPayload  } from "../models/Evaluator";

const BASE_URL = "http://localhost:8082/evaluators";

const evaluatorsService = {
  getAll: async (): Promise<Evaluator[]> => {
    const response = await axios.get(BASE_URL);
    return response.data.data;
  },

  create: async (payload: EvaluatorPayload): Promise<Evaluator> => {
    const response = await axios.post(BASE_URL, payload);
    return response.data.data;
  },

  update: async (id: string, payload: EvaluatorPayload): Promise<Evaluator> => {
    const response = await axios.put(`${BASE_URL}/${id}`, payload);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },
};

export default evaluatorsService;
