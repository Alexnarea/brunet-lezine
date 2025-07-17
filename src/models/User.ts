export interface User {
  id: number;
  username: string;
  password?: string;
  email: string;
  locked: boolean;
  disabled: boolean;
  role: string; // ✅ tipo correcto
}

export interface UserPayload {
  username: string;
  password?: string;
  email: string;
  locked?: boolean;
  disabled?: boolean;
  role: string; // ✅ ya estaba bien
}
