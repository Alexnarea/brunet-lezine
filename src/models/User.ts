export interface User {
  id: number;
  username: string;
  password?: string; // generalmente no muestras ni editas directamente en frontend
  email: string;
  locked: boolean;
  disabled: boolean;
}

export interface UserPayload {
  username: string;
  password?: string;
  email: string;
  locked?: boolean;
  disabled?: boolean;
}
