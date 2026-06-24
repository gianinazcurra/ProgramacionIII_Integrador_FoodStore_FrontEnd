import { getUserSession } from "../../utils/auth";

const pedidosContainer = document.getElementById(
  "misPedidosContainer"
) as HTMLDivElement;

async function cargarMisPedidos() {

  const usuario = getUserSession();

  if (!usuario) {
    pedidosContainer.innerHTML = `
      <p>No hay usuario logueado.</p>
    `;
    return;
  }

  const response = await fetch("/data/pedidos.json");

  const pedidos = await response.json();
  
console.log("Usuario logueado:", usuario);
console.log("Pedidos:", pedidos);
console.log("ID usuario:", usuario.id, typeof usuario.id);
console.log("ID usuario del pedido:", pedidos[0].idUsuario, typeof pedidos[0].idUsuario);

const misPedidos = pedidos.filter(
  (pedido: any) => Number(pedido.idUsuario) === Number(usuario.id)
);
  if (misPedidos.length === 0) {
    pedidosContainer.innerHTML = `
      <p>No tienes pedidos registrados.</p>
    `;
    return;
  }

  pedidosContainer.innerHTML = "";

  misPedidos.forEach((pedido: any) => {

    pedidosContainer.innerHTML += `
      <div class="pedido-card">

        <h3>Pedido #${pedido.id}</h3>

        <p>
          Fecha:
          ${pedido.fecha}
        </p>

        <p>
          Estado:
          ${pedido.estado}
        </p>

        <p>
          Forma de Pago:
          ${pedido.formaPago}
        </p>

        <p>
          Total:
          $${pedido.total}
        </p>

        <hr>

      </div>
    `;
  });



}

cargarMisPedidos();