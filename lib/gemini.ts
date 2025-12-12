import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Best model for speed + cost effectiveness
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

export async function generateAIResponse(userMessage: string) {
  console.log("Generating AI response for message:", userMessage);

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are an AI customer support assistant.
Reply professionally, politely, and concisely.
Here is the user's message: ${userMessage}
              `,
            },
          ],
        },
      ],
    });

    const text = result.response.text();
    return text || "Sorry, I couldn't process that.";
  } catch (err) {
    console.error("Gemini Error:", err);
    return "There was an issue generating a response.";
  }
}
