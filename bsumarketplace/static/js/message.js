document.addEventListener("DOMContentLoaded", function() {
    // Your JavaScript code here
    const messageIcon = document.querySelector("#messageIcon");
    const message = document.querySelector("#messageTab");
    const closeMessage = document.querySelector("#closeMessage");

    messageIcon.addEventListener("click", function() {
        message.classList.add("active");
    });

    closeMessage.addEventListener("click", function() {
        message.classList.remove("active");
    });

    function sendMessage() {
        const messageInput = document.getElementById("messageInput");
        const messageContent = document.getElementById("messageContent");

        if (messageInput.value) {
            const messageContainer = document.createElement("div");
            messageContainer.className = "message-container";
            messageContainer.textContent = messageInput.value;
            messageContent.appendChild(messageContainer);
            messageInput.value = ""; // Clear the input box
        }
    }

    // Send button click event
    document.getElementById("sendButton").addEventListener("click", sendMessage);
});
