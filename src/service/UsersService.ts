import axios from "axios";
import type { User, UserPayload } from "../models/User";

const API_URL = "http://localhost:8082/api/users"; 

const getAll = async (): Promise<User[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

const create = async (payload: UserPayload): Promise<User> => {
  const response = await axios.post(API_URL, payload);
  return response.data;
};

const update = async (id: string, payload: Partial<UserPayload>): Promise<User> => {
  const response = await axios.put(`${API_URL}/${id}`, payload);
  return response.data;
};

const del = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

export default {
  getAll,
  create,
  update,
  delete: del,
};
