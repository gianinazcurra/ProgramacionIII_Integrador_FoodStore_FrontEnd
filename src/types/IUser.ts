import type { Rol } from "./Rol";

export interface IUser {
  id: number;
  email: string;
  password: string;
  role: Rol;
}

