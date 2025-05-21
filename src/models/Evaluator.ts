export interface EvaluatorPayload {
  fullName: string;
  specialization: string;
  email: string;
  password: string;
}

export interface Evaluator extends EvaluatorPayload {
  id: number;
  creationDate: string;
}
