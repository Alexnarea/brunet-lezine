// src/models/Children.ts
export interface ChildPayload {
  id: number;
  fullName: string;
  nui: string;
  birthdate: string;
  gender: string;
}

export interface Children extends ChildPayload {
  id: number;
  creationDate: string;
}
