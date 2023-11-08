// Function to show a specific category and hide others
        function showCategory(categoryId) {
            const categories = ["Uniform_section", "UniversityMerch_section", "ORGMerch_section"];

            for (const category of categories) {
                const element = document.getElementById(category);
                if (category === categoryId) {
                    element.style.display = "grid";
                } else {
                    element.style.display = "none";
                }
            }
        }

        // Add click event listeners to category buttons
        document.getElementById("uniform").addEventListener("click", function () {
            showCategory("Uniform_section");
        });

        document.getElementById("merch").addEventListener("click", function () {
            showCategory("UniversityMerch_section");
        });

        document.getElementById("org_merch").addEventListener("click", function () {
            showCategory("ORGMerch_section");
        });

        // Initial category to show (you can change this as needed)
        showCategory("Uniform_section");