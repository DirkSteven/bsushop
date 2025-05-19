function openInvoicePopup(selectedProducts) {
    fetch('/get_user_info')
        .then(response => response.json())
        .then(data => {
            const upperCaseName = data.name.toUpperCase();

            // Populate user information in the popup
            document.querySelector('.iName').textContent = upperCaseName;
            document.querySelector('.iSRCode').textContent = data.sr_code;

    document.querySelector('.iQty').textContent = selectedProducts.quantity;
    document.querySelector('.iItem').textContent =  selectedProducts.title; 
    document.querySelector('.iSize').textContent =  selectedProducts.orderSize.replace(/^Size: /, ''); ; 
    document.querySelector('.iDate').textContent =  selectedProducts.formattedDate;
    document.querySelector('.iTotal').textContent = `₱${selectedProducts.totalPrice}`;

    // Display the invoice popup
    var invoicePopup = document.getElementById('invoice');
    invoicePopup.style.display = 'block';
        })
    .catch(error => {
        console.error('Error fetching user data:', error);
    });
}
function closePopup() {
    var popup = document.getElementById('invoice');
    popup.style.display = 'none';
}