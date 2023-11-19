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
    updateItemCount(quantity);
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
    const cartSize = size ? `${size}` : ' N/A'; // If size is falsy, set it to 'N/A'

    return `
        <div class="prod-box" id="cart-box">
            <input type="checkbox" class="custom-checkbox">
            <img src="${imgSrc}" alt="${title}" class="cart-img">
            <div class="detail-box">
                <div class="cart-product-title">${title}</div>
                <div class="cart-price">${price}</div>
                <div class="cart-size">
                <label for="cartSize">Size: </label>
                <div class="cart-size" id="cartSize">${cartSize}</div>
                </div>
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

function updateItemCount() {
    // Create a Set to store unique item identifiers
    const uniqueItems = new Set();

    // Count the number of unique items in the cart
    cartItems.forEach(item => {
        const itemIdentifier = `${item.title}-${item.size}`;
        uniqueItems.add(itemIdentifier);
    });

    // Update the itemCount based on the number of unique items
    itemCount = uniqueItems.size;

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


document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach((button) => {
        button.addEventListener('click', function () {
            // Retrieve product details from the clicked button or customize as needed
            const productName = button.dataset.productName;
            const productPrice = button.dataset.productPrice;

            // Create a new element to represent the added item
            const newItem = document.createElement('div');
            newItem.classList.add('cart-item');
            newItem.innerHTML = `
                <span>${productName}</span>
                <span>${productPrice}</span>
            `;

            // Append the new item to the cart content
            const cartContent = document.querySelector('.cart-content');
            cartContent.appendChild(newItem);

            // Update the cart count
            const cartCounter = document.getElementById('cart-ctr');
            cartCounter.innerText = parseInt(cartCounter.innerText) + 1;
        });
    });
});



sessionStorage.setItem('user_cart', JSON.stringify(user_cart));

// Retrieve cart data from session storage
const user_cart = JSON.parse(sessionStorage.getItem('user_cart')) || [];


document.cookie = 'cart_id=unique_cart_identifier; path=/';

// Retrieve cart_id from cookies
const cartId = document.cookie.split('; ').find(row => row.startsWith('cart_id=')).split('=')[1];

