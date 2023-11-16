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
  
    updateOrderCount(1);
});

function addToOrderTab() {
    // Assuming selectedProductInfo is a global variable
    if (!selectedProductInfo) {
        console.error("No selected product information available.");
        return;
    }

    const selectedProduct = products.find(p => p.name === selectedProductInfo.name);

    if (selectedProduct) {
        // Get the quantity from the input field
        const quantityInput = document.getElementById('quantity');
        const quantity = parseInt(quantityInput.value, 10);

        // Get the selected size from the size selection element
        const sizeElement = document.getElementById('size');
        const selectedSize = sizeElement ? sizeElement.value : 'N/A';

        // Determine the price based on whether the product has sizes
        const price = selectedProduct.hasSizes
            ? selectedProduct.sizes[selectedSize].price.toFixed(2)
            : selectedProduct.price.toFixed(2);

        // Create a new order box
        const orderBox = OrderBoxComponent(
            selectedProductInfo.name,
            price,
            selectedProductInfo.imageUrl,
            `Size: ${selectedSize}`,
            quantity
        );

        // Find the order content container in the order tab
        const orderContent = document.querySelector('.order-content');

        // Append the new order box to the order tab
        orderContent.appendChild(orderBox);

        // Optionally, you might want to clear the selectedProductInfo after adding to the order tab
       // selectedProductInfo = null;
        quantityInput.value = 1;
    }

    updateOrderCount(1);
}



function OrderBoxComponent(title, price, imgSrc, size, quantity) {
    const orderSize = size ? `${size}` : 'Size: N/A'; // If size is falsy, set it to 'N/A'
  
    // Ensure the price is properly formatted as a number
    const numericPrice = parseFloat(price.replace(/[^\d.-]/g, ''));
  
    // Calculate total price
    const totalPrice = (numericPrice * quantity).toFixed(2);
  
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
            <div class="order-product-title"> ${title}</div>
            <div class="order-price">Total Price: ₱${totalPrice}</div>
            <div class="order-size"> ${orderSize}</div>
            <div class="order-quantity"> Quantity: ${quantity}</div>
            <div class="order-date"> Order Date: ${formattedDate}</div>
        </div>
        </div>
    `;
  
    return orderBox;
  }
  

let orderCount = 0;

// Function to update the item count
function updateOrderCount(change) {
    // Update the itemCount based on the change value
    orderCount += change;

    // Get the element where you want to display the item count
    const orderCountElement = document.querySelector('#order-ctr');
    
    // Update the display with the new item count
    orderCountElement.textContent = orderCount;
}