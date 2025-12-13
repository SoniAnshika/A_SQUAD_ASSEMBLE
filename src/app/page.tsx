"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type ChatMessage = {
  sender: "user" | "ai";
  text: string;
  time: string;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sessionId, setSessionId]= useState("");
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  useEffect(() => {
    const id = getSessionId();
    setSessionId(id);
    console.log("Session ID:", id);
  }, []);

  function getTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getSessionId() {
  let id = localStorage.getItem("session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("session_id", id);
  }
  return id;
}

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setChat((prev) => [
      ...prev,
      { sender: "user", text: message, time: getTime() },
    ]);
    setMessage("");
    setLoading(true);

    const resp = await fetch("/api/respond", {
      method: "POST",
      body: JSON.stringify({ message,sessionId }),
    });

    const data = await resp.json();

    setChat((prev) => [
      ...prev,
      {
        sender: "ai",
        text: `${data.response}\n\nCategory: ${data.category}`,
        time: getTime(),
      },
    ]);

    setLoading(false);
  }

  return (
    <main className="flex justify-center items-center h-screen animated-bg">
      {/* Chat shell */}
      <div className="w-full max-w-md h-[90vh] flex flex-col bg-white/90 backdrop-blur rounded-2xl overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-indigo-700 text-white">
          <Image
            src="/helphive-logo.png"
            alt="HelpHive Logo"
            width={40}
            height={40}
            className="rounded-full bg-white p-1 cursor-pointer"
            onClick={() => setProfileOpen(true)}
          />
          <div>
            <span className="font-semibold tracking-wide">HelpHive</span>
            <p className="text-xs text-indigo-200">online</p>
          </div>
        </div>

        {/* Overlay to close profile */}
        {profileOpen && (
          <div
            className="absolute inset-0 bg-black/20 z-10"
            onClick={() => setProfileOpen(false)}
          />
        )}

        {/* Profile Panel */}
        <div
          className={`fixed top-0 right-0 h-[90vh] w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50
  ${profileOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <span className="font-semibold text-lg">HelpHive</span>
            <button onClick={() => setProfileOpen(false)} className="text-xl">✕</button>
          </div>

          <div className="p-4">
            <div className="flex flex-col items-center gap-3">
              <Image
                src="/helphive-logo.png"
                alt="HelpHive"
                width={80}
                height={80}
                className="rounded-full"
              />
              <span className="font-semibold text-lg">HelpHive</span>
              <p className="text-sm text-gray-500">Your AI assistant for instant help</p>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Status</h4>
              <p className="text-sm text-gray-600">Online</p>

              <h4 className="font-semibold mt-4 mb-2">Category</h4>
              <p className="text-sm text-gray-600">AI Customer Support</p>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-gradient-to-b from-indigo-50 to-indigo-100">
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`flex message-animate ${msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
            >
              {/* AI avatar */}
              {msg.sender === "ai" && (
                <Image
                  src="/helphive-logo.png"
                  alt="HelpHive"
                  width={28}
                  height={28}
                  className="rounded-full mr-2 self-end"
                />
              )}

              <div
                className={`max-w-[75%] px-3 py-2 rounded-lg text-sm leading-relaxed ${msg.sender === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none"
                  : "bg-white text-gray-900 rounded-tl-none shadow"
                  }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                <div className="flex justify-end items-center gap-1 mt-1 text-[10px] opacity-70">
                  <span>{msg.time}</span>
                  {msg.sender === "user" && <span>✓✓</span>}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start message-animate">
              <Image
                src="/helphive-logo.png"
                alt="HelpHive"
                width={28}
                height={28}
                className="rounded-full mr-2 self-end opacity-70"
              />
              <div className="bg-white px-3 py-2 rounded-lg text-sm shadow">
                HelpHive is typing…
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-50"
        >
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-full text-sm outline-none bg-white focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="Message HelpHive"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:scale-105 transition"
          >
            ➤
          </button>
        </form>
      </div>
    </main>
  );
}
