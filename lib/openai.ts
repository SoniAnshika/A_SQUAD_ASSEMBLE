export async function generateAIResponse(userMessage: string) {
  console.log("Generating AI response for message:", userMessage);
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-70b-specdec", 
      messages: [
        {
          role: "system",
          content: "You are an AI customer support assistant. Reply politely and concisely.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    }),
  });

  const data = await res.json();
  console.log("AI response data:", data);
  return data.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";
}