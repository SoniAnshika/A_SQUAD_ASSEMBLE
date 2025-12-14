export async function triggerKestraWorkflow(payload: {
  sessionId: string;
  conversation: any[];
}) {
  await fetch(
    "http://localhost:8080/api/v1/executions/webhook/support/chat-ended",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
}
