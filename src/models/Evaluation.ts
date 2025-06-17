export interface EvaluationItem {
  id: string;
  task: string;
  domain: string;
  reinforcement: string;
  completed: boolean;
}

export interface EvaluationPayload {
  id: number;
  application_date: string;
  chronological_age: string;
  children_id: number;
  evaluator_name: string;
  items: EvaluationItem[];
  observaciones: string;
  edadDesarrollo: number;
  coeficiente: number;
  classification: string;
}

export interface Evaluation extends EvaluationPayload {
  created_at: string | number | Date;
    id: number;
  creationDate: string;
}
