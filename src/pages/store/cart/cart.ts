const cartContainer = document.getElementById("cartContainer") as HTMLDivElement;
const cartResumen = document.getElementById("cartResumen") as HTMLElement;

const getCart = () => {
  return JSON.parse(localStorage.getItem("cart") || "[]");
};

const saveCart = (cart: any[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const renderCart = () => {
  const cart = getCart();

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>El carrito está vacío</p>";
    cartResumen.innerHTML = "";
    return;
  }

  let total = 0;
  cartContainer.innerHTML = "";

  cart.forEach((item: any) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    cartContainer.innerHTML += `
      <div class="cart-item">
        <img src="${item.imagen}" alt="${item.nombre}">
        <h3>${item.nombre}</h3>
        <p>Precio unitario: $${item.precio}</p>

        <button class="decrease" data-id="${item.id}" type="button">-</button>
        <span>Cantidad: ${item.cantidad}</span>
        <button class="increase" data-id="${item.id}" type="button">+</button>

        <p>Subtotal: $${subtotal}</p>
        <hr>
      </div>
    `;
  });

  const envio = total > 0 ? 500 : 0;
  const totalFinal = total + envio;

  cartResumen.innerHTML = `
    <h3>Resumen del pedido</h3>
    <p>Subtotal: $${total}</p>
    <p>Envío: $${envio}</p>
    <hr>
    <h3>Total: $${totalFinal}</h3>

    <button id="procederPagoBtn" type="button">
      Proceder al pago
    </button>

    <button id="vaciarCarritoBtn" class="btn-vaciar" type="button">
  Vaciar carrito
</button>
      Vaciar carrito
    </button>
  `;

  addCartEvents();
};

const addCartEvents = () => {
  const increaseButtons = document.querySelectorAll(".increase");
  const decreaseButtons = document.querySelectorAll(".decrease");
  const vaciarCarritoBtn = document.getElementById("vaciarCarritoBtn");

  increaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number((button as HTMLButtonElement).dataset.id);
      const cart = getCart();

      const product = cart.find((item: any) => item.id === id);

      if (product) {
        product.cantidad++;
      }

      saveCart(cart);
      renderCart();
    });
  });

  decreaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number((button as HTMLButtonElement).dataset.id);
      let cart = getCart();

      const product = cart.find((item: any) => item.id === id);

      if (product) {
        product.cantidad--;

        if (product.cantidad <= 0) {
          cart = cart.filter((item: any) => item.id !== id);
        }
      }

      saveCart(cart);
      renderCart();
    });
  });

  vaciarCarritoBtn?.addEventListener("click", () => {
    localStorage.removeItem("cart");
    renderCart();
  });
};

renderCart();