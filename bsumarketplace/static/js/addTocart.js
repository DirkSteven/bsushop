const cartIcon = document.querySelector("#cartIcon");
const cart = document.querySelector("#cartTab");
const closeCart = document.querySelector("#closeCart");
const countElement = document.querySelector(".count");
const cartContent = document.querySelector(".cart-content");
const orderContent = document.querySelector(".order-content");
const buyButton = document.querySelector(".btn-buy");
let total =0;


cartIcon.addEventListener("click", () => {
  cart.classList.add("active");
});

closeCart.addEventListener("click", () => {
  cart.classList.remove("active");
});

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}

function start() {
  addEvents();
}

function update() {
  addEvents();
  updateTotal();
}

function addEvents() {
  let cartRemove_btns = document.querySelectorAll(".cart-remove");
  cartRemove_btns.forEach((btn) => {
    btn.addEventListener("click", handle_removeCartItem);
  });

  let cartQuantity_inputs = document.querySelectorAll(".cart-quantity");
  cartQuantity_inputs.forEach((input) => {
    input.addEventListener("change", handle_changeItemQuantity);
  });

  let addCart_btns = document.querySelectorAll(".add-cart");
  addCart_btns.forEach((btn) => {
    btn.addEventListener("click", handle_addCartItem);
  });

  updateCartCount();
}

let cartCount = 0;

function updateCartCount() {
  const countElement = document.querySelector(".count");
  countElement.textContent = cartCount;
}

let itemsAdded = [];

function handle_addCartItem() {
  let product = this.parentElement;
  let title = product.querySelector(".prod_name").innerHTML;
  let price = product.querySelector(".price").innerHTML;
  let imgSrc = product.querySelector(".pic_s").src;

  let newToAdd = {
    title,
    price,
    imgSrc,
  };

  if (itemsAdded.find((el) => el.title == newToAdd.title)) {
    alert("This Item Is Already Exist!");
    return;
  } else {
    itemsAdded.push(newToAdd);
    cartCount++;
    updateCartCount();
  }

  let cartBoxElement = CartBoxComponent(title, price, imgSrc);
  let newNode = document.createElement("div");
  newNode.innerHTML = cartBoxElement;
  const cartContent = cart.querySelector(".cart-content");
  cartContent.appendChild(newNode);

  update();
}

function handle_removeCartItem() {
  this.parentElement.remove();
  itemsAdded = itemsAdded.filter(
    (el) =>
      el.title !=
      this.parentElement.querySelector(".cart-product-title").innerHTML
  );
  cartCount--;
  updateCartCount();
  update();
}

function handle_changeItemQuantity() {
  if (isNaN(this.value) || this.value < 1) {
    this.value = 1;
  }
  this.value = Math.floor(this.value);
  update();
}


function handle_buyOrder() {
  const cartBoxes = document.querySelectorAll(".cart-box");
  const selectedItems = [];

  cartBoxes.forEach((cartBox) => {
    const checkbox = cartBox.querySelector(".custom-checkbox");
    if (checkbox.checked) {
      const title = cartBox.querySelector(".cart-product-title").innerHTML;
      const price = cartBox.querySelector(".cart-price").innerHTML;
      const quantity = cartBox.querySelector(".cart-quantity").value;

      // Decrease the total by the price of the item
      total -= parseFloat(price.replace("$", "")) * quantity;
      selectedItems.push({ title, price, quantity });

      cartBox.remove(); // Remove the item from the cart
    }
  });

  if (selectedItems.length === 0) {
    alert("Please select at least one item to buy.");
    return;
  }

  const totalElement = document.querySelector(".total-price");
  totalElement.innerHTML = "$" + total.toFixed(2);

  // Decrease the cart count by the number of selected items
  cartCount -= selectedItems.length;
  updateCartCount();
}



function updateTotal() {
  const cartBoxes = document.querySelectorAll(".cart-box");
  let total = 0;

  cartBoxes.forEach((cartBox) => {
    let priceElement = cartBox.querySelector(".cart-price");
    let price = parseFloat(priceElement.innerHTML.replace("$", ""));
    let quantity = cartBox.querySelector(".cart-quantity").value;
    total += price * quantity;
  });

  total = total.toFixed(2);
  const totalElement = document.querySelector(".total-price");

  if (cartBoxes.length === 0) {
    totalElement.innerHTML = "$0";
  } else {
    totalElement.innerHTML = "$" + total;
  }
}

function CartBoxComponent(title, price, imgSrc) {
  return `
    <div class="cart-box">
        <input type="checkbox" class="custom-checkbox">
        <img src=${imgSrc} alt="" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <i class='bx bxs-trash-alt cart-remove'></i>
    </div>`;
}

function OrderBoxComponent(title, price, date) {
  return `
      <div class="order-product-title">${title}</div>
      <div class="order-price">${price}</div>
      <div class="order-quantity">${date}</div>
  `;
}

function showOrderTab() {
  const cartTab = document.getElementById("cartTab");
  const orderTab = document.getElementById("orderTab");
  cartTab.style.right = "-100%";
  orderTab.style.right = "0";
  updateTotal();
}

buyButton.addEventListener("click", () => {
  // Get all the cart boxes in the cart tab
  const cartBoxes = cartContent.querySelectorAll(".cart-box");

  // Filter selected items (checkboxes that are checked)
  const selectedItems = Array.from(cartBoxes).filter((cartBox) => {
    const checkbox = cartBox.querySelector(".custom-checkbox");
    return checkbox.checked;
  });

  if (selectedItems.length === 0) {
    alert("Please select at least one item to buy.");
    return;
  }

  selectedItems.forEach((selectedItem) => {
    // Clone the selected item, and remove checkbox, quantity, and trash bin icon
    const orderItem = selectedItem.cloneNode(true);
    const checkbox = orderItem.querySelector(".custom-checkbox");
    const quantity = orderItem.querySelector(".cart-quantity");
    const trashIcon = orderItem.querySelector(".cart-remove");

    if (checkbox) {
      checkbox.remove();
    }

    if (quantity) {
      quantity.remove();
    }

    if (trashIcon) {
      trashIcon.remove();
    }

    orderContent.appendChild(orderItem);
  });


  // Remove the selected items from the cart tab
  selectedItems.forEach((selectedItem) => {
    selectedItem.remove();
  });
});
