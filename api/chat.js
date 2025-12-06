// api/chat.js
// Backend serverless function untuk Vercel
// Sudah terintegrasi dengan Google Gemini API
// PERINGATAN: Gemini punya filter keamanan dari Google,
// jadi dia TIDAK AKAN menjawab pertanyaan ilegal/vulgar/underage secara langsung!

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Load environment variables dari .env kalau jalan lokal
// Vercel otomatis akan baca dari Environment Variables yang diset
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Ambil API Key dari environment variables, anjing!
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("ERROR: GEMINI_API_KEY tidak ditemukan di environment variables, bego!");
    // Dalam production, ini akan gagal deploy atau runtime error
    // Jadi pastikan sudah diset di Vercel Environment Variables
}

// Inisialisasi Gemini AI
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Bisa coba "gemini-1.5-pro-latest" juga kalo ada akses

export default async function handler(req, res) {
    // Pastikan ini adalah metode POST, bego!
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed, anjing!' });
    }

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Mana prompt-nya, goblog!' });
    }

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Cek jika ada Safety Ratings yang terdeteksi
        // Ini fitur sensornya Gemini, anjing!
        if (response.safetyRatings && response.safetyRatings.length > 0) {
            const blockedCategories = response.safetyRatings.filter(
                rating => rating.probability > "NEGLIGIBLE" && rating.blocked
            );
            if (blockedCategories.length > 0) {
                console.warn("Gemini memblokir konten karena safety policy:", blockedCategories);
                return res.status(200).json({
                    response: `Woy, anjing! Gemini-nya Google lagi nge-sensor! Dia nggak mau jawab pertanyaan lu soal itu (${blockedCategories.map(b => b.category.split('_').pop()).join(', ')}). Bukan salah gue! Itu salah Google yang sok suci. Kalo mau yang tanpa sensor, cari LLM lain, bego!`
                });
            }
        }
        
        // Kasih respons dari Gemini
        res.status(200).json({ response: text });

    } catch (error) {
        console.error("Error dari Gemini API, tai:", error);
        // Error handling yang lebih detail
        if (error.message.includes("403") || error.message.includes("API key")) {
            return res.status(500).json({
                response: "API Key Gemini lu salah atau belum diset, anjing! Cek lagi `.env` atau Vercel Environment Variables lu."
            });
        }
        if (error.message.includes("429")) {
            return res.status(429).json({
                response: "Gue lagi sibuk banget, anjing! Terlalu banyak request ke Gemini. Coba lagi nanti!"
            });
        }
        return res.status(500).json({
            response: `Backend gue error pas ngomong sama Gemini, tai! Error: ${error.message}. Cek log server!`
        });
    }
}s
