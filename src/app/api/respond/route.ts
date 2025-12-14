import { NextResponse } from "next/server";
import { generateAIResponse } from "@/../lib/gemini";
import { classifyIntent } from "../../../../lib/intent";
import { getConversation, saveMessage } from "@/../lib/memory";
import { triggerKestraWorkflow } from "@/../lib/kestra";


export async function POST(req: Request) {
  try {
    const { message, sessionId,conversationEnded   } = await req.json();
    console.log("Received message:", message);
    console.log("sessionId:", sessionId);
    console.log("conversationEnded:", conversationEnded);

    if (conversationEnded === true) {
      const fullConversation = getConversation(sessionId);

      console.log("Conversation ended.");
      console.log("Full conversation:", fullConversation);

      /**
       * 🔹 TODO (NEXT STEP):
       * Send this conversation to Kestra
       * - summarize
       * - decide action
       * - execute workflow
       */
      // await triggerKestraWorkflow(fullConversation);

      await triggerKestraWorkflow({
    sessionId,
    conversation: fullConversation,
  });

      return NextResponse.json({        success: true,
        message: "Conversation ended successfully.",
      });
    }


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

