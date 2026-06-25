import { logout } from "../../../utils/auth";
import { navigateTo } from "../../../utils/navigate";

let pedidos: any[] = [];
let usuarios: any[] = [];
let productos: any[] = [];
let pedidoSeleccionadoId: number | null = null;

const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement;
const pedidosContainer = document.getElementById("pedidosContainer") as HTMLElement;
const filtroEstado = document.getElementById("filtroEstado") as HTMLSelectElement;

const modalPedido = document.getElementById("modalPedido") as HTMLDivElement;
const detallePedido = document.getElementById("detallePedido") as HTMLElement;
const estadoPedido = document.getElementById("estadoPedido") as HTMLSelectElement;
const guardarEstadoPedido = document.getElementById("guardarEstadoPedido") as HTMLButtonElement;
const cerrarModalPedido = document.getElementById("cerrarModalPedido") as HTMLButtonElement;

logoutBtn?.addEventListener("click", () => {
  logout();
  navigateTo("/src/pages/auth/login/index.html");
});

async function cargarDatos() {
  const pedidosResponse = await fetch("/data/pedidos.json");
  const usuariosResponse = await fetch("/data/usuarios.json");
  const productosResponse = await fetch("/data/productos.json");

  pedidos = await pedidosResponse.json();
  usuarios = await usuariosResponse.json();
  productos = await productosResponse.json();

  pedidos.sort((a: any, b: any) => {
    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
  });

  renderPedidos();
}

function obtenerNombreUsuario(idUsuario: number) {
  const usuario = usuarios.find((usuario: any) => usuario.id === idUsuario);

  if (!usuario) return "Cliente no encontrado";

  if (usuario.nombre && usuario.apellido) {
    return `${usuario.nombre} ${usuario.apellido}`;
  }

  return usuario.email;
}
function obtenerNombreProducto(idProducto: number) {
  const producto = productos.find((producto: any) => producto.id === idProducto);

  if (!producto) return "Producto no encontrado";

  return producto.nombre;
}

function renderPedidos() {
  const estadoSeleccionado = filtroEstado.value;

  let pedidosFiltrados = pedidos;

  if (estadoSeleccionado !== "TODOS") {
    pedidosFiltrados = pedidos.filter(
      (pedido: any) => pedido.estado === estadoSeleccionado
    );
  }

  pedidosContainer.innerHTML = "";

  if (pedidosFiltrados.length === 0) {
    pedidosContainer.innerHTML = "<p>No hay pedidos para mostrar.</p>";
    return;
  }

  pedidosFiltrados.forEach((pedido: any) => {
    const cantidadProductos = pedido.detalles.reduce(
      (total: number, detalle: any) => total + detalle.cantidad,
      0
    );

    pedidosContainer.innerHTML += `
      <article style="border:1px solid black; padding:10px; margin-bottom:10px;">
        <h3>Pedido #${pedido.id}</h3>
        <p>Cliente: ${obtenerNombreUsuario(pedido.idUsuario)}</p>
        <p>Fecha: ${pedido.fecha}</p>
        <p>Estado: ${pedido.estado}</p>
        <p>Cantidad de productos: ${cantidadProductos}</p>
        <p>Total: $${pedido.total}</p>

        <button type="button" class="verDetalleBtn" data-id="${pedido.id}">
          Ver Detalle
        </button>
      </article>
    `;
  });

  activarBotonesDetalle();
}

function activarBotonesDetalle() {
  document.querySelectorAll(".verDetalleBtn").forEach((boton) => {
    boton.addEventListener("click", () => {
      const id = Number((boton as HTMLButtonElement).dataset.id);
      abrirDetallePedido(id);
    });
  });
}

function abrirDetallePedido(id: number) {
  const pedido = pedidos.find((pedido: any) => pedido.id === id);

  if (!pedido) return;

  pedidoSeleccionadoId = id;
  estadoPedido.value = pedido.estado;

  let productosHtml = "";

  pedido.detalles.forEach((detalle: any) => {
    productosHtml += `
      <li>
        ${obtenerNombreProducto(detalle.idProducto)}
        - Cantidad: ${detalle.cantidad}
        - Subtotal: $${detalle.subtotal}
      </li>
    `;
  });

  detallePedido.innerHTML = `
    <p><strong>Pedido:</strong> #${pedido.id}</p>
    <p><strong>Cliente:</strong> ${obtenerNombreUsuario(pedido.idUsuario)}</p>
    <p><strong>Fecha:</strong> ${pedido.fecha}</p>
    <p><strong>Estado actual:</strong> ${pedido.estado}</p>
    <p><strong>Forma de pago:</strong> ${pedido.formaPago}</p>

    <h4>Productos</h4>
    <ul>
      ${productosHtml}
    </ul>

    <p><strong>Total:</strong> $${pedido.total}</p>
  `;

  modalPedido.style.display = "block";
}

guardarEstadoPedido.addEventListener("click", () => {
  if (pedidoSeleccionadoId === null) return;

  pedidos = pedidos.map((pedido: any) => {
    if (pedido.id === pedidoSeleccionadoId) {
      return {
        ...pedido,
        estado: estadoPedido.value
      };
    }

    return pedido;
  });

  renderPedidos();

  alert("Estado del pedido actualizado correctamente");

  modalPedido.style.display = "none";
  pedidoSeleccionadoId = null;
});

cerrarModalPedido.addEventListener("click", () => {
  modalPedido.style.display = "none";
  pedidoSeleccionadoId = null;
});

filtroEstado.addEventListener("change", renderPedidos);

cargarDatos();