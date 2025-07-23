// in lib/ai.ts

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

interface CampaignInput {
    productName: string;
    productDescription: string;
    targetAudience: string;
}

export async function generateCampaign(input: CampaignInput) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    You are an expert marketing strategist. Based on the following product information, generate a complete ad campaign.

    Product Name: "${input.productName}"
    Product Description: "${input.productDescription}"
    Target Audience: "${input.targetAudience}"

    Generate the following assets:
    1. A compelling ad headline.
    2. Persuasive ad copy (around 40-60 words).
    3. A list of 5-7 precise targeting keywords or audience interests.

    Return the response as a clean JSON object with the keys: "headline", "copy", and "targeting".
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // The AI might return the JSON inside a markdown block, so we clean it up.
        const cleanJson = text.replace('```json', '').replace('```', '').trim();
        return JSON.parse(cleanJson);

    } catch (error) {
        console.error("Error generating campaign:", error);
        throw new Error("Failed to generate AI campaign.");
    }
}