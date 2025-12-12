import { NextResponse } from "next/server";
import { generateAIResponse } from "@/../lib/gemini";
import { classifyIntent } from "../../../../lib/intent";
export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    console.log("Received message:", message);

    // Gemini-generated support reply (string)
    const aiResponse = await generateAIResponse(message);
    console.log("AI generated response:", aiResponse);

    // Simple local classifier
   const category = await classifyIntent(message);

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

