export interface TestItemPayload {
  domain_id: number;
  description: string;
  reference_age_months: number;
  item_order: number;
}

export interface TestItem extends TestItemPayload {
  id: number;
}
