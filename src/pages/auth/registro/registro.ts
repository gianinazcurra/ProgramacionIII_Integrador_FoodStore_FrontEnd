import { getUsers, saveUsers } from "../../../utils/auth";
import type { IUser } from "../../../types/IUser";
import { navigateTo } from "../../../utils/navigate";

const form = document.getElementById("registerForm") as HTMLFormElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Completá todos los campos");
    return;
  }

  const users = getUsers();
  const exists = users.some((user) => user.email === email);

  if (exists) {
    alert("Ese email ya está registrado");
    return;
  }

  const newUser: IUser = {
    id: Date.now(),
    email,
    password,
    role: "client",
  };

  users.push(newUser);
  saveUsers(users);

  alert("Usuario registrado correctamente");
  navigateTo("/src/pages/auth/login/index.html");
});