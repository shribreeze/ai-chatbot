"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "You", text: input }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "AI", text: data.reply }]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setLoading(false);
    setInput("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">AI Chatbot</h1>
      <div className="border p-4 w-full max-w-md min-h-[300px] bg-gray-100 rounded-lg">
        {messages.map((msg, index) => (
          <p key={index} className="mb-2 text-black">
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        className="border p-2 mt-4 w-full max-w-md"
      />
      <button onClick={sendMessage} disabled={loading} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}
