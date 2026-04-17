"use client";

import { useEffect, useState } from "react";

type Job = {
  company: string;
  role: string;
  status: string;
};

const statuses = ["Applied", "Interview", "Rejected", "Offer"];

const loadJobs = (): Job[] => {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("friday-jobs");
  return saved ? JSON.parse(saved) : [];
};

export default function JobsBox() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobs, setJobs] = useState<Job[]>(loadJobs);

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

  const updateStatus = (index: number, value: string) => {
    setJobs((prev) =>
      prev.map((job, i) =>
        i === index ? { ...job, status: value } : job
      )
    );
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

            <div className="mt-2 flex items-center justify-between gap-2">
              <select
                value={job.status}
                onChange={(e) =>
                  updateStatus(index, e.target.value)
                }
                className="rounded-lg bg-black px-3 py-2 text-sm text-white outline-none"
              >
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>

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