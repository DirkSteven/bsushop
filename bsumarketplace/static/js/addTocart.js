console.log('cart.js loaded');
const cartIcon = document.querySelector("#cartIcon");
const cart = document.querySelector("#cartTab");
const closeCart = document.querySelector("#closeCart");



cartIcon.addEventListener("click", async () => {
    const isLoggedIn = await userIsLoggedIn();

    if (isLoggedIn) {
        cart.classList.add("active");
    } else {
        alert("Please Login to View Cart");
        window.location.href='/login'
    }
});

closeCart.addEventListener("click", () => {
    cart.classList.remove("active");
});

if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", start);
} else {
    start();
}

async function userIsLoggedIn() {
    try {
        const response = await fetch('/check_login_status');
        const data = await response.json();

        if (data.logged_in) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
}

const cartItems = [];


function addItemToCart(productName, size, imageUrl, removeFromCart = true) {
    const selectedProduct = products.find(p => p.name === productName);

    if (!selectedProduct) {
        console.error(`Product with name '${productName}' not found.`);
        return;
    }


    const quantity = 1;



    const cartItem = {
        name: productName,
        price: price,
        imgSrc: imageUrl,  // Pass the image_url directly
        quantity: quantity,
        size: size,
    };

    const existingItem = cartItems.find(item => item.name === productName && item.size === size);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push(cartItem);
    }
    if (removeFromCart) {
        removeItemFromCart(productName, size);
    }
    updateItemCount(1);
    displayTotalPrice();

    // Debugging logs
    console.log('Added item to cart:', cartItem);
    console.log('Updated cart items:', cartItems);

}

function updateCartDisplay() {
    const cartContainer = document.querySelector('.cart-content');
    cartContainer.innerHTML = '';

    cartItems.forEach(item => {
        const cartBox = CartBoxComponent(item.name, item.price, item.imgSrc, item.size, item.quantity);
        cartContainer.innerHTML += cartBox;
    });

    resolve();
}

function removeItemFromCart(productName, size) {
    // Make a request to the server to remove the item from the cart
    fetch('/remove_from_cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productName: productName,
            size: size,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);

        // Update the cart display only if the item was successfully removed
        if (data.success) {
            const indexToRemove = cartItems.findIndex(item => item.name === productName && item.size === size);

            if (indexToRemove !== -1) {
                cartItems.splice(indexToRemove, 1);
                updateCartDisplay();
                updateItemCount();
                displayTotalPrice();
                console.log('Item removed from cart:', { productName, size });

            } else {
                console.error('Error removing item from cart:', 'Item not found in cartItems array');
            }
        } else {
            console.error('Error removing item from cart:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}



function CartBoxComponent(productName, price, imageUrl, size, quantity) {
    console.log('Generated HTML imageUrl:', imageUrl);
    // Replace backslashes with forward slashes in the image URL
    console.log (size)
    
    
    // Calculate the total price for the item
    const totalPrice = (parseFloat(price.replace(/[^0-9.-]+/g, '')) * quantity).toFixed(2);

    // Use getImagePath to get the correct image path
    

    return `
        <div class="prod-box" id="cart-box">
            <input type="checkbox" class="custom-checkbox">
            <img src="${imageUrl}" alt="${productName}" class="cart-img">
            <div class="detail-box">
                <div class="cart-product-title">${productName}</div>
                <div class="cart-price">Price: ${price}</div>
                <div class="cart-size">
                    <label for="cartSize">Size: </label>
                    <div class="cart-size" id="cartSize">${size}</div>
                    
                    
                    
                </div>
                <div class="cart-quantity"> Qty: ${quantity}</div>
                <div class="cart-total">Total: ₱${totalPrice}</div>
            </div>
            <i class='bx bxs-trash-alt cart-remove' onclick="removeItemFromCart('${productName}', '${size}')"></i>
        </div>`;
        console.log('Generated HTML:', generatedHTML);
        return generatedHTML;
}


function start() {
    const cartIcon = document.querySelector("#cartIcon");
    const closeCart = document.querySelector("#closeCart");

    cartIcon.addEventListener("click", () => {
        cart.classList.add("active");
    });

    closeCart.addEventListener("click", () => {
        cart.classList.remove("active");
    });
    const checkboxes = document.querySelectorAll('.custom-checkbox');
    console.log('Number of checkboxes:', checkboxes.length);
    
}

function updateTotal() {
    console.log('Updating total...');

    const totalElement = document.querySelector('.total-price');
    let total = 0;

    cartItems.forEach(item => {
        const numericPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
        total += numericPrice * item.quantity;
    });

    totalElement.textContent = `Total: ₱${total.toFixed(2)}`;
}



let itemCount = 0;

function updateCartDisplay() {
    const cartContainer = document.querySelector('.cart-content');
    cartContainer.innerHTML = ''; // Clear the container before adding new items

    cartItems.forEach(item => {
        const cartBox = CartBoxComponent(item.name, item.price, item.image_url, item.size, item.quantity);
        const cartBoxElement = htmlToElement(cartBox);
        cartContainer.appendChild(cartBoxElement);
    });

    updateTotal();
}

function htmlToElement(html) {
    const template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach((button) => {
        button.addEventListener('click', function () {
            const productName = button.dataset.productName;
            const productPrice = button.dataset.productPrice;
            const size = button.dataset.size; // Assuming size is stored in a 'data-size' attribute
            addItemToCart(productName, size, productPrice); // Pass the size parameter
            const newItem = document.createElement('div');
            newItem.classList.add('cart-item');
            newItem.innerHTML = `
                <span>${productName}</span>
                <span>${productPrice}</span>
            `;
            const cartContent = document.querySelector('.cart-content');
            cartContent.appendChild(newItem);
            const cartCounter = document.getElementById('cart-ctr');
            cartCounter.innerText = parseInt(cartCounter.innerText) + 1;
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Call loadUserCart to fetch cart data from the server
    loadUserCart();
});

function loadUserCart() {
    console.log('Attempting to load user cart...');

    fetch('/get_user_cart')
        .then(response => response.json())
        .then(data => {
            console.log('Received data from server:', data);
            userCarts = data.cartIds || [];

            const newCartItems = data.cartItems || [];

            console.log('New cart items:', newCartItems);

            cartItems.length = 0;

            newCartItems.forEach(item => {
                console.log('Original item:', item);

                // Ensure the first letter is capitalized
                if (item.image_url) {
                    item.image_url = item.image_url.replace(/\\/g, '/').replace(/\/([^\/]*)$/, (_, match) => `/${match.charAt(0).toUpperCase()}${match.slice(1).toLowerCase()}`);
                }

                console.log('Formatted item:', item);
            });

            Array.prototype.push.apply(cartItems, newCartItems);

            console.log('Updated cart items:', cartItems);
            updateItemCount();
            updateCartDisplay();
            
            displayTotalPrice();


            user_cart = newCartItems;
            sessionStorage.setItem('user_cart', JSON.stringify(user_cart));

            console.log('User cart loaded successfully.');
        })
        .catch(error => console.error('Error:', error));
}


function saveOrderToServer(title, price, imgSrc, size, quantity, product_id) {
    fetch('/save_order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productName: title,
            price: price,
            imgSrc: imgSrc,
            size: size,
            quantity: quantity,
            product_id: product_id,  // Add the product_id to the data
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        // Handle the response as needed
    })
    .catch(error => console.error('Error:', error));
    // Count the number of unique items in the cart
    cartItems.forEach(item => {
        const itemIdentifier = `${item.name}-${item.size}`;
        uniqueItems.add(itemIdentifier);
    });

}

function updateItemCount() {
    // Create a Set to store unique item identifiers
    const uniqueItems = new Set();

    cartItems.forEach(item => {
        const itemIdentifier = `${item.name}-${item.size}`;
        uniqueItems.add(itemIdentifier);
    });

    // Update the itemCount based on the number of unique items
    itemCount = uniqueItems.size;

    // Get the element where you want to display the item count
    const itemCountElement = document.querySelector('#cart-ctr');

    // Update the display with the new item count
    itemCountElement.textContent = itemCount;
}
// Function to initialize the cart
function initializeCart() {
    // Use event delegation for checkboxes
    const cartContainer = document.querySelector('.cart-content');

    cartContainer.addEventListener('change', (event) => {
        if (event.target.classList.contains('custom-checkbox')) {
            displayTotalPrice();
        }
    });

    // Call the displayTotalPrice function after updating the cart display
    updateCartDisplay();
    displayTotalPrice();
}
function displayTotalPrice() {
    const cartTotalElement = document.querySelector('.total-price');
    let totalAmount = 0;

    // Get all checkboxes
    const checkboxes = document.querySelectorAll('.custom-checkbox');

    cartItems.forEach((item, index) => {
        // Check if the corresponding checkbox is checked
        if (checkboxes[index].checked) {
            // Calculate the total price for each checked item and add it to the totalAmount
            totalAmount += parseFloat(item.price) * item.quantity;
        }
    });

    // Update the display with the total price
    cartTotalElement.textContent = ` ₱${totalAmount.toFixed(2)}`;
}

// Attach the displayTotalPrice function to the change event of checkboxes
const checkboxes = document.querySelectorAll('.custom-checkbox');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        displayTotalPrice();
    });
});


initializeCart();

console.log('Received data from server:', data);

document.addEventListener('DOMContentLoaded', function () {
    loadUserCart(); // Fetch cart data from the server

loadUserCart();
    // Update cart display and item count after loading the cart data
    updateCartDisplay();
    updateItemCount();
});

document.cookie = 'cart_id=unique_cart_identifier; path=/';

const cartId = document.cookie.split('; ').find(row => row.startsWith('cart_id=')).split('=')[1];




