document.getElementById("acc").addEventListener("click", function () {
    // Show the Log In popup
    document.getElementById("logInPopup").style.display = "flex";

    // Disable scrolling on the body
    document.body.style.overflow = 'hidden';
});

document.getElementById("closeLogIn").addEventListener("click", function () {
    // Hide the Log In popup
    document.getElementById("logInPopup").style.display = "none";

    // Restore scrolling on the body
    document.body.style.overflow = 'auto';
});

document.getElementById("showSignUp").addEventListener("click", function () {
    // Hide the Log In popup
    document.getElementById("logInPopup").style.display = "none";

    // Show the Sign Up popup
    document.getElementById("signUpPopup").style.display = "flex";
});

document.getElementById("closeSignUp").addEventListener("click", function () {
    // Hide the Sign Up popup
    document.getElementById("signUpPopup").style.display = "none";

    // Restore scrolling on the body
    document.body.style.overflow = 'auto';
});

document.getElementById("showLogIn").addEventListener("click", function () {
    // Hide the Sign Up popup
    document.getElementById("signUpPopup").style.display = "none";

    // Show the Log In popup
    document.getElementById("logInPopup").style.display = "flex";
});
