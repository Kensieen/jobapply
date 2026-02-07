import React, { useState } from "react";
import { apiRequest, authHeaders } from "../components/api.js";

const MatchedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");

  const fetchJobs = async () => {
    setMessage("");
    try {
      const data = await apiRequest("/jobs/matched", {
        headers: authHeaders(),
      });
      setJobs(data.jobs || []);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="card">
      <h2>Matched Jobs</h2>
      <p>Review jobs that match your preferences.</p>
      <button type="button" onClick={fetchJobs}>
        Fetch Matches
      </button>
      {message && <p className="badge">{message}</p>}
      {jobs.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Platform</th>
              <th>Salary</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.company_name}</td>
                <td>{job.location}</td>
                <td>{job.platform}</td>
                <td>{job.salary || "Not listed"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MatchedJobsPage;
