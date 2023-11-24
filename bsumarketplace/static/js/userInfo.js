// Function to open the popup when clicking the user info

document.getElementById('acc').onclick = function() {
    // Fetch user data from your Flask route
    fetch('/get_user_info')
        .then(response => response.json())
        .then(data => {
            // Populate user information in the popup
            document.querySelector('.uName').textContent = data.name;
            document.querySelector('.uSRCode').textContent = data.sr_code;
            document.querySelector('.uProgram').textContent = data.program;
            document.querySelector('.uEmail').textContent = data.email;
            document.querySelector('.uID').textContent = data.id;

            // Display the popup
            var popup = document.getElementById('popup_acc');
            popup.style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
};

document.querySelector('.logout-btn').onclick = function() {
    // Perform logout actions here, for example, redirect to a logout route
    fetch('/logout', {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => {
        console.log(response.status);  // Log the HTTP status code
    
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Logout failed');
        }
    })
    .then(data => {
        console.log(data);  // Log the response data
        // Assuming the server returns a message field indicating success
        if (data.message === 'Logout successful') {
            // Close the popup and reload the page
            closePopup();
            location.reload();
        } else {
            console.error('Logout failed');
        }
    })
    .catch(error => {
        console.error('Error during logout:', error);
    });
};

function closePopup() {
    var popup = document.getElementById('popup_acc');
    var acc = document.getElementById('acc');
    popup.style.display = 'none';
}

// function openUserProfilePopup() {
//     console.log ("Popup")
// }