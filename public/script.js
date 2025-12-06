// JavaScript Biar Keliatan Hidup, Ini yang Nanti Nembak ke Backend Lu
const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    const bubbleDiv = document.createElement('div');
    bubbleDiv.classList.add('message-bubble');
    // Pre-wrap biar kode di respons AI tampil rapi
    bubbleDiv.style.whiteSpace = 'pre-wrap'; 
    bubbleDiv.innerText = text;
    messageDiv.appendChild(bubbleDiv);
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll ke bawah otomatis
}

sendBtn.addEventListener('click', async () => {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        addMessage('user', userMessage);
        userInput.value = '';

        // Tembak ke backend AI yang ada di Vercel di endpoint /api/chat
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();
            addMessage('ai', data.response);
        } catch (error) {
            console.error('Error fetching AI response:', error);
            addMessage('ai', 'Duh, ada error nih, anjing. Coba lagi nanti atau cek konsol browser lu.');
        }
    }
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Kirim pas Enter, bukan Shift + Enter
        e.preventDefault(); // Mencegah newline di textarea
        sendBtn.click();
    }
});
