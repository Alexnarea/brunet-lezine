import api from "./apiService";
import type { User, UserPayload } from "../models/User";

const API_URL = "http://localhost:8082/api/users";

const getAll = async (): Promise<User[]> => {
  const response = await api.get(API_URL);
  return response.data;
};

const getAvailableForEvaluator = async (): Promise<User[]> => {
  const response = await api.get("/evaluators/available-users");
  return response.data.data;
};

const create = async (payload: UserPayload): Promise<User> => {
  const response = await api.post(API_URL, payload);
  return response.data;
};

const update = async (id: string, payload: Partial<UserPayload>): Promise<User> => {
  const response = await api.put(`${API_URL}/${id}`, payload);
  return response.data;
};

const del = async (id: string): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};

export default {
  getAll,
  getAvailableForEvaluator,
  create,
  update,
  delete: del,
};
