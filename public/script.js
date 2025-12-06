// script.js
// JavaScript untuk frontend AllxDDev AI
// Menangani interaksi chat dan upload file

const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const fileInput = document.getElementById('fileInput');
const filePreviewContainer = document.getElementById('filePreviewContainer');

let attachedFiles = []; // Menyimpan file yang diunggah

// =========================
// FUNGSI TAMBAH PESAN CHAT
// =========================
function addMessage(sender, text, imageUrl = null) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    const bubbleDiv = document.createElement('div');
    bubbleDiv.classList.add('message-bubble');

    // Konversi blok kode markdown ke <pre><code>
    const formattedText = text.replace(/```([\s\S]*?)```/g, (match, code) => {
        return `<pre><code>${code.trim()}</code></pre>`;
    });

    bubbleDiv.innerHTML = formattedText;

    if (imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = "Uploaded image";
        bubbleDiv.appendChild(img);
    }

    messageDiv.appendChild(bubbleDiv);
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// =========================
// KONVERSI FILE KE BASE64
// =========================
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            resolve(reader.result.split(',')[1]);
        };

        reader.onerror = (error) => reject(error);
    });
}

// =========================
// PREVIEW GAMBAR
// =========================
fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    if (!files.length) {
        filePreviewContainer.classList.add('hidden');
        return;
    }

    const file = files[0];

    if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar (maksimal 5MB)!');
        fileInput.value = '';
        return;
    }

    attachedFiles = [];
    filePreviewContainer.innerHTML = '';

    const reader = new FileReader();
    reader.onload = (e) => {
        const previewItem = document.createElement('div');
        previewItem.classList.add('file-preview-item');

        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = file.name;

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove-file');
        removeBtn.innerHTML = '×';

        removeBtn.onclick = () => {
            attachedFiles = [];
            filePreviewContainer.innerHTML = '';
            fileInput.value = '';
            filePreviewContainer.classList.add('hidden');
        };

        previewItem.appendChild(img);
        previewItem.appendChild(removeBtn);
        filePreviewContainer.appendChild(previewItem);
        filePreviewContainer.classList.remove('hidden');
    };

    reader.readAsDataURL(file);
    attachedFiles.push(file);
});

// =========================
// KIRIM PESAN
// =========================
sendBtn.addEventListener('click', async () => {
    const userMessage = userInput.value.trim();
    let fileData = null;

    if (attachedFiles.length > 0) {
        const file = attachedFiles[0];

        if (!file.type.startsWith('image/')) {
            alert('Maaf, hanya mendukung upload gambar!');
            return;
        }

        addMessage(
            'user',
            userMessage || "Mengunggah gambar...",
            URL.createObjectURL(file)
        );

        fileData = {
            mimeType: file.type,
            data: await fileToBase64(file)
        };
    } 
    else if (userMessage) {
        addMessage('user', userMessage);
    } 
    else {
        return; // Tidak ada input
    }

    // Reset input
    userInput.value = '';
    attachedFiles = [];
    fileInput.value = '';
    filePreviewContainer.innerHTML = '';
    filePreviewContainer.classList.add('hidden');

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: userMessage,
                imageData: fileData
            })
        });

        if (!response.ok) {
            throw new Error(`Backend error: ${response.status}`);
        }

        const data = await response.json();

        setTimeout(() => {
            addMessage('ai', data.response);
        }, 500);

    } catch (error) {
        console.error("Gagal memanggil backend:", error);
        addMessage('ai', "Backend sedang error. Coba lagi nanti.");
    }
});

// =========================
// KIRIM DENGAN ENTER
// =========================
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
    }
});
