import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your actual API key
const API_KEY = "AIzaSyBPiIJDf8WZHoLvsDNB9uJ4CU6Dvj3CsFA";

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to analyze sentiment
async function analyzeSentiment(review) {
    try {
        const prompt = `Analyze the sentiment of the following review and return a JSON object with three fields:
        - 'negative_sentiment_score' with values: 'none', 'weak', 'medium', or 'strong'
        - 'neutral_sentiment_score' with values: 'none', 'weak', 'medium', or 'strong'
        - 'positive_sentiment_score' with values: 'none', 'weak', 'medium', or 'strong'

        Do NOT include 'none' in the response. Only return the fields that are 'weak', 'medium', or 'strong'.

        Review: "${review}"

        Respond with only the JSON object, without any additional text, markdown, or formatting.`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        const response = await result.response;
        let textResponse = response.text(); // Get text response

        // Remove Markdown code block markers (```)
        textResponse = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();

        const sentimentJSON = JSON.parse(textResponse); // Parse cleaned JSON

        // Remove keys with value "none"
        const filteredSentiment = Object.fromEntries(
            Object.entries(sentimentJSON).filter(([_, value]) => value !== "none")
        );

        console.log(`Review: ${review}`);
        console.log(filteredSentiment);
    } catch (error) {
        console.error("Error generating content:", error);
    }
}

// Example reviews
const reviews = [
    "This establishment is an insult to the culinary arts, with inedible food that left me questioning the chef's sanity and the health inspector's judgment.",
    "This restaurant is a true gem with impeccable service and a menu that tantalizes the taste buds. Every dish is a culinary masterpiece, crafted with fresh ingredients and bursting with flavor.",
    "The restaurant offers a decent dining experience with average food and service, making it a passable choice for a casual meal."
];

// Run sentiment analysis on each review
for (const review of reviews) {
    await analyzeSentiment(review);
}
