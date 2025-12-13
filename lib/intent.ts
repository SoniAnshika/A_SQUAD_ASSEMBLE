import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatMessage } from "./conversations";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const ALLOWED_INTENTS = ["refund", "technical", "billing", "urgent", "general"];

/**
 * Context-aware intent classifier with Gemini → DeepSeek fallback
 */
export async function classifyIntent(
  message: string,
  history: ChatMessage[] = []
): Promise<string> {
  const context = history
    .slice(-6)
    .map((m) => `${m.role}: ${m.text}`)
    .join("\n");

  const prompt = `
You are a strict intent classifier.

Conversation context:
${context || "None"}

Classify the LAST user message into ONE category only:
refund | technical | billing | urgent | general

Rules:
- Reply with only one lowercase word
- No punctuation
- No explanations

Message:
"${message}"
`;

  // Try Gemini first
  try {
    const result = await geminiModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const category = result.response.text().trim().toLowerCase();
    return ALLOWED_INTENTS.includes(category) ? category : "general";
  } catch (err: any) {
    console.warn("Gemini intent failed, falling back to DeepSeek:", err?.message);
    return fallbackIntentOpenRouter(prompt);
  }
}

/**
 *  OpenRouter DeepSeek fallback (intent-safe)
 */
async function fallbackIntentOpenRouter(prompt: string): Promise<string> {
  try {
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
        messages: [
          {
            role: "system",
            content:
              "You are a strict intent classifier. Reply with only one lowercase category.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0, 
      }),
    });

    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content
      ?.trim()
      ?.toLowerCase();

    return ALLOWED_INTENTS.includes(raw) ? raw : "general";
  } catch (err) {
    console.error("OpenRouter intent fallback failed:", err);
    return "general";
  }
}