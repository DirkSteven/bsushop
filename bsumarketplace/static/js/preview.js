document.querySelector("#Uniform_section").addEventListener("mouseover", function (event) {
    if (event.target.classList.contains("pic_s")) {
        // Get the id of the hovered product
        const productId = event.target.id;

        // Find the corresponding product preview by data-product attribute (productId should match)
        const previewToShow = document.querySelector(`.product-preview[data-product="${productId}"]`);

        if (previewToShow) {
            // Hide all previews and show the selected one
            document.querySelectorAll(".product-preview").forEach((preview) => {
                preview.style.display = "none";
            });

            previewToShow.style.display = "block";
        }
    }
});

document.querySelector("#UniversityMerch_section").addEventListener("mouseover", function (event) {
    if (event.target.classList.contains("pic_s")) {
        // Get the id of the hovered product
        const productId = event.target.id;

        // Find the corresponding product preview by data-product attribute (productId should match)
        const previewToShow = document.querySelector(`.product-preview[data-product="${productId}"]`);

        if (previewToShow) {
            // Hide all previews and show the selected one
            document.querySelectorAll(".product-preview").forEach((preview) => {
                preview.style.display = "none";
            });

            previewToShow.style.display = "block";
        }
    }
});

document.querySelector("#ORGMerch_section").addEventListener("mouseover", function (event) {
    if (event.target.classList.contains("pic_s")) {
        // Get the id of the hovered product
        const productId = event.target.id;

        // Find the corresponding product preview by data-product attribute (productId should match)
        const previewToShow = document.querySelector(`.product-preview[data-product="${productId}"]`);

        if (previewToShow) {
            // Hide all previews and show the selected one
            document.querySelectorAll(".product-preview").forEach((preview) => {
                preview.style.display = "none";
            });

            previewToShow.style.display = "block";
        }
    }
});