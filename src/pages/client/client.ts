import { logout } from "../../utils/auth";
import { navigateTo } from "../../utils/navigate";

interface Product {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
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
const products = [
  {
    id: 1,
    nombre: "Hamburguesa Triple Cheddar",
    precio: 2500,
    categoria: "Hamburguesas",
    imagen: "/src/assets/HAMBURGUESA.jpg"
  },
  {
    id: 2,
    nombre: "Hamburguesa Clásica",
    precio: 2500,
    categoria: "Hamburguesas",
    imagen: "/src/assets/hamburguesa-clasica.jpg"
  },
   {
    id: 3,
    nombre: "Hamburguesa Veggie",
    precio: 4200,
    categoria: "Hamburguesas",
    imagen: "/src/assets/Hamburguesas-veganas-de-batata-y-alubias-4.jpg"
  },
  {
    id: 4,
    nombre: "Pizza Muzzarella",
    precio: 8000,
    categoria: "Pizza",
    imagen: "/src/assets/PIZZA.jpg"
  },
   {
    id: 5,
    nombre: "Pizza Especial",
    precio: 12000,
    categoria: "Pizza",
    imagen: "/src/assets/pizza-especial.jpg"
  },
   {
    id: 6,
    nombre: "Pizza Fugazzetta",
    precio: 12000,
    categoria: "Pizza",
    imagen: "/src/assets/fugazzetta.jpg"
  },
  {
    id: 7,
    nombre: "Papas",
    precio: 3000,
    categoria: "Papas",
    imagen: "/src/assets/papasfritas.jpg"
  },
  {
    id: 8,
    nombre: "Papas Cheddar y Bacon",
    precio: 5000,
    categoria: "Papas",
    imagen: "/src/assets/papas.jpg"
  },
  {
    id: 9,
    nombre: "Empanadas",
    precio: 2500,
    categoria: "Empanadas",
    imagen: "/src/assets/Empanadas.jpg"
  },
  {
    id: 10,
    nombre: "Empanadas de Jamón y Queso",
    precio: 2500,
    categoria: "Empanadas",
    imagen: "/src/assets/empanada-jyq.png"
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

let categoriaActual = "Todas";

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
        <button type="button">Agregar al carrito</button>
      `;

      const button = card.querySelector("button") as HTMLButtonElement;

      button.addEventListener("click", () => {
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