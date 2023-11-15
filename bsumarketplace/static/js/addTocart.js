console.log('cart.js loaded');
const cartIcon = document.querySelector("#cartIcon");
const cart = document.querySelector("#cartTab");
const closeCart = document.querySelector("#closeCart");

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

// Declare a global variable to store cart items
const cartItems = [];

// Function to add an item to the cart
function addItemToCart(productName, size, imageUrl) {
    // Find the selected product
    const selectedProduct = products.find(p => p.name === productName);

    if (!selectedProduct) {
        console.error(`Product with name '${productName}' not found.`);
        return;
    }

    // Get the quantity from selectedProductInfo
    const quantityInput = document.getElementById('quantity');
    const quantity = parseInt(quantityInput.value, 10);
    selectedProductInfo.quantity = quantity;


    // Determine the price based on whether the product has sizes
    const price = selectedProduct.hasSizes
        ? selectedProduct.sizes[size].price.toFixed(2)
        : selectedProduct.price.toFixed(2);

    const cartItem = {
        title: productName,
        price: `₱${price}`,
        imgSrc: imageUrl,
        size: size,
        quantity: quantity  // Use the quantity from selectedProductInfo
    };

    // Check if the item is already in the cart
    const existingItem = cartItems.find(item => item.title === productName && item.size === size);

    if (existingItem) {
        // If the item is already in the cart, update the quantity
        existingItem.quantity += quantity;
    } else {
        // If the item is not in the cart, add it to the cart
        cartItems.push(cartItem);
    }

    // Optionally, you can update the cart display here
    updateCartDisplay();
    updateItemCount(1);
}
function updateCartDisplay() {
    // Get the cart container
    const cartContainer = document.querySelector('.cart-content');

    // Clear the existing content
    cartContainer.innerHTML = '';

    // Loop through the cart items and append them to the cart container
    cartItems.forEach(item => {
        const cartBox = CartBoxComponent(item.title, item.price, item.imgSrc, item.size, item.quantity, item.hasSizes);
        cartContainer.innerHTML += cartBox;
    });

    // Update the total price in the cart
    updateTotal();
}


// Function to remove an item from the cart
function removeItemFromCart(title, size) {
    // Find the index of the item in the cart
    const index = cartItems.findIndex(item => item.title === title && item.size === size);

    // Remove the item from the cart array
    cartItems.splice(index, 1);

    // Update the cart display
    updateCartDisplay();
    updateItemCount(-1);
}

function CartBoxComponent(title, price, imgSrc, size, quantity) {
    const cartSize = size ? `Size: ${size}` : 'Size: N/A'; // If size is falsy, set it to 'N/A'

    return `
        <div class="prod-box" id="cart-box">
            <input type="checkbox" class="custom-checkbox">
            <img src="${imgSrc}" alt="${title}" class="cart-img">
            <div class="detail-box">
                <div class="cart-product-title">${title}</div>
                <div class="cart-price">${price}</div>
                <div class="cart-size">${cartSize}</div>
                <div class="cart-quantity"> Qty: ${quantity}</div>
            </div>
            <i class='bx bxs-trash-alt cart-remove' onclick="removeItemFromCart('${title}', '${size}')"></i>
        </div>`;
}


// Function to initialize cart-related events
function start() {
    // Add event listeners for opening and closing the cart
    const cartIcon = document.querySelector("#cartIcon");
    const closeCart = document.querySelector("#closeCart");

    cartIcon.addEventListener("click", () => {
        cart.classList.add("active");
    });

    closeCart.addEventListener("click", () => {
        cart.classList.remove("active");
    });

    // Optionally, you can add more initialization code here
}

function updateTotal() {
    const totalElement = document.querySelector('.total-price');

    let total = 0;

    // Calculate the total price based on cart items
    cartItems.forEach(item => {
        const numericPrice = parseFloat(item.price.replace(/[^0-9.-]+/g,"")); // Remove non-numeric characters
        total += numericPrice * item.quantity;
    });

    // Display the total price in the cart
    totalElement.textContent = ` ₱ ${total.toFixed(2)}`;
}


let itemCount = 0;

// Function to update the item count
function updateItemCount(change) {
    // Update the itemCount based on the change value
    itemCount += change;

    // Get the element where you want to display the item count
    const itemCountElement = document.querySelector('#cart-ctr');

    // Update the display with the new item count
    itemCountElement.textContent = itemCount;
}



// Check the document's ready state and call the start function accordingly
if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", start);
} else {
    start();
}
