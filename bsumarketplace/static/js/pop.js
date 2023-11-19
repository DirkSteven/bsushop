function openProductOptionsPopup(productId, isUniform) {
    var url = '/get_product_details/' + productId;

    // Example using Fetch API
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch product details.');
            }
            return response.json();
        })
        .then(data => {
            // Assuming you have a function to update the popup content
            updatePopupContent(data);
        })
        .catch(error => {
            alert(error.message);
        });
}

function updatePopupContent(data) {
    // Update the popup content with the received data
    document.getElementById('popupContent').innerHTML = `
        <h3>${data.name}</h3>
        <p>Price: ₱ ${data.price}</p>
        <!-- Add other details as needed -->
    `;

    // Show the popup
    document.getElementById('productPopup').style.display = 'block';
}

function closeProductOptionsPopup() {
    // Hide the popup
    document.getElementById('productPopup').style.display = 'none';
}