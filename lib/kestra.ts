export async function triggerKestraWorkflow(category: string) {
  try {
    const resp = await fetch(process.env.KESTRA_WORKFLOW_URL || "", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category }),
    });

    return resp.ok;
  } catch (err) {
    console.error("Kestra error:", err);
    return false;
  }
}
