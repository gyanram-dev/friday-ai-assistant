"use client";

import { useEffect, useState } from "react";

type Session = {
  subject: string;
  hours: string;
};

export default function StudyBox() {
  const [subject, setSubject] = useState("");
  const [hours, setHours] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("friday-study");

    if (saved) {
      setSessions(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "friday-study",
      JSON.stringify(sessions)
    );
  }, [sessions]);

  const addSession = () => {
    if (!subject.trim() || !hours.trim()) return;

    setSessions((prev) => [
      ...prev,
      { subject, hours },
    ]);

    setSubject("");
    setHours("");
  };

  const deleteSession = (index: number) => {
    setSessions((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="mt-8 w-full max-w-xl rounded-2xl border border-gray-700 bg-gray-950 p-4 shadow-lg">
      <h2 className="mb-4 text-lg font-semibold">Study Planner</h2>

      <div className="grid gap-2 md:grid-cols-2">
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="rounded-lg bg-gray-900 p-3 text-white outline-none"
        />

        <input
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="Hours"
          className="rounded-lg bg-gray-900 p-3 text-white outline-none"
        />
      </div>

      <button
        onClick={addSession}
        className="mt-3 rounded-lg bg-white px-4 py-2 font-semibold text-black"
      >
        Add Session
      </button>

      <div className="mt-4 space-y-2">
        {sessions.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-xl bg-gray-900 p-3 text-sm"
          >
            <div>
              <p className="font-semibold">{item.subject}</p>
              <p className="text-gray-400">
                {item.hours} hour(s)
              </p>
            </div>

            <button
              onClick={() => deleteSession(index)}
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