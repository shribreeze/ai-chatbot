"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SendHorizontal, Loader2 } from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <motion.h1 
        className="text-3xl font-bold text-gray-800 mb-4" 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}>
        AI Chat Assistant
      </motion.h1>

      <div className="w-full max-w-md p-4 bg-white shadow-lg rounded-lg flex flex-col min-h-[400px]">
        <div className="flex-1 overflow-y-auto space-y-2 px-2 pb-2">
          {messages.map((msg, index) => (
            <motion.div 
              key={index} 
              className={`p-3 rounded-lg max-w-[75%] text-white ${msg.sender === "You" ? "bg-blue-500 self-end" : "bg-gray-600 self-start"}`} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}>
              <strong>{msg.sender}:</strong> {msg.text}
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {loading && (
          <div className="flex justify-center items-center py-2">
            <Loader2 className="animate-spin text-gray-500" size={24} />
          </div>
        )}

        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 text-gray-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:bg-gray-300"
          >
            <SendHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
