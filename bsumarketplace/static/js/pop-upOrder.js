// Declare a global variable to store selected product information


let selectedProductInfo = null;

function openProductOptionsPopup(name, imageUrl, isUniform, price, description, category, productId) {
    
    const popup = document.getElementById('popup');
    popup.style.display = 'block';

    const productDetails = document.getElementById('productDetails');
    selectedProductInfo = {
        product_id: productId,
        name: name,
        imageUrl: imageUrl,
        price: price || 0,
        description: description || 'No description available',
        quantity: 1,
        variants: [],  // Initialize as an empty array
    };

    console.log('Product Name:', name);
console.log('Product Price:', price);
    // Fetch variant data from the server
    fetch(`/get_variant_data/${productId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Update the variants in selectedProductInfo
        selectedProductInfo.variants = data;
    
        // Debug: Log the received variant data
        console.log('Received Variant Data:', data);
    
        if (selectedProductInfo.variants.length > 0) {
            const firstProductStock = selectedProductInfo.variants[0].stock;
            console.log(`Stock for the first product (${name}): ${firstProductStock}`);
    
            // Check if the first variant has a 'size' property before accessing it
            if (selectedProductInfo.variants[0].hasOwnProperty('size')) {
                const firstProductSize = selectedProductInfo.variants[0].size;
                console.log(`Size for the first product (${name}): ${firstProductSize}`);
            } else {
                console.error(`Size not available for the first product (${name})`);
            }
        } else {
            console.warn('No variants available for the product');
        }
    
    productDetails.innerHTML = `
        <div class="product-info-container">
            <div class="product-details">
                <h3 class="productname">${selectedProductInfo.name}</h3>
                <img src="${selectedProductInfo.imageUrl}" alt="${selectedProductInfo.name}" class="popupImage">
                <p class="description">${selectedProductInfo.description}</p>
            </div>

            <div class="price-quantity">
                <p class="price">₱ ${selectedProductInfo.price}</p>
                
                <label for="size">Size:</label>
                <select id="size" name="size" onchange="updateTotal()">
                    ${selectedProductInfo.variants.map(variant => `<option value="${variant.size}">${variant.size}</option>`).join('')}
                </select>
                
                <p class="stock">Stock: <span id="stockCount">${getStockForSize(selectedProductInfo.variants, selectedProductInfo.variants[0].size)}</span></p>
                
                <label for="quantity">Quantity:</label>
                <input type="number" id="quantity" name="quantity" min="1" value="${selectedProductInfo.quantity}" onchange="updateTotal()">
            </div>

            <p class="total">Total: ₱ <span id="totalPrice">${selectedProductInfo.price}</span></p>
        </div>
        <div class="button-container">
            <button class="cart-button" onclick="addToCart()">Add to Cart</button>
            <button class="buy-now-button" onclick="buyNow()">Buy Now</button>
        </div>
    `;

    // Additional logic for dynamic content based on category
    if (isUniform) {
        // Add specific code for Uniform category
    } else {
        // Add specific code for other categories (UnivMerch, ORGMerch, etc.)
    }



    // Fetch additional data from the server
    fetch(`/get_additional_data/${productId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        // Process the additional data from the server
        console.log('Additional data:', data);
    })
    .catch(error => console.error('Error:', error));

})
.catch(error => {
    console.error('Error fetching variant data:', error);
    // Handle the error (e.g., display an error message to the user)
});


}

function updateTotal() {
    const quantityInput = document.getElementById('quantity');
    const quantity = parseInt(quantityInput.value, 10);
    const price = selectedProductInfo.price;
    
    const total = quantity * price;
    
    // Update the total price in the HTML
    const totalPriceElement = document.getElementById('totalPrice');
    totalPriceElement.textContent = total;
    
    // Update the stock count based on the selected size
    const selectedSize = document.getElementById('size').value;
    const stockCountElement = document.getElementById('stockCount');
    stockCountElement.textContent = getStockForSize(selectedProductInfo.variants, selectedSize);
}


function getStockForSize(variants, selectedSize) {
    const selectedVariant = variants.find(variant => variant.size === selectedSize);
    return selectedVariant ? selectedVariant.stock || 'Not available' : 'Not available';
}

console.log('Selected Product Info:', selectedProductInfo);




function addToCart(name, size) {
    console.log('Adding to cart:', selectedProductInfo.name);
    // Check if the user is logged in
    fetch('/check_login_status', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log('Check Login Status:', data);

        const quantityInput = document.getElementById('quantity');
selectedProductInfo.quantity = parseInt(quantityInput.value, 10);

        if (data.logged_in) {
            // User is logged in, proceed to add to cart
            const cartData = {
                user_id: data.user_id,
                product_id: selectedProductInfo.product_id,
                quantity: selectedProductInfo.quantity,
                selected_size: document.getElementById('size').value,  // Include selected_size
            };
            

            fetch('/add_to_cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cartData),
            })
            .then(response => response.json())
            .then(data => {
                // Process the response from the server
                console.log('Added to Cart:', data);

                // Display flash alert for Item Added to Cart within the popup
                displayFlash('Item Added to Cart', 'success');
                
            })
            .catch(error => console.error('Error:', error));
        } else {
            // User is not logged in, display flash alert within the popup
            displayFlash('Please log in to Add to Cart', 'warning');
        }
    })


    
    .catch(error => console.error('Error:', error));
}

function buyNow() {
    // Existing code for Buy Now...

    // Example: Set up an AJAX request to send data to the server
    fetch('/buy_now', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedProductInfo),
    })
    .then(response => response.json())
    .then(data => {
        // Process the response from the server
        console.log('Buy Now:', data);
    })
    .catch(error => console.error('Error:', error));
}

function displayFlash(message, category) {
    // Create a new flash message element
    const flashMessage = document.createElement('div');
    flashMessage.className = `flash-message ${category}`;
    flashMessage.textContent = message;

    // Append the flash message to the popup
    const popup = document.getElementById('popup');
    popup.appendChild(flashMessage);

    // Automatically remove the flash message after a certain duration (e.g., 5 seconds)
    setTimeout(() => {
        flashMessage.remove();
    }, 200); // Adjust the duration as needed
}

function closePopup_product() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
}