import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Use any valid Gemini model that supports generateContent
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

/**
 * Classifies a user message into predefined categories using Gemini AI.
 * Categories: refund, technical, billing, urgent, general
 */
export async function classifyIntent(message: string): Promise<string> {
  try {
    const result = await model.generateContent({
      contents: [
        {
        role: "user",
        parts: [
          {
            text: `
You are an intelligent classifier for customer support messages.
Classify the following user message into **one of these categories**: 
["refund", "technical", "billing", "urgent", "general"]

User message: "${message}"

Reply **ONLY** with the single category name.
          `,
          },
        ],
      },
    ]});

    const category = result.response.text().trim().toLowerCase();
    console.log("Classified category:", category);
    // Ensure fallback
    const validCategories = ["refund", "technical", "billing", "urgent", "general"];
    return validCategories.includes(category) ? category : "general";
  } catch (err) {
    console.error("Gemini classification error:", err);
    return "general";
  }
}
