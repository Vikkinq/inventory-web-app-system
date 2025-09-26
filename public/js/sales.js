const addBtns = document.querySelectorAll(".add-to-cart");
const cartItemsList = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartProfitEl = document.getElementById("cart-profit");
const clearCartBtn = document.getElementById("clear-cart-btn"); // renamed for clarity
const productCards = document.querySelectorAll(".product-card");
const checkoutBtn = document.getElementById("checkout-btn");

const customerPaymentInput = document.getElementById("customer-payment");
const changeAmountEl = document.getElementById("change-amount");

let cart = [];
let total = 0; // make total global
let profit = 0; // make profit global

// Add to cart
addBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const productId = btn.dataset.id;
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    const market = parseFloat(btn.dataset.market);

    let item = cart.find((i) => i.id === productId);
    if (item) {
      item.quantity++;
      item.subtotal = item.quantity * price;
      item.profit = item.quantity * (price - market);
    } else {
      cart.push({
        id: productId,
        name,
        price,
        market,
        quantity: 1,
        subtotal: price,
        profit: price - market,
      });
    }

    renderCart();
  });
});

// Render cart
function renderCart() {
  cartItemsList.innerHTML = "";

  total = 0; // reset global total
  profit = 0; // reset global profit

  cart.forEach((item) => {
    total += item.subtotal;
    profit += item.profit;

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <div>
        <div class="fw-semibold fs-5">${item.name}</div>
        <small class="text-muted fs-6">₱${item.price} x ${item.quantity} = ₱${item.subtotal}</small>
      </div>
      <div class="d-flex align-items-center gap-2">
        <div class="btn-group btn-group-sm" role="group">
          <button class="btn btn-warning btn-minus">-</button>
          <span class="btn btn-light disabled quantity-display">${item.quantity}</span>
          <button class="btn btn-success btn-plus">+</button>
        </div>
        <button class="btn btn-sm btn-outline-danger btn-clear">Clear</button>
      </div>
    `;

    // Plus button
    li.querySelector(".btn-plus").addEventListener("click", () => {
      item.quantity++;
      item.subtotal = item.quantity * item.price;
      item.profit = item.quantity * (item.price - item.market);
      renderCart();
    });

    // Minus button
    li.querySelector(".btn-minus").addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity--;
        item.subtotal = item.quantity * item.price;
        item.profit = item.quantity * (item.price - item.market);
      } else {
        cart = cart.filter((c) => c.id !== item.id);
      }
      renderCart();
    });

    // Clear button
    li.querySelector(".btn-clear").addEventListener("click", () => {
      cart = cart.filter((c) => c.id !== item.id);
      renderCart();
    });

    cartItemsList.appendChild(li);
  });

  cartTotalEl.textContent = total.toFixed(2);
  cartProfitEl.textContent = profit.toFixed(2);

  // Update change whenever cart changes
  updateChange();
}

// Checkout Button Logic
productCards.forEach((card) => {
  card.addEventListener("click", () => {
    const product = {
      id: card.dataset.id,
      name: card.dataset.name,
      price: parseFloat(card.dataset.price),
      market: parseFloat(card.dataset.market),
      stock: parseInt(card.dataset.stock),
      quantity: 1,
      subtotal: parseFloat(card.dataset.price),
      profit: parseFloat(card.dataset.price) - parseFloat(card.dataset.market),
    };

    // If product already in cart, just increase quantity
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity++;
      existing.subtotal = existing.quantity * existing.price;
      existing.profit = existing.quantity * (existing.price - existing.market);
    } else {
      cart.push(product);
    }

    renderCart();
  });
});

checkoutBtn.addEventListener("click", async () => {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const payment = parseFloat(customerPaymentInput.value) || 0;
  if (payment < total) {
    alert("Customer payment is not enough!");
    return;
  }

  const payload = {
    products: cart.map((item) => ({
      id: item.id,
      price: item.price,
      marketPrice: item.market,
      quantity: item.quantity,
    })),
  };

  try {
    const res = await fetch("/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (res.ok) {
      alert(`Sale recorded successfully! Change: ₱${(payment - total).toFixed(2)}`);
      cart = [];
      customerPaymentInput.value = "";
      renderCart();
    } else {
      alert("Error: " + data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong during checkout.");
  }
});

// ✅ Clear all products
clearCartBtn.addEventListener("click", () => {
  cart = [];
  renderCart();
});

function updateChange() {
  const payment = parseFloat(customerPaymentInput.value) || 0;
  const change = payment - total; // now total is global
  changeAmountEl.textContent = "₱" + (change >= 0 ? change.toFixed(2) : "0.00");
}

// Listen for input changes
customerPaymentInput.addEventListener("input", updateChange);

// Also call on cart render to refresh
updateChange();
