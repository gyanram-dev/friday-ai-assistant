"use client";

import { useState } from "react";

export default function TasksBox() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);

  const addTask = () => {
    if (!task.trim()) return;

    setTasks((prev) => [...prev, task]);
    setTask("");
  };

  return (
    <div className="mt-8 w-full max-w-xl rounded-2xl border border-gray-700 bg-gray-950 p-4 shadow-lg">
      <h2 className="mb-4 text-lg font-semibold">Tasks</h2>

      <div className="flex gap-2">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a task..."
          className="flex-1 rounded-lg bg-gray-900 p-3 text-white outline-none"
        />

        <button
          onClick={addTask}
          className="rounded-lg bg-white px-4 font-semibold text-black"
        >
          Add
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {tasks.map((item, index) => (
          <p
            key={index}
            className="rounded-lg bg-gray-900 p-3 text-sm text-gray-300"
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}