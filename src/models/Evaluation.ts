// Representa cada ítem evaluado
export interface EvaluationItem {
  id: number;
  task: string;
  domain: string;
  completed: boolean;
  referenceAgeMonths: number;
}

// Para crear evaluación con respuestas (enviar al backend)
export interface EvaluationRequest {
  childrenId: number;
  chronologicalAgeMonths: number;
  responses: {
    itemId: number;
    passed: boolean;
  }[];
}

// Resultado devuelto después de guardar evaluación
export interface EvaluationResult {
  evaluationId: number;
  totalMonthsApproved: number;
  coefficient: number;
  classification: string;
  resultYears: string;
  resultDetail: string;
}

// Evaluación completa (como se recibe del backend)
export interface Evaluation {
  id: number;
  applicationDate: string;
  chronologicalAgeMonths: number;
  childrenId: number;
  evaluatorId: number;
  edadDesarrollo?: string;
  coefficient?: number; // ✅ corregido
  classification?: string;
  observaciones?: string;
  items: EvaluationItem[];
  creationDate: string;

  // Campos adicionales calculados en el backend
  totalMonthsApproved?: number;
  resultYears?: string;
  resultDetail?: string;
}

// Datos mínimos para guardar una evaluación (por si necesitas separarlo)
export interface EvaluationPayload {
  id?: number;
  applicationDate: string;
  chronologicalAgeMonths: number;
  childrenId: number;
  evaluatorId: number;
  items: {
    itemId: number;
    passed: boolean;
  }[];
  observaciones: string;
  edadDesarrollo: number;
  coefficient: number; // ✅ corregido
  classification: string;
}

export interface EvaluationDetail {
  id: number;
  applicationDate: string;
  chronologicalAgeMonths: number;
  childrenId: number;
  evaluatorId: number;
  coefficient: number;
  classification: string;
  observaciones?: string;
  items: EvaluationItem[];
  resultYears?: string;  // ✅ lo que realmente devuelve el backend
}

