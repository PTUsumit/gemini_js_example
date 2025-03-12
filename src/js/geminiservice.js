import dotenv from "dotenv";
import fetch from "node-fetch"; // Ensure Node.js supports fetch
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText";

if (!API_KEY) {
    throw new Error("Missing API key! Make sure you have a .env file.");
}

export async function extractEntities(text) {
    console.log("Sending request to API...");

    const requestBody = {
        prompt: { text: text }, // Gemini API expects this structure
    };

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("API Response:", data);
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}
