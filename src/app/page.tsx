"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [category, setCategory] = useState("");
  const [workflow, setWorkflow] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResponse("...");
    setCategory("");
    setWorkflow("");

    // 1. Get AI response + category
    const resp = await fetch("/api/respond", {
      method: "POST",
      body: JSON.stringify({ message }),
    });

    const data = await resp.json();
    setResponse(data.response);
    setCategory(data.category);

    // 2. Trigger Kestra workflow
    // const wf = await fetch("/api/triggerWorkflow", {
    //   method: "POST",
    //   body: JSON.stringify({ category: data.category }),
    // });

    // const wfData = await wf.json();
    // setWorkflow(wfData.status);
  }

  return (
    <main className="max-w-xl mx-auto py-16">
      <h1 className="text-3xl font-bold mb-6">AI Customer Support Bot</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-3 border rounded"
          placeholder="Enter customer message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          type="submit"
        >
          Get AI Response
        </button>
      </form>

      {response && (
        <div className="mt-6 p-4 bg-white border rounded shadow">
          <p><strong>AI Response:</strong> {response}</p>
          <p className="mt-2"><strong>Category:</strong> {category}</p>
          <p className="mt-2"><strong>Workflow Triggered:</strong> {workflow}</p>
        </div>
      )}
    </main>
  );
}
