let products: any[] = [];
let categorias: any[] = [];

const productsContainer = document.getElementById(
  "productsContainer"
) as HTMLDivElement;

const searchInput = document.getElementById(
  "searchInput"
) as HTMLInputElement;

const categorySelect = document.getElementById(
  "categorySelect"
) as HTMLSelectElement;

async function cargarProductos() {
  const response = await fetch("/data/productos.json");
  products = await response.json();

  products = products.filter(product =>
    product.disponible === true && product.eliminado === false
  );

  renderProducts(products);
}

async function cargarCategorias() {
  const response = await fetch("/data/categorias.json");
  categorias = await response.json();

  categorias = categorias.filter(categoria =>
    categoria.eliminado === false
  );

  categorySelect.innerHTML = `
    <option value="0">Todas las categorías</option>
  `;

  categorias.forEach(categoria => {
    categorySelect.innerHTML += `
      <option value="${categoria.id}">
        ${categoria.nombre}
      </option>
    `;
  });
}

const renderProducts = (list = products) => {
  productsContainer.innerHTML = "";

  if (list.length === 0) {
    productsContainer.innerHTML = `
      <p class="sin-resultados">
        No se encontraron productos.
      </p>
    `;
    return;
  }

  list.forEach(product => {
    const card = document.createElement("div");

    card.innerHTML = `
      <article class="producto">
        <img src="${product.imagen}" alt="${product.nombre}">

        <h3>${product.nombre}</h3>

        <p>${product.descripcion}</p>

        <p>Precio: $${product.precio}</p>

        <p>Stock: ${product.stock}</p>

        <button>
          Agregar al carrito
        </button>

        <hr>
      </article>
    `;

    const button = card.querySelector(
      "button"
    ) as HTMLButtonElement;

    button.addEventListener("click", () => {
      const cart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      const existingProduct = cart.find(
        (item: any) => item.id === product.id
      );

      if (existingProduct) {
        existingProduct.cantidad++;
      } else {
        cart.push({
          ...product,
          cantidad: 1
        });
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );

      alert("Producto agregado al carrito");
    });

    productsContainer.appendChild(card);
  });
};

searchInput.addEventListener("input", () => {
  const text = searchInput.value.toLowerCase();

  const filteredProducts = products.filter(product =>
    product.nombre.toLowerCase().includes(text)
  );

  renderProducts(filteredProducts);
});

categorySelect.addEventListener("change", () => {
  const categoriaId = Number(categorySelect.value);

  if (categoriaId === 0) {
    renderProducts(products);
    return;
  }

  const filtrados = products.filter(product =>
    product.categoriaId === categoriaId
  );

  renderProducts(filtrados);
});

cargarCategorias();
cargarProductos();