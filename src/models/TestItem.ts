// src/models/TestItem.ts
export interface TestItem {
  id: number;
  domainId: number;
  description: string;
  referenceAgeMonths: number;
  itemOrder: number;
}

export interface TestItemPayload {
  domainId: number;
  description: string;
  referenceAgeMonths: number;
  itemOrder: number;
}
