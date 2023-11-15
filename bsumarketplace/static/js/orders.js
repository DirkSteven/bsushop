const ordersIcon = document.querySelector("#ordersIcon");
const order = document.querySelector("#orderTab"); // Ensure this ID matches your HTML
const closeOrder = document.querySelector("#closeOrder");

ordersIcon.addEventListener("click", () => {
    order.classList.add("active");
});

closeOrder.addEventListener("click", () => {
    order.classList.remove("active");
});

// Assuming you have a "Buy Now" button with class "btn-buy"
const buyNowButton = document.querySelector(".btn-buy");

buyNowButton.addEventListener("click", () => {
    // Find all checked checkboxes in the cart
    const checkedCheckboxes = document.querySelectorAll('.custom-checkbox:checked');

    // Move checked items to the order tab
    checkedCheckboxes.forEach(checkbox => {
        const cartBox = checkbox.closest('#cart-box');
        const cartContainer = document.querySelector('.cart-content'); // Assuming this is the cart container

        // Get item details from the cart box
        const title = cartBox.querySelector('.cart-product-title').textContent;
        const price = cartBox.querySelector('.cart-price').textContent;
        const imgSrc = cartBox.querySelector('.cart-img').getAttribute('src');
        const size = cartBox.querySelector('.cart-size').textContent;
        const quantity = parseInt(cartBox.querySelector('.cart-quantity').textContent.split(' ')[2]); // Extract quantity

        // Add the item to the order tab
        const orderBox = OrderBoxComponent(title, price, imgSrc, size, quantity);
        order.querySelector('.order-content').appendChild(orderBox);

        // Remove the item from the cart
        removeItemFromCart(title, size);
    });

    // Close the cart after moving items to the order tab
    order.classList.remove("active");
});

function addToOrderTab() {
  const selectedProduct = products.find(p => p.name === selectedProductInfo.name);

  if (selectedProduct) {
      const title = selectedProductInfo.name;
      const price = selectedProduct.hasSizes ? selectedProductInfo.price : selectedProduct.price.toFixed(2);
      const imgSrc = selectedProductInfo.imageUrl;
      const size = selectedProduct.hasSizes ? selectedProductInfo.size : 'N/A';
      const quantity = selectedProductInfo.quantity;

      // Add the item to the order tab
      const orderBox = OrderBoxComponent(title, price, imgSrc, size, quantity);
      order.querySelector('.order-content').appendChild(orderBox);

      // Optionally, you might want to clear the selectedProductInfo after adding to the order tab
      selectedProductInfo = null;

      // Close the popup or perform any other necessary actions
      closePopup();
  }
}
function OrderBoxComponent(title, price, imgSrc, size, quantity) {
  const orderSize = size ? `${size}` : 'N/A'; // If size is falsy, set it to 'N/A'

  // Calculate total price
  const totalPrice = (parseFloat(price.replace(/[^0-9.-]+/g,"")) * quantity).toFixed(2);

  // Get the current date and time
  const currentDate = new Date();
  const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString(undefined, options);

  const orderBox = document.createElement('div');
  orderBox.classList.add('order-box');

  orderBox.innerHTML = `
      <div class="prod-box" id="orderbox">
      <img src="${imgSrc}" alt="${title}" class="order-img">
      <div class="detail-box" id="detail-order">
          <div class="order-product-title">Item: ${title}</div>
          <div class="order-price">Total Price: ₱${totalPrice}</div>
          <div class="order-size">${orderSize}</div>
          <div class="order-quantity"> Quantity: ${quantity}</div>
          <div class="order-date"> Order Date: ${formattedDate}</div>
      </div>
      </div>
  `;

  return orderBox;
}

