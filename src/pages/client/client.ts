import { logout } from "../../utils/auth";
import { navigateTo } from "../../utils/navigate";

interface Product {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
  descripcion?: string;
}

interface CartProduct extends Product {
  cantidad: number;
}

// LOGOUT
const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement | null;

logoutBtn?.addEventListener("click", () => {
  logout();
  navigateTo("/src/pages/auth/login/index.html");
});

// PRODUCTOS
const products: Product[] = [
  {
    id: 1,
    nombre: "Hamburguesa Triple Cheddar",
    precio: 2500,
    categoria: "Hamburguesas",
    imagen: "/src/assets/HAMBURGUESA.jpg",
    descripcion: "Hamburguesa triple con cheddar, pan artesanal y salsa especial."
  },
  {
    id: 2,
    nombre: "Hamburguesa Clásica",
    precio: 2500,
    categoria: "Hamburguesas",
    imagen: "/src/assets/hamburguesa-clasica.jpg",
    descripcion: "Hamburguesa clásica con carne, lechuga, tomate y queso."
  },
  {
    id: 3,
    nombre: "Hamburguesa Veggie",
    precio: 4200,
    categoria: "Hamburguesas",
    imagen: "/src/assets/Hamburguesas-veganas-de-batata-y-alubias-4.jpg",
    descripcion: "Opción vegetariana preparada con ingredientes frescos."
  },
  {
    id: 4,
    nombre: "Pizza Muzzarella",
    precio: 8000,
    categoria: "Pizza",
    imagen: "/src/assets/PIZZA.jpg",
    descripcion: "Pizza de muzzarella con salsa de tomate y orégano."
  },
  {
    id: 5,
    nombre: "Pizza Especial",
    precio: 12000,
    categoria: "Pizza",
    imagen: "/src/assets/pizza-especial.jpg",
    descripcion: "Pizza especial con jamón, morrones y muzzarella."
  },
  {
    id: 6,
    nombre: "Pizza Fugazzetta",
    precio: 12000,
    categoria: "Pizza",
    imagen: "/src/assets/fugazzetta.jpg",
    descripcion: "Pizza fugazzetta con cebolla y abundante queso."
  },
  {
    id: 7,
    nombre: "Papas",
    precio: 3000,
    categoria: "Papas",
    imagen: "/src/assets/papasfritas.jpg",
    descripcion: "Porción de papas fritas crocantes."
  },
  {
    id: 8,
    nombre: "Papas Cheddar y Bacon",
    precio: 5000,
    categoria: "Papas",
    imagen: "/src/assets/papas.jpg",
    descripcion: "Papas fritas con cheddar y bacon."
  },
  {
    id: 9,
    nombre: "Empanadas",
    precio: 2500,
    categoria: "Empanadas",
    imagen: "/src/assets/Empanadas.jpg",
    descripcion: "Empanadas tradicionales."
  },
  {
    id: 10,
    nombre: "Empanadas de Jamón y Queso",
    precio: 2500,
    categoria: "Empanadas",
    imagen: "/src/assets/empanada-jyq.png",
    descripcion: "Empanadas rellenas de jamón y queso."
  },
];

// ELEMENTOS DEL DOM
const productsContainer = document.getElementById(
  "contenedor-productos"
) as HTMLElement | null;

const searchInput = document.getElementById(
  "searchInput"
) as HTMLInputElement | null;

const listaCategorias = document.getElementById(
  "lista-categorias"
) as HTMLUListElement | null;

const modalDetalleProducto = document.getElementById(
  "modalDetalleProducto"
) as HTMLDivElement | null;

const detalleProductoContainer = document.getElementById(
  "detalleProductoContainer"
) as HTMLDivElement | null;

const cerrarModalProducto = document.getElementById(
  "cerrarModalProducto"
) as HTMLButtonElement | null;

let categoriaActual = "Todas";

const agregarProductoAlCarrito = (product: Product): void => {
  const cart: CartProduct[] = JSON.parse(
    localStorage.getItem("cart") || "[]"
  );

  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.cantidad++;
  } else {
    cart.push({
      ...product,
      cantidad: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Producto agregado al carrito");
};

const abrirModalDetalleProducto = (product: Product): void => {
  if (!modalDetalleProducto || !detalleProductoContainer) {
    return;
  }

  detalleProductoContainer.innerHTML = `
    <article class="detalle-producto">
      <img src="${product.imagen}" alt="${product.nombre}">

      <div>
        <h2>${product.nombre}</h2>
        <p>Categoría: ${product.categoria}</p>
        <p>Precio: $${product.precio}</p>
        <p>${product.descripcion || "Producto disponible en Food Store."}</p>

        <div class="cantidad-detalle">
  <button type="button" id="restarCantidadDetalle">-</button>
  <span id="cantidadDetalle">1</span>
  <button type="button" id="sumarCantidadDetalle">+</button>
</div>

<button type="button" id="agregarDesdeDetalleBtn">
  Agregar al carrito
</button>
        </button>
      </div>
    </article>
  `;

  let cantidadDetalle = 1;

const cantidadDetalleSpan = document.getElementById("cantidadDetalle") as HTMLSpanElement;
const restarCantidadDetalle = document.getElementById("restarCantidadDetalle") as HTMLButtonElement;
const sumarCantidadDetalle = document.getElementById("sumarCantidadDetalle") as HTMLButtonElement;

restarCantidadDetalle.addEventListener("click", () => {
  if (cantidadDetalle > 1) {
    cantidadDetalle--;
    cantidadDetalleSpan.textContent = cantidadDetalle.toString();
  }
});

sumarCantidadDetalle.addEventListener("click", () => {
  cantidadDetalle++;
  cantidadDetalleSpan.textContent = cantidadDetalle.toString();
});
  const agregarDesdeDetalleBtn = document.getElementById(
    "agregarDesdeDetalleBtn"
  ) as HTMLButtonElement;

  agregarDesdeDetalleBtn.addEventListener("click", () => {
    for (let i = 0; i < cantidadDetalle; i++) {
  agregarProductoAlCarrito(product);
}
    modalDetalleProducto.style.display = "none";
  });

  modalDetalleProducto.style.display = "block";
};

cerrarModalProducto?.addEventListener("click", () => {
  if (modalDetalleProducto) {
    modalDetalleProducto.style.display = "none";
  }
});

// VALIDACIÓN BÁSICA
if (!productsContainer || !searchInput || !listaCategorias) {
  console.error("Faltan elementos en el HTML: contenedor-productos, searchInput o lista-categorias");
} else {
  const getFilteredProducts = (): Product[] => {
    const text = searchInput.value.toLowerCase();

    return products.filter((product) => {
      const matchesName = product.nombre.toLowerCase().includes(text);

      const matchesCategory =
        categoriaActual === "Todas" || product.categoria === categoriaActual;

      return matchesName && matchesCategory;
    });
  };

  const renderProducts = (list: Product[] = products): void => {
    productsContainer.innerHTML = "";

    if (list.length === 0) {
      productsContainer.innerHTML = `
        <p>No se encontraron productos.</p>
      `;
      return;
    }

    list.forEach((product) => {
      const card = document.createElement("article");
      card.classList.add("producto");

      card.innerHTML = `
        <img src="${product.imagen}" alt="${product.nombre}">
        <h3>${product.nombre}</h3>
        <p>Categoría: ${product.categoria}</p>
        <p>Precio: $${product.precio}</p>

        <div>
          <button type="button" class="ver-detalle-btn">
            Ver detalle
          </button>

          <button type="button" class="agregar-carrito-btn">
            Agregar al carrito
          </button>
        </div>
      `;

      const buttonDetalle = card.querySelector(
        ".ver-detalle-btn"
      ) as HTMLButtonElement;

      const buttonCarrito = card.querySelector(
        ".agregar-carrito-btn"
      ) as HTMLButtonElement;

      buttonDetalle.addEventListener("click", () => {
        abrirModalDetalleProducto(product);
      });

      buttonCarrito.addEventListener("click", () => {
        agregarProductoAlCarrito(product);
      });

      productsContainer.appendChild(card);
    });
  };

  const renderCategorias = (): void => {
    const categorias = [
      "Todas",
      ...new Set(products.map((product) => product.categoria)),
    ];

    listaCategorias.innerHTML = "";

    categorias.forEach((categoria) => {
      const li = document.createElement("li");

      li.innerHTML = `
        <button
          type="button"
          class="categoria-btn"
          data-categoria="${categoria}"
        >
          ${categoria}
        </button>
      `;

      listaCategorias.appendChild(li);
    });

    const botones = document.querySelectorAll(".categoria-btn");

    botones.forEach((boton) => {
      boton.addEventListener("click", () => {
        const botonHTML = boton as HTMLButtonElement;

        categoriaActual = botonHTML.dataset.categoria || "Todas";

        botones.forEach((b) => b.classList.remove("activo"));
        botonHTML.classList.add("activo");

        renderProducts(getFilteredProducts());
      });
    });
  };

  searchInput.addEventListener("input", () => {
    renderProducts(getFilteredProducts());
  });

  renderCategorias();
  renderProducts();
}