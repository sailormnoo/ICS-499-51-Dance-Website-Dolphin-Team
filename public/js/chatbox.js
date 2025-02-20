const inputField = document.querySelector('.form-control');
const sendButton = document.querySelector('.btn-primary');
const messageContainer = document.querySelector('.card-body');

document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.querySelector(".form-control");
    const sendButton = document.querySelector(".btn-primary");
    const messageContainer = document.querySelector(".card-body");

    async function sendMessage() {
        const messageText = inputField.value.trim();
        if (!messageText) return;

        // Display user message
        const userMessage = document.createElement("div");
        userMessage.classList.add("d-flex", "align-items-baseline", "mb-4");
        userMessage.innerHTML = `
            <div class="pe-2">
                <div class="card d-inline-block p-2 px-3 m-1 outgoing">${messageText}</div>
            </div>
        `;
        messageContainer.appendChild(userMessage);
        inputField.value = "";

        try {
            // Send user message to chatbot server
            const response = await fetch("http://localhost:3000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: messageText }),
            });

            const data = await response.json();
            const aiReply = data.response || "No response.";

            // Display AI response
            const aiMessage = document.createElement("div");
            aiMessage.classList.add("d-flex", "align-items-baseline", "mb-4");
            aiMessage.innerHTML = `
                <div class="position-relative avatar">
                    <img src="chatbox_face.jpg" class="img-fluid" alt="" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                </div>
                <div class="pe-2">
                    <div class="card d-inline-block p-2 px-3 m-1 incoming">${aiReply}</div>
                </div>
            `;
            messageContainer.appendChild(aiMessage);
            messageContainer.scrollTop = messageContainer.scrollHeight;
        } catch (error) {
            console.error("Error:", error);
        }
    }

    sendButton.addEventListener("click", sendMessage);
    inputField.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});
