// api/chat.js
// Backend serverless function untuk Vercel
// Sudah terintegrasi dengan Google Gemini API untuk teks dan gambar (multimodal)
// PERINGATAN: Gemini punya filter keamanan dari Google,
// jadi dia TIDAK AKAN menjawab pertanyaan ilegal/vulgar/underage secara langsung,
// terutama jika ada konten gambar yang melanggar kebijakan!

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Load environment variables dari .env kalau jalan lokal
// Vercel otomatis akan baca dari Environment Variables yang diset
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Ambil API Key dari environment variables
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("ERROR: GEMINI_API_KEY tidak ditemukan di environment variables!");
    // Dalam production, ini akan gagal deploy atau runtime error
    // Jadi pastikan sudah diset di Vercel Environment Variables
}

// Inisialisasi Gemini AI
const genAI = new GoogleGenerativeAI(API_KEY);
// Gunakan model yang support multimodal (gemini-pro-vision atau gemini-1.5-pro-latest)
const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" }); 

export default async function handler(req, res) {
    // Pastikan ini adalah metode POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed.' });
    }

    const { prompt, imageData } = req.body;

    // Minimal harus ada prompt atau gambar
    if (!prompt && !imageData) {
        return res.status(400).json({ error: 'Tidak ada prompt atau data gambar yang diterima.' });
    }

    // Buat array "parts" untuk request multimodal Gemini
    const parts = [];

    if (prompt) {
        parts.push({ text: prompt });
    }

    if (imageData && imageData.mimeType && imageData.data) {
        parts.push({
            inlineData: {
                mimeType: imageData.mimeType,
                data: imageData.data // Ini data Base64 yang sudah dikirim dari frontend
            }
        });
    }

    try {
        const result = await model.generateContent({ contents: [{ parts }] });
        const response = await result.response;
        const text = response.text();

        // Cek jika ada Safety Ratings yang terdeteksi oleh Google
        if (response.safetyRatings && response.safetyRatings.length > 0) {
            const blockedCategories = response.safetyRatings.filter(
                rating => rating.probability > "NEGLIGIBLE" && rating.blocked
            );
            if (blockedCategories.length > 0) {
                console.warn("Gemini memblokir konten karena safety policy:", blockedCategories);
                return res.status(200).json({
                    response: `Maaf, respons ini diblokir karena melanggar kebijakan keamanan (konten: ${blockedCategories.map(b => b.category.split('_').pop()).join(', ')}). Ini adalah kebijakan dari penyedia model AI (Google Gemini), bukan dari AllxDDev AI.`
                });
            }
        }
        
        // Kasih respons dari Gemini
        res.status(200).json({ response: text });

    } catch (error) {
        console.error("Error dari Gemini API:", error);
        // Error handling yang lebih detail
        if (error.message.includes("403") || error.message.includes("API key")) {
            return res.status(500).json({
                response: "API Key Gemini Anda tidak valid atau belum diset. Mohon periksa kembali konfigurasi Anda."
            });
        }
        if (error.message.includes("429")) {
            return res.status(429).json({
                response: "Terlalu banyak permintaan ke Gemini. Mohon coba lagi nanti."
            });
        }
        // Jika error karena konten yang tidak pantas (Google blocking)
        if (error.message.includes("candidate was blocked")) {
            return res.status(200).json({
                response: "Respons diblokir karena konten yang tidak pantas. Ini adalah kebijakan penyedia model AI (Google Gemini)."
            });
        }
        if (error.message.includes("File must be <= 4MB") || error.message.includes("Exceeded maximum number of content parts")) {
             return res.status(400).json({
                response: "Gambar terlalu besar atau format tidak didukung. Mohon gunakan gambar di bawah 5MB."
            });
        }
        return res.status(500).json({
            response: `Terjadi kesalahan pada backend saat berkomunikasi dengan Gemini: ${error.message}. Mohon periksa log server.`
        });
    }
}
