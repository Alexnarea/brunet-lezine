export interface Evaluator {
  id: number;
  speciality: string;
  fullName: string;
  nui: string;
  phone: string;
  birthdate: string; // formato ISO: 'YYYY-MM-DD'
  gender: string;
  userId: number;  // ID del usuario asignado
}

export interface EvaluatorPayload {
  speciality: string;
  fullName: string;
  nui: string;
  phone: string;
  birthdate: string; // formato ISO: 'YYYY-MM-DD'
  gender: string;
  userId: number;
}

export interface User {
  username(id: number, username: any): void;
  id: number;
  name: string; // username del usuario
}
