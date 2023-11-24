// Function to open the popup when clicking the user info
document.getElementById('login').onclick = function() {
    var popup = document.getElementById('popup_acc');
    popup.style.display = 'block';
};

// Function to close the popup
function closePopup() {
    var popup = document.getElementById('popup_acc');
    popup.style.display = 'none';
}


function openUserProfilePopup() {
    console.log ("Popup")
}