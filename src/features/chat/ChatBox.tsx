"use client";

import { useEffect, useRef, useState } from "react";

type MemoryType = {
  identity: string[];
  goals: string[];
  preferences: string[];
  projects: string[];
  priorities: string[];
};

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [memory, setMemory] = useState<MemoryType>({
    identity: [],
    goals: [],
    preferences: [],
    projects: [],
    priorities: [],
  });
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedChat = localStorage.getItem("friday-chat");
    const savedMemory = localStorage.getItem("friday-memory-v2");

    if (savedChat) setMessages(JSON.parse(savedChat));
    if (savedMemory) setMemory(JSON.parse(savedMemory));
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "friday-chat",
      JSON.stringify(messages)
    );
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(
      "friday-memory-v2",
      JSON.stringify(memory)
    );
  }, [memory]);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      `You: ${userMessage}`,
    ]);

    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          memory,
        }),
      });

      const data = await res.json();

      if (data.updatedMemory) {
        setMemory(data.updatedMemory);
      }

      setMessages((prev) => [
        ...prev,
        `FRIDAY: ${data.reply}`,
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        "FRIDAY: Boss, connection error.",
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <div className="w-full max-w-xl rounded-2xl border border-gray-700 bg-gray-950 p-4 shadow-lg">
      <div className="mb-4 max-h-80 space-y-2 overflow-y-auto">
        {messages.map((msg, index) => (
          <p
            key={index}
            className={`rounded-lg p-3 text-sm ${
              msg.startsWith("You:")
                ? "ml-12 bg-white text-black"
                : "mr-12 bg-gray-900 text-gray-300"
            }`}
          >
            {msg}
          </p>
        ))}

        {loading && (
          <p className="mr-12 rounded-lg bg-gray-900 p-3 text-sm text-gray-400">
            FRIDAY is thinking...
          </p>
        )}

        <div ref={bottomRef}></div>
      </div>

      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && handleSend()
          }
          placeholder="Ask FRIDAY..."
          className="flex-1 rounded-lg bg-gray-900 p-3 text-white outline-none"
        />

        <button
          onClick={handleSend}
          className="rounded-lg bg-white px-4 font-semibold text-black"
        >
          Send
        </button>
      </div>
    </div>
  );
}