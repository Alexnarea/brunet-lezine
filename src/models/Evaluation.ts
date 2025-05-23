export interface EvaluationPayload {
  id: number;
  application_date: string;
  chronological_age: string;
  children_id: number;
  evaluator_name: string;
}

export interface Evaluation extends EvaluationPayload {
  id: number;
  creationDate: string;
}

