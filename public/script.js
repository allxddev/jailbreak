// JavaScript Biar Keliatan Hidup & Multimodal
const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const fileInput = document.getElementById('fileInput');
const filePreviewContainer = document.getElementById('filePreviewContainer');

let attachedFiles = []; // Array buat nyimpen file yang di-attach

// Fungsi buat nambahin pesan ke chat
function addMessage(sender, content, fileUrl = null) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    const bubbleDiv = document.createElement('div');
    bubbleDiv.classList.add('message-bubble');

    // Kalo ada file URL, tampilin sebagai gambar/video
    if (fileUrl) {
        const mediaElement = document.createElement(fileUrl.startsWith('data:video') ? 'video' : 'img');
        mediaElement.src = fileUrl;
        mediaElement.alt = "Uploaded file";
        if (fileUrl.startsWith('data:video')) {
            mediaElement.controls = true; // Tambahin kontrol buat video
            mediaElement.loop = true; // Biar looping
            mediaElement.muted = true; // Mute by default
        }
        bubbleDiv.appendChild(mediaElement);
        // Tambahin sedikit jarak kalau ada teks juga
        if (content.trim()) {
            bubbleDiv.appendChild(document.createElement('br'));
            bubbleDiv.appendChild(document.createElement('br'));
        }
    }

    // Ini buat nampilin kode di chat, biar rapi pake <pre><code>
    // Gue asumsikan backend bakal ngasih kode diapit
