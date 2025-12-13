import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatMessage } from "./conversations";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

/**
 * Context-aware intent classifier
 */
export async function classifyIntent(
  message: string,
  history: ChatMessage[] = []
): Promise<string> {
  try {
    const context = history
      .slice(-6)
      .map((m) => `${m.role}: ${m.text}`)
      .join("\n");

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
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
              `,
            },
          ],
        },
      ],
    });

    const category = result.response.text().trim().toLowerCase();

    const allowed = ["refund", "technical", "billing", "urgent", "general"];
    return allowed.includes(category) ? category : "general";
  } catch (err) {
    console.error("Gemini intent error:", err);
    return "general";
  }
}
