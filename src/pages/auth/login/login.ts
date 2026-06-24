import { saveUserSession } from "../../../utils/auth";
import { navigateTo } from "../../../utils/navigate";

const form = document.getElementById("loginForm") as HTMLFormElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const response = await fetch("/data/usuarios.json");
  const users = await response.json();

  const user = users.find(
    (u: any) => u.email === email && u.password === password
  );

  if (!user) {
    alert("Email o contraseña incorrectos");
    return;
  }

  saveUserSession(user);

  if (user.role === "admin") {
    navigateTo("/src/pages/admin/index.html");
  } else {
    navigateTo("/src/pages/client/index.html");
  }
});