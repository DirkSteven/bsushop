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

const cartItems = [];


function addItemToCart(productName, size, imageUrl) {
    const selectedProduct = products.find(p => p.name === productName);

    if (!selectedProduct) {
        console.error(`Product with name '${productName}' not found.`);
        return;
    }

    // const quantityInput = document.getElementById('quantity');
    // const quantity = parseInt(quantityInput.value, 10);
    // selectedProductInfo.quantity = quantity;



    const cartItem = {
        name: productName,
        price: price,
        imgSrc: imageUrl,  // Pass the image_url directly
        quantity: quantity,
        size: size,
    };

    const existingItem = cartItems.find(item => item.name === productName && item.size === size);
    cartItems.push(cartItem);
    updateCartDisplay();
    updateItemCount(quantity);
    updateTotal();

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push(cartItem);
    }

    updateCartDisplay();
    updateItemCount(quantity);


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

    updateTotal();
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
            updateCartDisplay();
            updateItemCount(-1);
        }
    })
    .catch(error => console.error('Error:', error));
}



function CartBoxComponent(productName, price, imageUrl, size, quantity) {
    console.log('Generated HTML imageUrl:', imageUrl);
    // Replace backslashes with forward slashes in the image URL
    
    
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
        loadUserCart();
    });

    closeCart.addEventListener("click", () => {
        cart.classList.remove("active");
    });
    
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

            updateCartDisplay();
            updateItemCount();
            updateTotal();


            user_cart = newCartItems;
            sessionStorage.setItem('user_cart', JSON.stringify(user_cart));

            console.log('User cart loaded successfully.');
        })
        .catch(error => console.error('Error:', error));
}

console.log('Received data from server:', data);


loadUserCart();

document.cookie = 'cart_id=unique_cart_identifier; path=/';

const cartId = document.cookie.split('; ').find(row => row.startsWith('cart_id=')).split('=')[1];





