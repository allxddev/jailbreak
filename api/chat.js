// api/chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Muat .env dari root (bukan public)
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const API_KEY = process.env.GEMINI_API_KEY;

// Inisialisasi Gemini AI
const genAI = new GoogleGenerativeAI(API_KEY);

// PERBAIKAN: Gunakan model terbaru 'gemini-1.5-flash'
// Model ini lebih cepat dan stabil untuk teks maupun gambar
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

export default async function handler(req, res) {
    // Pastikan method POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed.' });
    }

    const { prompt, imageData } = req.body;

    if (!prompt && !imageData) {
        return res.status(400).json({ error: 'Tidak ada prompt atau data gambar.' });
    }

    try {
        // Konstruksi prompt untuk Gemini 1.5
        const parts = [];
        
        // Masukkan text prompt
        if (prompt) {
            parts.push({ text: prompt });
        }

        // Masukkan gambar jika ada
        if (imageData && imageData.mimeType && imageData.data) {
            parts.push({
                inlineData: {
                    mimeType: imageData.mimeType,
                    data: imageData.data
                }
            });
        }

        // Generate konten
        const result = await model.generateContent({ contents: [{ role: "user", parts }] });
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ response: text });

    } catch (error) {
        console.error("Error Gemini:", error);
        res.status(500).json({ 
            response: `Error: ${error.message || "Terjadi kesalahan pada server AI."}` 
        });
    }
}
