export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold">FRIDAY AI</h1>

      <p className="mt-4 text-gray-400">
        Your futuristic personal assistant
      </p>

      <button className="mt-8 px-6 py-3 bg-white text-black rounded-full font-semibold hover:scale-105 transition">
        Start Assistant
      </button>
    </main>
  );
}