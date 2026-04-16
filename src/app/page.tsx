"use client";

import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import ChatBox from "../features/chat/ChatBox";
import TasksBox from "../features/tasks/TasksBox";
import JobsBox from "../features/jobs/JobsBox";

type Task = {
  text: string;
  done: boolean;
};

type Job = {
  company: string;
  role: string;
  status: string;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const [tasksCount, setTasksCount] = useState(0);
  const [applications, setApplications] = useState(0);
  const [interviews, setInterviews] = useState(0);
  const [offers, setOffers] = useState(0);

  useEffect(() => {
    const loadData = () => {
      const savedTasks = localStorage.getItem("friday-tasks");
      const savedJobs = localStorage.getItem("friday-jobs");

      if (savedTasks) {
        const tasks: Task[] = JSON.parse(savedTasks);
        setTasksCount(tasks.filter((task) => !task.done).length);
      } else {
        setTasksCount(0);
      }

      if (savedJobs) {
        const jobs: Job[] = JSON.parse(savedJobs);

        setApplications(jobs.length);
        setInterviews(
          jobs.filter((job) => job.status === "Interview").length
        );
        setOffers(
          jobs.filter((job) => job.status === "Offer").length
        );
      } else {
        setApplications(0);
        setInterviews(0);
        setOffers(0);
      }
    };

    loadData();

    const interval = setInterval(loadData, 500);
    return () => clearInterval(interval);
  }, []);

  const menu = ["Dashboard", "Chat", "Tasks", "Jobs"];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
        <aside className="border-r border-gray-800 p-6">
          <h2 className="text-xl font-bold">FRIDAY</h2>
          <p className="mt-2 text-sm text-gray-400">Control Center</p>

          <nav className="mt-8 space-y-3 text-sm">
            {menu.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`w-full rounded-lg px-4 py-3 text-left ${
                  activeTab === item
                    ? "bg-gray-900 text-white"
                    : "text-gray-400"
                }`}
              >
                {item}
              </button>
            ))}
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

          {activeTab === "Dashboard" && (
            <>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-gray-800 bg-gray-950 p-4">
                  <p className="text-sm text-gray-400">Tasks Today</p>
                  <h3 className="mt-2 text-2xl font-bold">{tasksCount}</h3>
                </div>

                <div className="rounded-2xl border border-gray-800 bg-gray-950 p-4">
                  <p className="text-sm text-gray-400">Applications</p>
                  <h3 className="mt-2 text-2xl font-bold">{applications}</h3>
                </div>

                <div className="rounded-2xl border border-gray-800 bg-gray-950 p-4">
                  <p className="text-sm text-gray-400">Interviews</p>
                  <h3 className="mt-2 text-2xl font-bold">{interviews}</h3>
                </div>

                <div className="rounded-2xl border border-gray-800 bg-gray-950 p-4">
                  <p className="text-sm text-gray-400">Offers</p>
                  <h3 className="mt-2 text-2xl font-bold">{offers}</h3>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center">
                <Hero />
              </div>
            </>
          )}

          {activeTab === "Chat" && <ChatBox />}
          {activeTab === "Tasks" && <TasksBox />}
          {activeTab === "Jobs" && <JobsBox />}
        </section>
      </div>
    </main>
  );
}