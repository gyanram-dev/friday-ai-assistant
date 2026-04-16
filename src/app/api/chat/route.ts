import { NextResponse } from "next/server";

type MemoryType = {
  identity: string[];
  goals: string[];
  preferences: string[];
  projects: string[];
  priorities: string[];
};

function emptyMemory(): MemoryType {
  return {
    identity: [],
    goals: [],
    preferences: [],
    projects: [],
    priorities: [],
  };
}

function chooseModel(message: string) {
  const text = message.toLowerCase();

  const codingWords = [
    "code",
    "bug",
    "error",
    "react",
    "nextjs",
    "next.js",
    "javascript",
    "typescript",
    "python",
    "java",
    "html",
    "css",
    "api",
    "debug",
    "programming",
  ];

  return codingWords.some((word) => text.includes(word))
    ? "deepseek-coder:6.7b"
    : "qwen2.5:7b";
}

function addUnique(list: string[], value: string) {
  const clean = value.trim();
  if (!clean) return list;
  if (list.includes(clean)) return list;
  return [...list, clean];
}

function parseMemoryCommand(
  message: string,
  memory: MemoryType
): {
  matched: boolean;
  updatedMemory: MemoryType;
  reply: string;
} {
  const text = message.trim();
  const lower = text.toLowerCase();

  const patterns = [
    { prefix: "remember identity:", key: "identity" },
    { prefix: "remember goal:", key: "goals" },
    { prefix: "remember preference:", key: "preferences" },
    { prefix: "remember project:", key: "projects" },
    { prefix: "remember priority:", key: "priorities" },
  ] as const;

  for (const item of patterns) {
    if (lower.startsWith(item.prefix)) {
      const value = text.slice(item.prefix.length).trim();

      const updated = {
        ...memory,
        [item.key]: addUnique(memory[item.key], value),
      };

      return {
        matched: true,
        updatedMemory: updated,
        reply: `Boss, saved to ${item.key}.`,
      };
    }
  }

  return {
    matched: false,
    updatedMemory: memory,
    reply: "",
  };
}

function memoryToText(memory: MemoryType) {
  return `
Identity: ${memory.identity.join(", ") || "None"}
Goals: ${memory.goals.join(", ") || "None"}
Preferences: ${memory.preferences.join(", ") || "None"}
Projects: ${memory.projects.join(", ") || "None"}
Priorities: ${memory.priorities.join(", ") || "None"}
`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const message: string = body.message || "";
    const memory: MemoryType =
      body.memory || emptyMemory();

    const memoryCommand = parseMemoryCommand(
      message,
      memory
    );

    if (memoryCommand.matched) {
      return NextResponse.json({
        reply: memoryCommand.reply,
        updatedMemory: memoryCommand.updatedMemory,
      });
    }

    const model = chooseModel(message);

    const prompt = `
You are FRIDAY, an elite AI personal assistant.

User Memory:
${memoryToText(memory)}

User Message:
${message}

Rules:
- Use user memory when relevant.
- Be smart, practical, and direct.
- Call user Boss occasionally.
- Never give messy long paragraphs.
- Format answers cleanly using markdown style.

Response Style:
- Start with a short title when useful.
- Use bullet points or numbered steps.
- Keep each point short.
- Use sections like:
  ## Priority
  ## Steps
  ## Mistakes to Avoid
  ## Next Action

- If user asks coding question:
  Use:
  ## Problem
  ## Fix
  ## Code
  ## Next Step

- If user asks planning/career/study:
  Use:
  ## Goal
  ## Plan
  ## Action This Week

- Keep responses concise but high value.
`;

    const res = await fetch(
      "http://127.0.0.1:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
        }),
      }
    );

    const data = await res.json();

    return NextResponse.json({
      reply:
        data.response ||
        "Boss, local model gave no reply.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      reply: "Boss, local AI not responding.",
    });
  }
}