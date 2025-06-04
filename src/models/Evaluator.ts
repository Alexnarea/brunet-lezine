export interface Evaluator {
  id: number;
  speciality: string;
  userId: number;
}

export interface EvaluatorPayload {
  speciality: string;
  userId: number;
}
