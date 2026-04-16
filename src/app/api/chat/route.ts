import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

function fallbackReply(message: string) {
  const text = message.toLowerCase();

  if (text.includes("study")) {
    return "Boss, start a 45-minute deep work session now. Begin with the hardest topic.";
  }

  if (text.includes("job") || text.includes("internship")) {
    return "Boss, update your resume and apply to 5 relevant roles this week.";
  }

  if (text.includes("motivate")) {
    return "Boss, discipline beats motivation. Start now for 20 minutes.";
  }

  if (text.includes("hello") || text.includes("hi")) {
    return "Hello boss. FRIDAY online and ready.";
  }

  return "Boss, AI is busy right now. Stay focused and try again shortly.";
}

async function askGemini(message: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const result = await model.generateContent(message);
  return await result.response.text();
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    try {
      const reply = await askGemini(message);
      return NextResponse.json({ reply });
    } catch {
      await new Promise((resolve) =>
        setTimeout(resolve, 1500)
      );

      try {
        const reply = await askGemini(message);
        return NextResponse.json({ reply });
      } catch {
        return NextResponse.json({
          reply: fallbackReply(message),
        });
      }
    }
  } catch {
    return NextResponse.json({
      reply: "Boss, system error. Try again.",
    });
  }
}