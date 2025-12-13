import { GoogleGenerativeAI } from "@google/generative-ai";
import { SUPPORT_SYSTEM_PROMPT } from "./prompts";
import { ChatMessage } from "./conversations";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

export async function generateAIResponse(
  userMessage: string,
  history: ChatMessage[] = []
) {
  try {
    const contents = [
      {
        role: "user",
        parts: [{ text: SUPPORT_SYSTEM_PROMPT }],
      },
      ...history.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      })),
      {
        role: "user",
        parts: [{ text: userMessage }],
      },
    ];

    const result = await model.generateContent({ contents });
    return result.response.text() || "Sorry, I couldn't process that.";
  } catch (err) {
    console.error("Gemini Error:", err);
    return "There was an issue generating a response.";
  }
}
