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
try {
    const result = await model.generateContent({ contents });
    return result.response.text() || fallbackOpenRouter(contents);
  } catch (err) {
    console.warn("Gemini failed, falling back to DeepSeek:");
    return fallbackOpenRouter(contents);
  }
}


async function fallbackOpenRouter(contents: any[]) {
  try {
  const messages = contents.map((c) => ({
      role: c.role === "user" || c.role === "assistant" ? c.role : "system",
      content: c.parts?.[0]?.text || "",
    }));

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI Customer Support Bot",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages,
      }),
    });

    const data = await res.json();
    return (
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't process that."
    );
  } catch (err) {
    console.error("❌ OpenRouter fallback failed:", err);
    return "Our support system is temporarily unavailable. Please try again later.";
  }
}