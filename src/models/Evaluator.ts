export interface EvaluatorPayload {
  id: number;
  specialization: string;

}

export interface Evaluator extends EvaluatorPayload {
  id: number;
  creationDate: string;
}
