const cartContainer = document.getElementById("cartContainer") as HTMLDivElement;

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

        <button class="decrease" data-id="${item.id}">-</button>
        <span>Cantidad: ${item.cantidad}</span>
        <button class="increase" data-id="${item.id}">+</button>

        <p>Subtotal: $${subtotal}</p>
        <hr>
      </div>
    `;
  });

  cartContainer.innerHTML += `<h2>Total: $${total}</h2>`;

  addCartEvents();
};

const addCartEvents = () => {
  const increaseButtons = document.querySelectorAll(".increase");
  const decreaseButtons = document.querySelectorAll(".decrease");

  increaseButtons.forEach(button => {
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

  decreaseButtons.forEach(button => {
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
};

renderCart();