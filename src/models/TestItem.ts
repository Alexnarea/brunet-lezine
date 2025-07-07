// src/models/TestItem.ts
export interface TestItem {
  id: number;
  domainId: number;
  description: string;
  referenceAgeMonths: number;
  itemOrder: number;
  descriptionDomain?: string; // 👈 necesario para mostrar el dominio
  };

export interface TestItemPayload {
  domainId: number;
  description: string;
  referenceAgeMonths: number;
  itemOrder: number;
}
