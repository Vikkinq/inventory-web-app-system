document.addEventListener("DOMContentLoaded", () => {
  // Add Utang form elements
  const utangBtn = document.getElementById("utang-btn");
  const utangItemsTbody = document.getElementById("utang-items");
  const utangTotal = document.getElementById("utang-total");
  const utangForm = document.getElementById("utang-form");

  // Sales_tab Utang Buttons
  utangBtn.addEventListener("click", () => {
    utangItemsTbody.innerHTML = "";
    utangTotal.textContent = "₱0.00";

    let total = 0;
    cart.forEach((item) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      utangItemsTbody.innerHTML += `
        <tr>
          <td>${item.name}</td>
          <td>₱${item.price}</td>
          <td>${item.quantity}</td>
          <td>₱${subtotal}</td>
        </tr>
      `;
    });

    utangTotal.textContent = `₱${total.toFixed(2)}`;
  });

  // Utang form submit handler
  utangForm.addEventListener("submit", (e) => {
    utangForm.querySelectorAll("input[type=hidden]").forEach((el) => el.remove());

    cart.forEach((item, index) => {
      if (!item.productId) item.productId = item.id || item._id;

      utangForm.insertAdjacentHTML(
        "beforeend",
        `<input type="hidden" name="items[${index}][productId]" value="${item.productId}">
         <input type="hidden" name="items[${index}][quantity]" value="${item.quantity}">`
      );
    });
  });
});
