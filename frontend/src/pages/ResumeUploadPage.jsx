import React, { useState } from "react";
import { API_BASE, authHeaders } from "../components/api.js";

const ResumeUploadPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage("Select a resume file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch(`${API_BASE}/resume/upload`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      setMessage("Resume uploaded successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="card">
      <h2>Resume Upload</h2>
      <p>Upload your latest resume for automation.</p>
      <form className="form-grid" onSubmit={handleSubmit}>
        <input type="file" onChange={(event) => setFile(event.target.files[0])} />
        <button type="submit">Upload Resume</button>
      </form>
      {message && <p className="badge">{message}</p>}
    </div>
  );
};

export default ResumeUploadPage;
