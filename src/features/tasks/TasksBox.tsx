"use client";

import { useEffect, useState } from "react";

type Task = {
  text: string;
  done: boolean;
};

export default function TasksBox() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("friday-tasks");

    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("friday-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!task.trim()) return;

    setTasks((prev) => [...prev, { text: task, done: false }]);
    setTask("");
  };

  const toggleTask = (index: number) => {
    setTasks((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, done: !item.done } : item
      )
    );
  };

  const deleteTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
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
          <div
            key={index}
            className="flex items-center justify-between rounded-lg bg-gray-900 p-3 text-sm"
          >
            <p
              onClick={() => toggleTask(index)}
              className={`cursor-pointer ${
                item.done
                  ? "text-gray-500 line-through"
                  : "text-gray-300"
              }`}
            >
              {item.text}
            </p>

            <button
              onClick={() => deleteTask(index)}
              className="text-red-400"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}