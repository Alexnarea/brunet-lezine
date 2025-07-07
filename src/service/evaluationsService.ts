//import axios from "axios";
import api from "./apiService";

// src/service/evaluationsService.ts
import type {
  Evaluation,
  EvaluationRequest,
  EvaluationResult,
  EvaluationDetail
} from "../models/Evaluation";

const BASE_URL = "http://localhost:8082/api/evaluations";

const EvaluationsService = {
  getAll: async (): Promise<Evaluation[]> => {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  getOne: async (id: number | string): Promise<Evaluation> => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  getDetail: async (id: number | string): Promise<EvaluationDetail> => {
    const response = await api.get(`${BASE_URL}/${id}/detail`);
    return response.data;
  },

  createWithResponses: async (data: EvaluationRequest): Promise<EvaluationResult> => {
    const response = await api.post(`${BASE_URL}/create-with-responses`, data);
    return response.data;
  },

  update: async (id: number | string, payload: EvaluationRequest): Promise<Evaluation> => {
    const response = await api.put(`${BASE_URL}/${id}`, payload);
    return response.data;
  },

  delete: async (id: number | string): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  }
};

export default EvaluationsService;
