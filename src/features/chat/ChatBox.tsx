"use client";

import { useRef, useState, useEffect } from "react";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message;

    setMessages((prev) => [...prev, `You: ${userMessage}`]);
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
        }),
      });

      const data = await res.json();

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
        {messages.map((msg, index) => {
          const isUser = msg.startsWith("You:");

          return (
            <p
              key={index}
              className={`rounded-lg p-3 text-sm ${
                isUser
                  ? "ml-12 bg-white text-black"
                  : "mr-12 bg-gray-900 text-gray-300"
              }`}
            >
              {msg}
            </p>
          );
        })}

        {loading && (
          <p className="mr-12 rounded-lg bg-gray-900 p-3 text-sm text-gray-400">
            FRIDAY is thinking...
          </p>
        )}

        <div ref={bottomRef}></div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask FRIDAY anything..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && handleSend()
          }
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