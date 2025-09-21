// app/protected/ai/page.tsx
"use client";

import { useState, FormEvent } from "react";


export default function FirstAidAIPage() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      const aiMessage = {
        role: "assistant" as const,
        content: data.content,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
 
      <main className="flex-1 p-6 max-w-3xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">
          🩺 First Aid AI Helper
        </h1>

        {/* Chat area */}
        <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          {messages.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Ask me anything about first aid — from burns to CPR 💡
            </p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 self-end"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 self-start"
              }`}
            >
              <strong className="block mb-1">
                {msg.role === "user" ? "You" : "AI Helper"}
              </strong>
              {msg.content}
            </div>
          ))}
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. How do I treat a burn?"
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </main>
    </div>
  );
}
