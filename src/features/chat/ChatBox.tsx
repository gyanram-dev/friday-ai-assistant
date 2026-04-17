"use client";

import { useEffect, useRef, useState } from "react";

type MemoryType = {
  identity: string[];
  goals: string[];
  preferences: string[];
  projects: string[];
  priorities: string[];
};

type ChatMessage = {
  id: string;
  sender: "user" | "friday";
  text: string;
  timestamp: Date;
};

type SpeechRecognitionEvent = {
  results: { length: number; [index: number]: { length: number; [index: number]: { transcript: string } } };
};

type SpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
};

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function loadSavedMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("friday-chat-v2");
  if (!saved) return [];
  const parsed = JSON.parse(saved) as ChatMessage[];
  return parsed.map((msg) => ({ ...msg, timestamp: new Date(msg.timestamp) }));
}

function loadSavedMemory(): MemoryType {
  if (typeof window === "undefined") {
    return { identity: [], goals: [], preferences: [], projects: [], priorities: [] };
  }
  const saved = localStorage.getItem("friday-memory-v2");
  if (!saved) {
    return { identity: [], goals: [], preferences: [], projects: [], priorities: [] };
  }
  return JSON.parse(saved);
}

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(loadSavedMessages);
  const [memory, setMemory] = useState<MemoryType>(loadSavedMemory);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem("friday-chat-v2", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("friday-memory-v2", JSON.stringify(memory));
  }, [memory]);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message;
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setLoading(true);
    inputRef.current?.focus();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, memory }),
      });

      const data = await res.json();

      if (data.updatedMemory) {
        setMemory(data.updatedMemory);
      }

      const fridayReply: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "friday",
        text: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fridayReply]);
    } catch {
      const errorReply: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "friday",
        text: "Boss, connection error.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorReply]);
    }

    setLoading(false);
  };

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported.");
      return;
    }

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }
      setMessage(transcript.trim());
    };

    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex h-[calc(100vh-180px)] flex-col">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-600">
          <span className="text-sm font-bold text-white">F</span>
        </div>
        <div>
          <h2 className="font-semibold text-white">FRIDAY AI</h2>
          <p className="text-xs text-gray-500">
            {loading ? "Generating response..." : "Online"}
          </p>
        </div>
      </div>

      <div className="chat-container flex-1 overflow-y-auto rounded-2xl border border-gray-800/50 bg-gradient-to-b from-gray-900/80 to-gray-950/80 p-4 backdrop-blur-sm">
        {messages.length === 0 && !loading && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20">
              <svg className="h-8 w-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm text-gray-400">Start a conversation with FRIDAY</p>
            <p className="mt-1 text-xs text-gray-600">Ask anything, remember info with &quot;remember goal: ...&quot;</p>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-animate flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] ${msg.sender === "user" ? "order-2" : "order-1"}`}>
                <div
                  className={`relative rounded-2xl px-4 py-3 ${
                    msg.sender === "user"
                      ? "friday-gradient text-white"
                      : "border border-gray-800/50 bg-gray-900/80 text-gray-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                  <span
                    className={`mt-1 block text-[10px] ${
                      msg.sender === "user" ? "text-white/50" : "text-gray-600"
                    }`}
                  >
                    {msg.sender === "user" ? "You" : "FRIDAY"} · {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-animate flex justify-start">
              <div className="order-1 max-w-[50%]">
                <div className="rounded-2xl border border-gray-800/50 bg-gray-900/80 px-4 py-3">
                  <div className="typing-indicator flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  </div>
                </div>
                <span className="ml-2 mt-1 block text-[10px] text-gray-600">FRIDAY · typing</span>
              </div>
            </div>
          )}
        </div>

        <div ref={bottomRef} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Message FRIDAY..."
            disabled={loading}
            className="w-full rounded-xl border border-gray-800/50 bg-gray-900/80 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50 md:py-4"
          />
          {message && (
            <button
              onClick={() => setMessage("")}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <button
          onClick={toggleListening}
          className={`rounded-xl p-3 transition-all ${
            listening
              ? "animate-pulse bg-red-500/20 text-red-400 ring-2 ring-red-500/50"
              : "bg-gray-900/80 text-gray-400 hover:bg-gray-800/80 hover:text-gray-200"
          }`}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>

        <button
          onClick={handleSend}
          disabled={!message.trim() || loading}
          className="friday-gradient rounded-xl px-5 py-3 font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:px-6 md:py-4"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
