import React, { useState } from "react";
import { apiRequest, authHeaders } from "../components/api.js";

const AutoApplyPage = () => {
  const [jobIds, setJobIds] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const ids = jobIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    try {
      const data = await apiRequest("/apply/start", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ jobIds: ids }),
      });

      setMessage(
        `Queued ${data.applications.length} applications. Skipped ${data.skipped}.`
      );
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="card">
      <h2>Auto-Apply Control Panel</h2>
      <p>Start automated job applications with a single click.</p>
      <form className="form-grid" onSubmit={handleSubmit}>
        <textarea
          name="jobIds"
          rows="4"
          value={jobIds}
          onChange={(event) => setJobIds(event.target.value)}
          placeholder="Paste matched job IDs separated by commas"
        />
        <button type="submit">Start Auto-Apply</button>
      </form>
      {message && <p className="badge">{message}</p>}
    </div>
  );
};

export default AutoApplyPage;
