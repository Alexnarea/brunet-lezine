 export interface EvaluationResultPayload {
  total_months_approved: number;    // e.g., 40.5
  coefficient: number;              // e.g., 95.75
  result_years: string;             // e.g., "3 años, 6 meses"
  result_detail: string;            // e.g., "El niño muestra un desarrollo equivalente a un niño de 4 años"
  classification: string;           // e.g., "Desarrollo adecuado"
}

export interface EvaluationResult extends EvaluationResultPayload {
  id: number;
  creationDate: string;
}
