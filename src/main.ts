import { getUserSession } from "./utils/auth";

const protectRoutes = (): void => {
  const user = getUserSession();
  const path = window.location.pathname;

  const isLoginPage = path.includes("/auth/login/");
  const isRegisterPage = path.includes("/auth/registro/");
  const isAdminPage = path.includes("/admin/");

  if (!user && !isLoginPage && !isRegisterPage) {
    window.location.href = "/src/pages/auth/login/index.html";
    return;
  }

  if (user && isAdminPage && user.role !== "admin") {
    window.location.href = "/src/pages/client/index.html";
  }
};

protectRoutes();