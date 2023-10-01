document.addEventListener("DOMContentLoaded", function() {
    loadChatHistory(); // Load the chat history when the page is loaded
});

function loadChatHistory() {
    const chatArea = document.getElementById("chatArea");
    const storedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || "[]");
    
    storedChatHistory.forEach(message => {
        const messageDiv = document.createElement("div");
        messageDiv.className = message.role;
        messageDiv.textContent = message.content;
        chatArea.appendChild(messageDiv);
    });
}

function storeChatMessage(role, content) {
    const storedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || "[]");
    storedChatHistory.push({role: role, content: content});
    localStorage.setItem('chatHistory', JSON.stringify(storedChatHistory));
}

function sendMessage() {
    const messageBox = document.getElementById("message");
    const chatArea = document.getElementById("chatArea");
    
    // Prevent sending if the message is empty
    if (!messageBox.value.trim()) return;

    // Append user's message to chat area
    const userDiv = document.createElement("div");
    userDiv.className = "user";
    userDiv.textContent = messageBox.value;
    chatArea.appendChild(userDiv);
    
    // Store user message in local storage
    storeChatMessage("user", messageBox.value);

    // Create and append a spinner to chat area just below the user's message
    const spinner = document.createElement("div");
    spinner.id = "spinner";
    chatArea.appendChild(spinner);

    // Make AJAX call to your Flask API to get the chatbot's response
    fetch("/ask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: messageBox.value })
    })
    .then(response => response.json())
    .then(data => {
        // Remove spinner from chat area
        chatArea.removeChild(spinner);

        // Append ChatGPT's response to chat area
        const assistantDiv = document.createElement("div");
        assistantDiv.className = "assistant";
        assistantDiv.textContent = data;
        chatArea.appendChild(assistantDiv);

        // Store assistant message in local storage
        storeChatMessage("assistant", data);
    })
    .catch(error => {
        console.error("Error fetching chatbot response:", error);

        // Remove spinner in case of error too
        chatArea.removeChild(spinner);
    });

    // Clear and refocus input box
    messageBox.value = "";
    messageBox.setAttribute("size", 1);
    messageBox.focus();

    // Prevent default form submission
    event.preventDefault();
}

function clearChatHistory() {
    // Clears chat history on client
    const chatArea = document.getElementById("chatArea");
    chatArea.innerHTML = '';  // clear the chat area
    localStorage.removeItem('chatHistory');  // clear from local storage

    // Clears chat history on the server
    fetch("/clear_server_chat_history", {
        method: "POST"
    })
    .catch(error => {
        console.error("Error clearing server chat history:", error);
    });
}

// Adjust the size of the input box based on its content
function adjustInputSize() {
    const messageBox = document.getElementById("message");
    const maxSize = messageBox.style.maxWidth.replace('px', '');  // Convert "###px" to an integer
    const currentSize = messageBox.value.length * 8;  // Rough estimate of width per character
    messageBox.setAttribute("size", Math.min(currentSize, maxSize));
}

function toggleDarkMode() {
    const body = document.body;
    const toggleButton = document.getElementById('toggleDarkMode');

    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        toggleButton.innerHTML = "🌙";  // Moon for light mode
    } else {
        body.classList.add('dark-mode');
        toggleButton.innerHTML = "☀️";  // Sun for dark mode
    }
}

function exportAsMarkdown() {
    window.location.href = "/export_markdown";
}