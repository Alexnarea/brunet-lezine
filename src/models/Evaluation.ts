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

// ...todo tu código anterior...

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

// 🔷 NUEVO: Interfaces para Dashboard ADMIN
export interface EvaluatorSummaryDto {
  evaluatorName: string;
  childrenCount: number;
}

export interface ChildWithDelayDto {
  childName: string;
  age: number;
  lastEvaluationDate: string;
  coefficient: number;
  evaluatorName: string;
}

export interface AdminDashboardDto {
  evaluators: EvaluatorSummaryDto[];
  childrenWithDelay: ChildWithDelayDto[];
  totalUsers: number;
  totalEvaluators: number;
  totalChildren: number;
  childrenWithSevereDelay: ChildWithDelayDto[];
}

export interface EvaluatorDashboardDto {
  totalChildren: number;
  childrenWithDelay: any[];
  childrenWithSevereDelay: any[];
}
