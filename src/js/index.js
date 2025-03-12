import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const API_KEY = process.env.GEMINI_API_KEY; // Replace with your actual API key
const MODEL_ID = "gemini-2.0-flash"; // Choose the right model

const entityRecognitionText = 
  "John Johnson, the CEO of the Oil Inc. and Coal Inc. companies, has unveiled plans to build a new factory in Houston, Texas.";

const prompt = `
Generate a list of entities in the text based on the following JavaScript object structure:

const CategoryEnum = {
  Person: 'Person',
  Company: 'Company',
  State: 'State',
  City: 'City'
};

const Entity = {
  name: 'string',
  category: 'CategoryEnum'
};

const Entities = {
  entities: 'Array<Entity>'
};

Now, extract entities from the following text:
"${entityRecognitionText}"
`;

// Initialize Generative AI API
async function generateEntities() {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_ID });

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }], // Fix: Proper format
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json"
      }
    });

    console.log(await result.response.text());
  } catch (error) {
    console.error("API Request Failed:", error);
  }
}

generateEntities();
