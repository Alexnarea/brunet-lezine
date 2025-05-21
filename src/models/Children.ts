// src/models/Children.ts
export interface ChildPayload {
  fullName: string;
  nui: string;
  birthdate: string;
  gender: string;
}

export interface Children extends ChildPayload {
  id: number;
  creationDate: string;
}
