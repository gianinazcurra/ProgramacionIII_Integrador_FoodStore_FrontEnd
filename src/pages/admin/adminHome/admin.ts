import { logout } from "../../../utils/auth";
import { navigateTo } from "../../../utils/navigate";

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

//esto deberia moverse a products.ts
const productosTableBody = document.getElementById(
  "productosTableBody"
) as HTMLTableSectionElement;

async function cargarTablaProductos() {
  const response = await fetch("/data/productos.json");
  productos = await response.json();

  renderTablaProductos();
}

function renderTablaProductos() {
  const productosActivos = productos.filter(
    (producto: any) => producto.eliminado === false
  );

  productosTableBody.innerHTML = "";

  productosActivos.forEach((producto: any) => {
    productosTableBody.innerHTML += `
      <tr>
        <td>${producto.id}</td>

        <td>
          <img
            src="${producto.imagen}"
            width="100"
            alt="${producto.nombre}"
          >
        </td>

        <td>${producto.nombre}</td>

        <td>${producto.categoria}</td>

        <td>$${producto.precio}</td>

        <td>${producto.stock}</td>

        <td>
          <button type="button">Editar</button>
          <button type="button">Eliminar</button>
        </td>
      </tr>
    `;
  });
}
let productos: any[] = [];
cargarTablaProductos();

const formProducto = document.getElementById(
  "formProducto"
) as HTMLFormElement;

console.log("Formulario encontrado:", formProducto);

formProducto.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log("Formulario enviado");

  const nombre = (
    document.getElementById("nombre") as HTMLInputElement
  ).value;

  const precio = Number(
    (document.getElementById("precio") as HTMLInputElement).value
  );

  const categoria = (
    document.getElementById("categoria") as HTMLSelectElement
  ).value;

  const stock = Number(
    (document.getElementById("stock") as HTMLInputElement).value
  );

  const nuevoProducto = {
    id: Date.now(),
    nombre,
    precio,
    categoria,
    stock,
    imagen: "/src/assets/HAMBURGUESA.jpg",
    disponible: true,
    eliminado: false,
    categoriaId: 1
  };

  productos.push(nuevoProducto);

  renderTablaProductos();

  formProducto.reset();

  alert("Producto agregado correctamente");
});