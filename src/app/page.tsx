import Hero from "../components/Hero";
import ChatBox from "../features/chat/ChatBox";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <Hero />

      <button className="mt-8 px-6 py-3 bg-white text-black rounded-full font-semibold hover:scale-105 transition">
        Start Assistant
      </button>

      <ChatBox />
    </main>
  );
}