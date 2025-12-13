import { NextResponse } from "next/server";
import { generateAIResponse } from "@/../lib/gemini";
import { classifyIntent } from "../../../../lib/intent";
import { getConversation, saveMessage } from "@/../lib/memory";

export async function POST(req: Request) {
  try {
    const { message, sessionId  } = await req.json();
    console.log("Received message:", message);
    console.log("sessionId:", sessionId);

    const history = getConversation(sessionId);
    console.log("history:", history);

    // Gemini-generated support reply (string)
    const aiResponse = await generateAIResponse(message, history);
    console.log("AI generated response:", aiResponse);

    saveMessage(sessionId, { role: "user", text: message });
    saveMessage(sessionId, { role: "assistant", text: aiResponse });
    // Simple local classifier
   const category = await classifyIntent(message, history);

    return NextResponse.json({
      response: aiResponse,  // fixed output
      category,
    });
  } catch (err) {
    console.error("Respond API error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

