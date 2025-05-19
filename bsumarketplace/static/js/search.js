// Get references to the search input and product list
const productSearch = document.getElementById("productSearch");
const productList = document.querySelectorAll(".prod_name");

// Create an array from the product list
const originalProducts = Array.from(productList);

// Add an input event listener to the search input
productSearch.addEventListener("input", function() {
  const searchTerm = productSearch.value.toLowerCase();

  // Loop through the product names and hide/show products based on the search term
  productList.forEach(productName => {
    const productBox = productName.parentElement.parentElement; // Adjust this based on your HTML structure
    if (productName.textContent.toLowerCase().includes(searchTerm)) {
      productBox.style.display = "block"; // Show the product
    } else {
      productBox.style.display = "none"; // Hide the product
    }
  });
});

searchIcon.addEventListener("click", function() {
    // Get a reference to the shop section
    const shopSection = document.getElementById("shop");

    // Scroll to the shop section
    shopSection.scrollIntoView({ behavior: "smooth" });
});