// Declare a global variable to store selected product information
let selectedProductInfo = null;
const products = [
    {
        name: 'Polo',
        sizes: {
            'XS': { price: 100.00, stock: 8 },
            'S': { price: 200.00, stock: 15 },
            'M': { price: 300.00, stock: 20 },
            'L': { price: 400.00, stock: 10 },
            'XL': { price: 500.00, stock: 5 }
        },
        hasSizes: true
    },
    {
        name: 'Pants',
        sizes: {
            'XS': { price: 300.39, stock: 8 },
            'S': { price: 400.99, stock: 15 },
            'M': { price: 500.19, stock: 20 },
            'L': { price: 600.29, stock: 10 },
            'XL': { price: 700.99, stock: 5 }
        },
        hasSizes: true
    },
    {
        name: 'Blouse',
        sizes: {
            'XS': { price: 100.00, stock: 8 },
            'S': { price: 200.00, stock: 15 },
            'M': { price: 300.00, stock: 20 },
            'L': { price: 400.00, stock: 10 },
            'XL': { price: 500.00, stock: 5 }
        },
        hasSizes: true
    },
    {
        name: 'Skirt',
        sizes: {
            'XS': { price: 300.39, stock: 8 },
            'S': { price: 400.99, stock: 15 },
            'M': { price: 500.19, stock: 20 },
            'L': { price: 600.29, stock: 10 },
            'XL': { price: 700.99, stock: 5 }
        },
        hasSizes: true
    },
    {
        name: 'PE Pants',
        sizes: {
            'XS': { price: 500.39, stock: 8 },
            'S': { price: 550.99, stock: 15 },
            'M': { price: 600.19, stock: 20 },
            'L': { price: 650.29, stock: 10 },
            'XL': { price: 750.99, stock: 5 }
        },
        hasSizes: true
    },
    {
        name: 'PE Shirt',
        sizes: {
            'XS': { price: 350.99, stock: 8 },
            'S': { price: 400.99, stock: 15 },
            'M': { price: 450.99, stock: 20 },
            'L': { price: 500.99, stock: 10 },
            'XL': { price: 600.99, stock: 5 }
        },
        hasSizes: true
    },

    //University Merch
    {
        name: 'Tumbler',
        price: 500.00,
        stock: 12,
        hasSizes: false
    },
    {
        name: 'Umbrella',
        price: 299.99,
        stock: 18,
        hasSizes: false
    },
    {
        name: 'Shot Glass',
        price: 159.99,
        stock: 15,
        hasSizes: false
    },
    {
        name: 'Coffee Mug',
        price: 119.99,
        stock: 19,
        hasSizes: false
    },
    {
        name: 'Notepad',
        price: 100.00,
        stock: 12,
        hasSizes: false
    },
    {
        name: 'Bucket Hat',
        price: 400.79,
        stock: 16,
        hasSizes: false
    },
     //Organizational Merch
     {
        name: 'ACES',
        sizes: {
            'XS': { price: 350.99, stock: 8 },
            'S': { price: 400.99, stock: 15 },
            'M': { price: 450.99, stock: 20 },
            'L': { price: 500.99, stock: 10 },
            'XL': { price: 600.99, stock: 5 }
        },
        hasSizes: true
    },
    {
        name: 'ACES 2.0',
        sizes: {
            'XS': { price: 350.99, stock: 8 },
            'S': { price: 400.99, stock: 15 },
            'M': { price: 450.99, stock: 20 },
            'L': { price: 500.99, stock: 10 },
            'XL': { price: 600.99, stock: 5 }
        },
        hasSizes: true
    },
    {
        name: 'CAFAD',
        sizes: {
            'XS': { price: 350.99, stock: 8 },
            'S': { price: 400.99, stock: 15 },
            'M': { price: 450.99, stock: 20 },
            'L': { price: 500.99, stock: 10 },
            'XL': { price: 600.99, stock: 5 }
        },
        hasSizes: true
    },
    {
        name: 'CHEO',
        sizes: {
            'XS': { price: 350.99, stock: 8 },
            'S': { price: 400.99, stock: 15 },
            'M': { price: 450.99, stock: 20 },
            'L': { price: 500.99, stock: 10 },
            'XL': { price: 600.99, stock: 5 }
        },
        hasSizes: true
    },
    {
        name: 'CICS',
        sizes: {
            'XS': { price: 350.99, stock: 8 },
            'S': { price: 400.99, stock: 15 },
            'M': { price: 450.99, stock: 20 },
            'L': { price: 500.99, stock: 10 },
            'XL': { price: 600.99, stock: 5 }
        },
        hasSizes: true
    },
    {
        name: 'Tote Bag',
        price: 400.79,
        stock: 16,
        hasSizes: false
    }
];

function openProductOptionsPopup(productName, imageUrl, hasSizes) {
    console.log('Function called');
    const popup = document.getElementById('popup');
    popup.style.display = 'block';

    const productDetails = document.getElementById('productDetails');
    const quantitySectionStyle = hasSizes ? 'display: none;' : 'display: block;';
    const productClass = hasSizes ? 'product-with-sizes' : 'product-without-sizes';

    // Find the selected product
    const selectedProduct = products.find(p => p.name === productName);

    selectedProductInfo = {
        name: productName,
        price: hasSizes ? '' : selectedProduct.price.toFixed(2),
        size: '',  // This will be updated when the user selects a size
        quantity: '',
        imageUrl: imageUrl,  // Store the image URL
    };

    productDetails.innerHTML = `
    <h3 class="productname">${productName}</h3>
    ${hasSizes ? 
        `<div id="sizeSection">
            <label for="size">Size:</label>
            <select id="size" onchange="updateStockAndSize('${productName}')">
                <option value="default">Select Size</option>
                <option value="XS">Extra Small</option>
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
                <option value="XL">Extra Large</option>
            </select>
        </div>` : ''}
    <div id="priceSection">
        <p id="productPrice" class="${hasSizes ? 'product-with-sizes' : 'product-without-sizes'}">
        ${hasSizes ? '' : selectedProduct.price.toFixed(2)}
        </p>
    </div>
    <div id="errorMessage" class="error-message"></div>
    <div id="stockSection" class="${hasSizes ? 'product-with-sizes' : 'product-without-sizes'}">
        <p id="stockInfo">Available Stock: ${hasSizes ? '' : selectedProduct.stock}</p>
    </div>
    <div id="quantitySection" style="${quantitySectionStyle}" class="${productClass}">
        <label for="quantity">Quantity:</label>
        <input type="number" value="1" class="quantity" id="quantity" min="1" max="${hasSizes ? '' : selectedProduct.stock}">
    </div>
    <div id="buttonsSection" class="${productClass}">
    <button id="BUY_button_${productName}" class="buy-button product-button" onclick="toggleButton('BUY_NOW', '${productName}')">
        <img src="/static/img/BUY.png" alt="BUY Button" class="button-image">
    </button>
    <button id="Add_to_Cart_button_${productName}" class="add-to-cart-button product-button" onclick="toggleButton('Add_to_Cart', '${productName}')">
        <img src="/static/img/Add_to_Cart.png" alt="Add to Cart Button" class="button-image">
    </button>
    </div>

`;
    const popupImage = document.getElementById('popupImage');
    popupImage.src = imageUrl;
    updateStockAndSize(productName);
}

function updateStockAndSize(productName) {
    const selectedSizeElement = document.getElementById('size');
    const selectedSize = selectedSizeElement ? selectedSizeElement.value : 'default';
    const stockInfo = document.getElementById('stockInfo');
    const productPrice = document.getElementById('productPrice');
    const quantityInput = document.getElementById('quantity');
    const quantitySection = document.getElementById('quantitySection');
    const selectedProduct = products.find(p => p.name === productName);
    const errorMessage = document.getElementById('errorMessage'); 

    // Hide the error message initially
    errorMessage.style.display = 'none';

    selectedProductInfo.size = selectedSize !== 'default' ? selectedSize : '';

    if (selectedProduct.hasSizes) {
        if (selectedSize !== 'default') {
            const { price, stock } = selectedProduct.sizes[selectedSize];
            productPrice.textContent = ` ₱ ${price.toFixed(2)}`;
            stockInfo.textContent = `Available Stock: ${stock}`;
            quantityInput.max = stock;

            // Show the quantity section when a size is selected
            quantitySection.style.display = 'block';

            // Update the quantity in selectedProductInfo
            const quantity = parseInt(quantityInput.value, 10);
            selectedProductInfo.quantity = quantity;
        } else {
            // When "Select Size" is clicked, hide the quantity section and reset values
            productPrice.textContent = '₱ 0';
            stockInfo.textContent = 'Available Stock: ';
            quantityInput.value = 1; // Reset quantity input
            quantityInput.max = ''; // Reset max quantity
            quantitySection.style.display = 'none';

            // Update the quantity in selectedProductInfo
            selectedProductInfo.quantity = 1;

            // Show the error message when no size is selected
            errorMessage.style.display = 'block';
        }
    } else {
        // If the product doesn't have sizes, directly show the price and stock
        productPrice.textContent = `₱ ${selectedProduct.price.toFixed(2)}`;
        stockInfo.textContent = `Available Stock: ${selectedProduct.stock}`;
        quantityInput.max = selectedProduct.stock;

        // Show the quantity section when sizes are not available
        quantitySection.style.display = 'block';

        // Update the quantity in selectedProductInfo
        const quantity = parseInt(quantityInput.value, 10);
        selectedProductInfo.quantity = quantity;
    }
}


function toggleButton(type, productName) {
    const buttonId = `${type}_button_${productName}`;
    const button = document.getElementById(buttonId);
    const imagePath = `/static/img/${type}_CLICKED.png`;

    // Find the selected product
    const selectedProduct = products.find(p => p.name === productName);

    if (type === 'Add_to_Cart' && button.dataset.clicked !== 'true') {
        // If the button is the "Add to Cart" button and it's not clicked yet
        if (selectedProduct.hasSizes && selectedProductInfo.size === '') {
            // If the product has sizes and no size is selected, prompt a message in the popup
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = 'Please select a size.';
            errorMessage.style.color = 'red';
            return; // Stop further execution
        } else {
            // Add the item to the cart
            addItemToCart(
                selectedProduct.name,
                selectedProduct.hasSizes ? selectedProductInfo.size : null,
                selectedProductInfo.imageUrl
            );
        }
    } else if (type === 'BUY_NOW' && button.dataset.clicked !== 'true') {
        // If the button is the "Buy Now" button and it's not clicked yet, add the item to the order tab
        addToOrderTab(
            selectedProduct.name,
            selectedProduct.hasSizes ? selectedProductInfo.size : null,
            selectedProductInfo.imageUrl,
            selectedProductInfo.quantity
        );
    }


    // Toggle the image source immediately
    button.querySelector('.button-image').src = imagePath;

    // Toggle the clicked state
    button.dataset.clicked = 'true';

    console.log(`${type} button clicked for ${productName}`);

    // Set a timeout to change the image back to unclicked after 500 milliseconds (adjust as needed)
    setTimeout(() => {
        button.querySelector('.button-image').src = `/static/img/${type}.png`;
        button.dataset.clicked = 'false';
        console.log(`${type} button unclicked for ${productName}`);
    }, 250);
}

function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
}
