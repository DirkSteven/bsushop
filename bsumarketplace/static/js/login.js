document.addEventListener("DOMContentLoaded", function () {
    // Show the Log In popup
    document.getElementById("logInPopup").style.display = "flex";

    // Disable scrolling on the body
    document.body.style.overflow = 'hidden';
});

function showSignUp() {
    // Hide the Log In popup
    document.getElementById("logInPopup").style.display = "none";

    // Show the Sign Up popup
    document.getElementById("signUpPopup").style.display = "flex";
}

document.addEventListener("DOMContentLoaded", function () {
    // Show the Sign Up popup
    document.getElementById("signUpPopup").style.display = "flex";

    // Disable scrolling on the body
    document.body.style.overflow = 'hidden';
});

function showLogIn() {
    // Hide the Sign Up popup
    document.getElementById("signUpPopup").style.display = "none";

    // Show the Log In popup
    document.getElementById("logInPopup").style.display = "flex";
}

document.getElementById("showLogIn").addEventListener("click", showLogIn);
