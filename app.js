const chatArea = document.getElementById("chat-area");
const messageInput = document.getElementById("message");

function sendMessage() {

    const message = messageInput.value.trim();

    if (!message) return;

    document.getElementById("welcome")?.remove();

    addMessage(message, "user");

    messageInput.value = "";

    // Temporary response.
    // We will connect the real AI backend later.

    setTimeout(() => {

        addMessage(
            "I'm ready! The AI backend will be connected in the next step.",
            "ai"
        );

    }, 500);
}


function addMessage(text, type) {

    const message = document.createElement("div");

    message.className = "message";

    if (type === "user") {

        message.innerHTML = `
            <div class="user-message">
                ${escapeHTML(text)}
            </div>
        `;

    } else {

        message.innerHTML = `
            <div class="ai-message">
                <strong>Nova AI</strong>
                <p>${escapeHTML(text)}</p>
            </div>
        `;

    }

    chatArea.appendChild(message);

    chatArea.scrollTop = chatArea.scrollHeight;
}


function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


function handleKey(event) {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        sendMessage();

    }

}


function useSuggestion(text) {

    messageInput.value = text;

    messageInput.focus();

}


function newChat() {

    chatArea.innerHTML = `
        <div class="welcome" id="welcome">

            <h1>What can I help you create?</h1>

            <p>Ask Nova AI anything.</p>

        </div>
    `;

}


function openSettings() {

    alert("Settings will be added soon.");

}


function upgrade() {

    alert("Payments will be added soon.");

}


function logout() {

    alert("Authentication will be connected soon.");

}
