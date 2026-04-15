import Hero from "../components/Hero";
import ChatBox from "../features/chat/ChatBox";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
        <aside className="border-r border-gray-800 p-6">
          <h2 className="text-xl font-bold">FRIDAY</h2>
          <p className="mt-2 text-sm text-gray-400">Control Center</p>

          <nav className="mt-8 space-y-3 text-sm">
            <p className="rounded-lg bg-gray-900 px-4 py-3">Dashboard</p>
            <p className="rounded-lg px-4 py-3 text-gray-400">Chat</p>
            <p className="rounded-lg px-4 py-3 text-gray-400">Tasks</p>
            <p className="rounded-lg px-4 py-3 text-gray-400">Jobs</p>
            <p className="rounded-lg px-4 py-3 text-gray-400">Settings</p>
          </nav>
        </aside>

        <section className="p-6">
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-gray-800 bg-gray-950 px-5 py-4">
            <div>
              <p className="text-sm text-gray-400">Welcome back</p>
              <h1 className="text-xl font-semibold">Boss</h1>
            </div>

            <div className="rounded-full bg-gray-900 px-4 py-2 text-sm text-gray-300">
              FRIDAY Online
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-4">
              <p className="text-sm text-gray-400">Tasks Today</p>
              <h3 className="mt-2 text-2xl font-bold">5</h3>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-4">
              <p className="text-sm text-gray-400">Focus Hours</p>
              <h3 className="mt-2 text-2xl font-bold">3.5</h3>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-4">
              <p className="text-sm text-gray-400">Applications</p>
              <h3 className="mt-2 text-2xl font-bold">12</h3>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center">
            <Hero />
            <ChatBox />
          </div>
        </section>
      </div>
    </main>
  );
}