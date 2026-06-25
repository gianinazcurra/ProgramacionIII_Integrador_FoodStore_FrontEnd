import { logout } from "../../../utils/auth";
import { navigateTo } from "../../../utils/navigate";

let categorias: any[] = [];
let categoriaEditandoId: number | null = null;

const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement;

const categoriasTableBody = document.getElementById(
  "categoriasTableBody"
) as HTMLTableSectionElement;

const abrirModalCategoria = document.getElementById(
  "abrirModalCategoria"
) as HTMLButtonElement;

const cerrarModalCategoria = document.getElementById(
  "cerrarModalCategoria"
) as HTMLButtonElement;

const modalCategoria = document.getElementById(
  "modalCategoria"
) as HTMLDivElement;

const tituloModalCategoria = document.getElementById(
  "tituloModalCategoria"
) as HTMLElement;

const formCategoria = document.getElementById(
  "formCategoria"
) as HTMLFormElement;

const nombreInput = document.getElementById("nombre") as HTMLInputElement;
const descripcionInput = document.getElementById("descripcion") as HTMLTextAreaElement;
const imagenInput = document.getElementById("imagen") as HTMLInputElement;

logoutBtn?.addEventListener("click", () => {
  logout();
  navigateTo("/src/pages/auth/login/index.html");
});

async function cargarCategorias() {
  const response = await fetch("/data/categorias.json");
  categorias = await response.json();

  renderTablaCategorias();
}

function renderTablaCategorias() {
  const categoriasActivas = categorias.filter(
    (categoria: any) => categoria.eliminado === false
  );

  categoriasTableBody.innerHTML = "";

  categoriasActivas.forEach((categoria: any) => {
    categoriasTableBody.innerHTML += `
      <tr>
        <td>${categoria.id}</td>
        <td>
          <img src="${categoria.imagen}" width="80" alt="${categoria.nombre}">
        </td>
        <td>${categoria.nombre}</td>
        <td>${categoria.descripcion}</td>
        <td>
          <button type="button" class="editarBtn" data-id="${categoria.id}">
            Editar
          </button>
          <button type="button" class="eliminarBtn" data-id="${categoria.id}">
            Eliminar
          </button>
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
      abrirEditarCategoria(id);
    });
  });

  document.querySelectorAll(".eliminarBtn").forEach((boton) => {
    boton.addEventListener("click", () => {
      const id = Number((boton as HTMLButtonElement).dataset.id);
      eliminarCategoria(id);
    });
  });
}

function abrirNuevaCategoria() {
  categoriaEditandoId = null;
  tituloModalCategoria.textContent = "Nueva Categoría";
  formCategoria.reset();
  modalCategoria.style.display = "block";
}

function abrirEditarCategoria(id: number) {
  const categoria = categorias.find((categoria: any) => categoria.id === id);

  if (!categoria) return;

  categoriaEditandoId = id;
  tituloModalCategoria.textContent = "Editar Categoría";

  nombreInput.value = categoria.nombre;
  descripcionInput.value = categoria.descripcion;
  imagenInput.value = categoria.imagen;

  modalCategoria.style.display = "block";
}

function cerrarModal() {
  categoriaEditandoId = null;
  formCategoria.reset();
  modalCategoria.style.display = "none";
}

function eliminarCategoria(id: number) {
  const confirmar = confirm("¿Seguro que querés eliminar esta categoría?");

  if (!confirmar) return;

  categorias = categorias.map((categoria: any) => {
    if (categoria.id === id) {
      return {
        ...categoria,
        eliminado: true
      };
    }

    return categoria;
  });

  renderTablaCategorias();
  alert("Categoría eliminada correctamente");
}

formCategoria.addEventListener("submit", (e) => {
  e.preventDefault();

  const categoriaFormulario = {
    nombre: nombreInput.value,
    descripcion: descripcionInput.value,
    imagen: imagenInput.value,
    eliminado: false
  };

  if (categoriaEditandoId === null) {
    const nuevaCategoria = {
      id: Date.now(),
      ...categoriaFormulario
    };

    categorias.push(nuevaCategoria);
    alert("Categoría agregada correctamente");
  } else {
    categorias = categorias.map((categoria: any) => {
      if (categoria.id === categoriaEditandoId) {
        return {
          ...categoria,
          ...categoriaFormulario
        };
      }

      return categoria;
    });

    alert("Categoría editada correctamente");
  }

  renderTablaCategorias();
  cerrarModal();
});

abrirModalCategoria.addEventListener("click", abrirNuevaCategoria);
cerrarModalCategoria.addEventListener("click", cerrarModal);

cargarCategorias();