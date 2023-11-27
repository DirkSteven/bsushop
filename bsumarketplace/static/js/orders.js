const ordersIcon = document.querySelector("#ordersIcon");
const order = document.querySelector("#orderTab"); // Ensure this ID matches your HTML
const closeOrder = document.querySelector("#closeOrder");


ordersIcon.addEventListener("click", () => {
    console.log("Icon clicked"); // Check if the icon click event is firing
    fetchOrdersAndUpdateOrderContent();
});

closeOrder.addEventListener("click", () => {
    order.classList.remove("active");
});

// Assuming you have a "Buy Now" button with class "btn-buy"


document.addEventListener('DOMContentLoaded', function () {
    const buyNowButton = document.querySelector(".btn-buy");

    buyNowButton.addEventListener('click', function () {
        // Find all checked checkboxes in the cart
        const checkedCheckboxes = document.querySelectorAll('.custom-checkbox:checked');

        // Prepare an array to store the selected products
        const selectedProducts = [];
        if (checkedCheckboxes.length === 0) {
            // No items selected, display a message to the user
            alert('Please select an item before proceeding.');
            return; // Stop execution if no items are selected
        }
        // Show a confirmation dialog before moving items to the order tab
        const confirmBuyNow = confirm("Are you sure you want to buy the selected items?");
        if (confirmBuyNow) {
            checkedCheckboxes.forEach(checkbox => {
                const cartBox = checkbox.closest('#cart-box');
                const title = cartBox.querySelector('.cart-product-title').textContent;
                // Extract the size value using a regular expression
                const sizeElement = cartBox.querySelector('.cart-size');
                const sizeMatch = sizeElement ? sizeElement.textContent.match(/Size:\s*([\s\S]+)/) : null;
                const size = sizeMatch ? sizeMatch[1].trim() : '';
                const quantity = parseInt(cartBox.querySelector('.cart-quantity').textContent.split(' ')[2]);

                // Add the selected product details to the array
                selectedProducts.push({
                    title: title,
                    size: size,
                    quantity: quantity,
                });
            });

            console.log('Selected Products are', selectedProducts);

            // Make a POST request to the server to store the selected products
            fetch('/buy_now', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ selectedProducts: selectedProducts }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data.message);
                    alert('Order Placed Successfully', 'success');
                    console.log("r")
                    location.reload();
                    order.classList.add("active");
                }) // You can adjust the timeout value if needed
                .catch(error => console.error('Error:', error));

            updateOrderCount();
            updateCartDisplay();
            loadUserCart();
        } else {
            // Handle the case where the user cancels the confirmation
        }
    });
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

    updateOrderCount();
}



function OrderBoxComponent(title, price, imgSrc, size, quantity) {
    console.log('Size:', size);
    const orderSize = size ? `${size}` : 'Size: N/A'; 
    
  
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
    orderBox.addEventListener('click', function() {
        console.log("open")
        openInvoicePopup({
            title: title,
            totalPrice: totalPrice,
            orderSize: orderSize,
            quantity: quantity,
            formattedDate: formattedDate
        });
    });

  
    return orderBox;
  }
  
  let orderCount = 0;

  function updateOrderCount() {
      const orderContent = document.querySelector('.order-content');
      const orderBoxes = orderContent.querySelectorAll('.order-box');
  
      // Update the order count based on the number of order boxes
      orderCount = orderBoxes.length;
  
      // Get the element where you want to display the item count
      const orderCountElement = document.querySelector('#order-ctr');
  
      // Update the display with the new item count
      orderCountElement.textContent = orderCount;
  }
  

document.addEventListener('DOMContentLoaded', function () {
    const viewOrdersButton = document.getElementById('view-orders-btn');
    const orderContent = document.querySelector('.order-content');

    viewOrdersButton.addEventListener('click', function () {
        // Fetch orders from the server and update the order content dynamically
        fetch('/get_orders')
            .then(response => response.json())
            .then(data => {
                // Clear existing order content
                orderContent.innerHTML = '';
    
                // Loop through the fetched orders and create order items
                data.orders.forEach(order => {
                    const orderItem = document.createElement('div');
                    orderItem.classList.add('order-item');
                    orderItem.innerHTML = `
                        <span>Product ID: ${order.product_id}</span>
                        <span>Quantity: ${order.order_quantity}</span>
                        <span>Total: ₱${order.order_total.toFixed(2)}</span>
                        <span>Size: ${order.order_size}</span>
                        <span>Date Purchased: ${order.date_purchase}</span>
                    `;
    
                    // Append the order item to the order content
                    orderContent.appendChild(orderItem);
                });
            })
            .catch(error => console.error('Error fetching orders:', error));
    });
});


function fetchOrdersAndUpdateOrderContent() {
    
    fetch('/get_orders')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server returned status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const orderContent = document.querySelector('.order-content');
            
            orderContent.innerHTML = '';

            
            data.orders.forEach(order => {
                const imagePath = `static/img/${order.product_name}.png`;
                const orderBox = OrderBoxComponent(
                    order.product_name,
                    `₱${order.order_total.toFixed(2)}`,
                    imagePath, 
                    order.order_size,
                    order.order_quantity,
                    order.date_purchase
                );

                
                orderContent.appendChild(orderBox);
            });

            
            order.classList.add("active");
            updateOrderCount();
        })
        .catch(error => {
            
            if (error.message.startsWith('Server returned status: 401')) {
                alert('Please login to view orders');
                window.location.href = '/login';
            } else {
                console.error('Error fetching orders:', error);
            }
        });
}


function initializeOrder() {
 // Fetch orders from the server and update the order content dynamically
 fetch('/get_orders')
 .then(response => {
     if (!response.ok) {
         throw new Error(`Server returned status: ${response.status}`);
     }
     return response.json();
 })
 .then(data => {
     const orderContent = document.querySelector('.order-content');

     orderContent.innerHTML = '';

     data.orders.forEach(order => {
         const imagePath = `static/img/${order.product_name}.png`;
         const orderBox = OrderBoxComponent(
             order.product_name,
             `₱${order.order_total.toFixed(2)}`,
             imagePath,
             order.order_size,
             order.order_quantity,
             order.date_purchase
         );

         orderContent.appendChild(orderBox);
     });

  
     updateOrderCount();
 })
 .catch(error => {
     if (error.message.startsWith('Server returned status: 401')) {
         alert('Please login to view orders');
         window.location.href = '/login';
     } else {
         console.error('Error fetching orders:', error);
     }
 });
}
initializeOrder();