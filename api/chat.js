// api/chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // 1. Cek Method harus POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2. Ambil API Key dari Environment Variable Vercel
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        console.error("Critical: GEMINI_API_KEY tidak ditemukan di environment variables.");
        return res.status(500).json({ error: 'Server misconfiguration: API Key missing.' });
    }

    // 3. Validasi Input
    const { prompt, imageData } = req.body;
    if (!prompt && (!imageData || !imageData.data)) {
        return res.status(400).json({ error: 'Mohon masukkan teks atau gambar.' });
    }

    try {
        // Inisialisasi Gemini
        const genAI = new GoogleGenerativeAI(API_KEY);
        
        // PENTING: Gunakan model 'gemini-1.5-flash'
        // Model ini lebih cepat, murah, dan stabil untuk teks+gambar dibanding pro-vision
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const parts = [];
        
        // Masukkan teks jika ada
        if (prompt) {
            parts.push({ text: prompt });
        }

        // Masukkan gambar jika ada
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

        // Kirim balik ke frontend
        res.status(200).json({ response: text });

    } catch (error) {
        console.error("Error Gemini:", error);
        
        // Cek pesan error spesifik
        if (error.message.includes("API key")) {
            return res.status(500).json({ error: "API Key tidak valid." });
        }
        
        return res.status(500).json({ 
            error: `Terjadi kesalahan pada AI: ${error.message}` 
        });
    }
}
