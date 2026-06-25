import { logout } from "../../../utils/auth";
import { navigateTo } from "../../../utils/navigate";

let productos: any[] = [];
let categorias: any[] = [];
let productoEditandoId: number | null = null;

const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement;
const productosTableBody = document.getElementById("productosTableBody") as HTMLTableSectionElement;

const abrirModalProducto = document.getElementById("abrirModalProducto") as HTMLButtonElement;
const cerrarModalProducto = document.getElementById("cerrarModalProducto") as HTMLButtonElement;
const modalProducto = document.getElementById("modalProducto") as HTMLDivElement;
const tituloModalProducto = document.getElementById("tituloModalProducto") as HTMLElement;

const formProducto = document.getElementById("formProducto") as HTMLFormElement;
const nombreInput = document.getElementById("nombre") as HTMLInputElement;
const descripcionInput = document.getElementById("descripcion") as HTMLTextAreaElement;
const precioInput = document.getElementById("precio") as HTMLInputElement;
const stockInput = document.getElementById("stock") as HTMLInputElement;
const categoriaInput = document.getElementById("categoria") as HTMLSelectElement;
const imagenInput = document.getElementById("imagen") as HTMLInputElement;
const disponibleInput = document.getElementById("disponible") as HTMLInputElement;

logoutBtn?.addEventListener("click", () => {
  logout();
  navigateTo("/src/pages/auth/login/index.html");
});

async function cargarDatos() {
  const productosResponse = await fetch("/data/productos.json");
  const categoriasResponse = await fetch("/data/categorias.json");

  productos = await productosResponse.json();
  categorias = await categoriasResponse.json();

  cargarSelectCategorias();
  renderTablaProductos();
}

function cargarSelectCategorias() {
  const categoriasActivas = categorias.filter((categoria: any) => categoria.eliminado === false);

  categoriaInput.innerHTML = `<option value="">Seleccionar categoría</option>`;

  categoriasActivas.forEach((categoria: any) => {
    categoriaInput.innerHTML += `
      <option value="${categoria.id}">
        ${categoria.nombre}
      </option>
    `;
  });
}

function obtenerNombreCategoria(categoriaId: number) {
  const categoria = categorias.find((categoria: any) => categoria.id === categoriaId);
  return categoria ? categoria.nombre : "Sin categoría";
}

function renderTablaProductos() {
  const productosActivos = productos.filter((producto: any) => producto.eliminado === false);

  productosTableBody.innerHTML = "";

  productosActivos.forEach((producto: any) => {
    productosTableBody.innerHTML += `
      <tr>
        <td>${producto.id}</td>
        <td><img src="${producto.imagen}" width="80" alt="${producto.nombre}"></td>
        <td>${producto.nombre}</td>
        <td>${producto.descripcion}</td>
        <td>$${producto.precio}</td>
        <td>${obtenerNombreCategoria(producto.categoriaId)}</td>
        <td>${producto.stock}</td>
        <td>${producto.disponible ? "Disponible" : "No disponible"}</td>
        <td>
          <button type="button" class="editarBtn" data-id="${producto.id}">Editar</button>
          <button type="button" class="eliminarBtn" data-id="${producto.id}">Eliminar</button>
        </td>
      </tr>
    `;
  });

  activarBotones();
}

function activarBotones() {
  document.querySelectorAll(".editarBtn").forEach((boton) => {
    boton.addEventListener("click", () => {
      const id = Number((boton as HTMLButtonElement).dataset.id);
      abrirEditarProducto(id);
    });
  });

  document.querySelectorAll(".eliminarBtn").forEach((boton) => {
    boton.addEventListener("click", () => {
      const id = Number((boton as HTMLButtonElement).dataset.id);
      eliminarProducto(id);
    });
  });
}

function abrirNuevoProducto() {
  productoEditandoId = null;
  tituloModalProducto.textContent = "Nuevo Producto";
  formProducto.reset();
  disponibleInput.checked = true;
  modalProducto.style.display = "block";
}

function abrirEditarProducto(id: number) {
  const producto = productos.find((producto: any) => producto.id === id);

  if (!producto) return;

  productoEditandoId = id;
  tituloModalProducto.textContent = "Editar Producto";

  nombreInput.value = producto.nombre;
  descripcionInput.value = producto.descripcion;
  precioInput.value = String(producto.precio);
  stockInput.value = String(producto.stock);
  categoriaInput.value = String(producto.categoriaId);
  imagenInput.value = producto.imagen;
  disponibleInput.checked = producto.disponible;

  modalProducto.style.display = "block";
}

function cerrarModal() {
  productoEditandoId = null;
  formProducto.reset();
  modalProducto.style.display = "none";
}

function eliminarProducto(id: number) {
  const confirmar = confirm("¿Seguro que querés eliminar este producto?");

  if (!confirmar) return;

  productos = productos.map((producto: any) => {
    if (producto.id === id) {
      return {
        ...producto,
        eliminado: true
      };
    }

    return producto;
  });

  renderTablaProductos();
  alert("Producto eliminado correctamente");
}

formProducto.addEventListener("submit", (e) => {
  e.preventDefault();

  const productoFormulario = {
    nombre: nombreInput.value,
    descripcion: descripcionInput.value,
    precio: Number(precioInput.value),
    stock: Number(stockInput.value),
    categoriaId: Number(categoriaInput.value),
    imagen: imagenInput.value,
    disponible: disponibleInput.checked,
    eliminado: false
  };

  if (productoEditandoId === null) {
    const nuevoProducto = {
      id: Date.now(),
      ...productoFormulario
    };

    productos.push(nuevoProducto);
    alert("Producto agregado correctamente");
  } else {
    productos = productos.map((producto: any) => {
      if (producto.id === productoEditandoId) {
        return {
          ...producto,
          ...productoFormulario
        };
      }

      return producto;
    });

    alert("Producto editado correctamente");
  }

  renderTablaProductos();
  cerrarModal();
});

abrirModalProducto.addEventListener("click", abrirNuevoProducto);
cerrarModalProducto.addEventListener("click", cerrarModal);

cargarDatos();