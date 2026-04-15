"use client";

import { useEffect, useRef, useState } from "react";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleSend = () => {
  if (!message.trim()) return;

  const userMessage = message;
  let fridayReply = `Hello boss. You said "${userMessage}"`;

  if (userMessage.toLowerCase().includes("study")) {
    fridayReply = "Boss, focus for 45 minutes now. Start with hardest topic first.";
  } else if (userMessage.toLowerCase().includes("job")) {
    fridayReply = "Boss, update resume this week and apply daily to internships.";
  } else if (userMessage.toLowerCase().includes("hello")) {
    fridayReply = "Hello boss. FRIDAY online and ready.";
  }

  setMessages((prev) => [
    ...prev,
    `You: ${userMessage}`,
    `FRIDAY: ${fridayReply}`,
  ]);

  setMessage("");
};
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="mt-6 w-full max-w-xl rounded-2xl border border-gray-700 bg-gray-950 p-4 shadow-lg">
      <div className="mb-4 max-h-64 space-y-2 overflow-y-auto">
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

        <div ref={bottomRef}></div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask FRIDAY anything..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
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