import { logout } from "../../utils/auth";
import { navigateTo } from "../../utils/navigate";

const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement;

logoutBtn?.addEventListener("click", () => {
  logout();
  navigateTo("/src/pages/auth/login/index.html");
});

async function cargarDashboard() {
  const categoriasResponse = await fetch("/data/categorias.json");
  const productosResponse = await fetch("/data/productos.json");
  const usuariosResponse = await fetch("/data/usuarios.json");
  const pedidosResponse = await fetch("/data/pedidos.json");

  const categorias = await categoriasResponse.json();
  const productos = await productosResponse.json();
  const usuarios = await usuariosResponse.json();
  const pedidos = await pedidosResponse.json();

  const totalCategorias = document.getElementById("totalCategorias") as HTMLElement;
  const totalProductos = document.getElementById("totalProductos") as HTMLElement;
  const totalUsuarios = document.getElementById("totalUsuarios") as HTMLElement;
  const totalPedidos = document.getElementById("totalPedidos") as HTMLElement;

  totalCategorias.textContent = categorias.filter(
    (categoria: any) => categoria.eliminado === false
  ).length.toString();

  totalProductos.textContent = productos.filter(
    (producto: any) => producto.eliminado === false
  ).length.toString();

  totalUsuarios.textContent = usuarios.length.toString();

  totalPedidos.textContent = pedidos.length.toString();
}

cargarDashboard();