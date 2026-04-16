"use client";

import { useEffect, useState } from "react";

type Job = {
  company: string;
  role: string;
  status: string;
};

export default function JobsBox() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("friday-jobs");

    if (saved) {
      setJobs(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("friday-jobs", JSON.stringify(jobs));
  }, [jobs]);

  const addJob = () => {
    if (!company.trim() || !role.trim()) return;

    setJobs((prev) => [
      ...prev,
      { company, role, status: "Applied" },
    ]);

    setCompany("");
    setRole("");
  };

  const deleteJob = (index: number) => {
    setJobs((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-8 w-full max-w-xl rounded-2xl border border-gray-700 bg-gray-950 p-4 shadow-lg">
      <h2 className="mb-4 text-lg font-semibold">Jobs Tracker</h2>

      <div className="grid gap-2 md:grid-cols-2">
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company"
          className="rounded-lg bg-gray-900 p-3 text-white outline-none"
        />

        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Role"
          className="rounded-lg bg-gray-900 p-3 text-white outline-none"
        />
      </div>

      <button
        onClick={addJob}
        className="mt-3 rounded-lg bg-white px-4 py-2 font-semibold text-black"
      >
        Add Application
      </button>

      <div className="mt-4 space-y-2">
        {jobs.map((job, index) => (
          <div
            key={index}
            className="rounded-xl bg-gray-900 p-3 text-sm"
          >
            <p className="font-semibold">{job.company}</p>
            <p className="text-gray-400">{job.role}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-blue-400">{job.status}</span>

              <button
                onClick={() => deleteJob(index)}
                className="text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}