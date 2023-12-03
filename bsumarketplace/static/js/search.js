/* Get references to the search input and product list
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
*/

// Polymorphism: Base class for filters
class Filter {
  constructor(elements) {
    this.elements = Array.from(elements);
  }

  applyFilter(searchTerm) {
    throw new Error("Subclasses must implement the applyFilter method");
  }

  addEventListeners() {
    throw new Error("Subclasses must implement the addEventListeners method");
  }
}

// Polymorphism: ProductNameFilter is a subclass of Filter
class ProductNameFilter extends Filter {
  constructor(searchInput, productList) {
    super(productList);
    this.searchInput = searchInput;
    this.addEventListeners();
  }

  // Polymorphism: Override applyFilter for product names
  applyFilter(searchTerm) {
    this.elements.forEach(productName => {
      const productBox = productName.parentElement.parentElement;
      if (productName.textContent.toLowerCase().includes(searchTerm)) {
        productBox.style.display = "block"; // Show the product
      } else {
        productBox.style.display = "none"; // Hide the product
      }
    });
  }

  // Polymorphism: Override addEventListeners for input events
  addEventListeners() {
    this.searchInput.addEventListener("input", () => {
      const searchTerm = this.searchInput.value.toLowerCase();
      this.applyFilter(searchTerm);
    });
  }
}

// Polymorphism: SectionFilter is a subclass of Filter
class SectionFilter extends Filter {
  constructor(element) {
    super([element]);
    this.addEventListeners();
  }

  // Polymorphism: Override applyFilter for scrolling to a section
  applyFilter() {
    scrollIntoViewSmooth(this.elements[0]);
  }

  // Polymorphism: Override addEventListeners for click events
  addEventListeners() {
    this.elements[0].addEventListener("click", () => {
      this.applyFilter();
    });
  }
}

// Usage
const productFilter = new ProductNameFilter(
  document.getElementById("productSearch"),
  document.querySelectorAll(".prod_name")
);

const sectionFilter = new SectionFilter(searchIcon);

searchIcon.addEventListener("click", function() {
  scrollIntoViewSmooth(document.getElementById("shop"));
});


function scrollIntoViewSmooth(element) {
  element.scrollIntoView({ behavior: "smooth" });
}
