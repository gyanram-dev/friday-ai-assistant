"use client";

import { useState } from "react";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const handleSend = () => {
    setReply(`Hello boss. You said: ${message}`);
    setMessage("");
  };

  return (
    <div className="mt-6 w-80 rounded-xl border border-gray-700 p-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask FRIDAY anything..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 rounded-lg bg-gray-900 p-3 text-white outline-none"
        />

        <button
          onClick={handleSend}
          className="rounded-lg bg-white px-4 font-semibold text-black"
        >
          Send
        </button>
      </div>

      {reply && (
        <p className="mt-4 rounded-lg bg-gray-900 p-3 text-sm text-gray-300">
          {reply}
        </p>
      )}
    </div>
  );
}