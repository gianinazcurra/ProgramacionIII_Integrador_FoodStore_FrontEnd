import type { IUser } from "../types/IUser";

export const getUsers = (): IUser[] => {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: IUser[]): void => {
  localStorage.setItem("users", JSON.stringify(users));
};

export const getUserSession = (): IUser | null => {
  const user = localStorage.getItem("userData");
  return user ? JSON.parse(user) : null;
};

export const saveUserSession = (user: IUser): void => {
  localStorage.setItem("userData", JSON.stringify(user));
};

export const logout = (): void => {
  localStorage.removeItem("userData");
};