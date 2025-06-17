// src/models/Children.ts
export interface ChildPayload {
  fullName: string;
  nui: string;
  birthdate: string;
  gender: string;
}

export interface Children extends ChildPayload {
  name: any;
  id: number;
  creationDate?: string;
}