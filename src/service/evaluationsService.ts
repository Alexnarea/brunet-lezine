import api from "./apiService";
import type {
  Evaluation,
  EvaluationRequest,
  EvaluationResult,
  EvaluationDetail,
  AdminDashboardDto,
  EvaluatorDashboardDto
} from "../models/Evaluation";

const BASE_URL = "/evaluations";

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
  },

  // 🔷 Dashboard para ADMIN
  getAdminDashboard: async (): Promise<AdminDashboardDto> => {
    const response = await api.get(`${BASE_URL}/dashboard/admin`);
    return response.data;
  },

  // 🔷 Dashboard para EVALUATOR
  getEvaluatorDashboardData: async (): Promise<EvaluatorDashboardDto> => {
    const response = await api.get(`${BASE_URL}/dashboard/evaluator`);
    return response.data;
  },

  downloadReport: async (evaluationId: number): Promise<any> => {
    const response = await api.get(`/evaluations/${evaluationId}/report`, {
      responseType: 'blob',
    });
    return response;
  }
};

export default EvaluationsService;
