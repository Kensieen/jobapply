import React, { useState } from "react";
import { apiRequest, authHeaders } from "../components/api.js";

const DashboardPage = () => {
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  const fetchStatus = async () => {
    setMessage("");
    try {
      const data = await apiRequest("/applications/status", {
        headers: authHeaders(),
      });
      setStatus(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="card">
      <h2>Application Status Dashboard</h2>
      <p>Monitor auto-apply performance and platform breakdowns.</p>
      <button type="button" onClick={fetchStatus}>
        Refresh Status
      </button>
      {message && <p className="badge">{message}</p>}
      {status && (
        <div className="form-grid">
          <div>
            <h4>Total Applied Jobs</h4>
            <p>{status.totals.submitted || 0}</p>
          </div>
          <div>
            <h4>Pending Applications</h4>
            <p>{status.totals.processing || 0}</p>
          </div>
          <div>
            <h4>Failed Submissions</h4>
            <p>{status.totals.failed || 0}</p>
          </div>
          <div>
            <h4>Queued</h4>
            <p>{status.totals.queued || 0}</p>
          </div>
          <div>
            <h4>Platform Breakdown</h4>
            <ul>
              {status.platformBreakdown.map((row) => (
                <li key={row.platform}>
                  {row.platform}: {row.count}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
