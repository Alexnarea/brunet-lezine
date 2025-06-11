export interface Evaluator {
  id: number;
  speciality: string;
  fullName: string;
  nui: string;
  phone: string;
  birthdate: string; // o Date, si quieres manejar fecha como objeto
  gender: string;
  userId: number;  // referencia al usuario asignado
}

export interface EvaluatorPayload {
  speciality: string;
  fullName: string;
  nui: string;
  phone: string;
  birthdate: string; // formato ISO, por ejemplo "YYYY-MM-DD"
  gender: string;
  userId: number;
}

export interface User {
  id: number;
  name: string;
}
