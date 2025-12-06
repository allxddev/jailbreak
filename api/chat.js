import { GoogleGenerativeAI } from "@google/generative-ai";

// Mengambil API Key dari Environment Variables Vercel
const API_KEY = process.env.GEMINI_API_KEY;

// Inisialisasi Gemini
// Pastikan API_KEY sudah diset di Settings Vercel
const genAI = new GoogleGenerativeAI(API_KEY);

// GUNAKAN MODEL TERBARU: gemini-1.5-flash
// Model ini jauh lebih stabil daripada gemini-pro-vision
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function handler(req, res) {
    // 1. Cek Method
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2. Cek API Key
    if (!API_KEY) {
        console.error("API Key belum diset di Vercel Environment Variables");
        return res.status(500).json({ error: 'Konfigurasi Server Salah (API Key Missing)' });
    }

    const { prompt, imageData } = req.body;

    // 3. Validasi Input
    if (!prompt && (!imageData || !imageData.data)) {
        return res.status(400).json({ error: 'Input kosong (butuh teks atau gambar)' });
    }

    try {
        const parts = [];
        
        // Masukkan text
        if (prompt) {
            parts.push({ text: prompt });
        }

        // Masukkan gambar
        if (imageData && imageData.data) {
            parts.push({
                inlineData: {
                    mimeType: imageData.mimeType,
                    data: imageData.data
                }
            });
        }

        // Generate konten
        const result = await model.generateContent({
            contents: [{ role: "user", parts: parts }]
        });
        
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ response: text });

    } catch (error) {
        console.error("Error Gemini:", error);
        // Tampilkan pesan error spesifik agar mudah debugging di Log Vercel
        res.status(500).json({ 
            error: error.message || "Terjadi kesalahan internal pada AI" 
        });
    }
}
