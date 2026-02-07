import React, { useState } from "react";
import { apiRequest, authHeaders } from "../components/api.js";

const PreferencesPage = () => {
  const [form, setForm] = useState({
    jobTitles: "Software Engineer, Full Stack Developer",
    yearsExperience: 3,
    salaryMin: 90000,
    salaryMax: 140000,
    locations: "Remote, New York",
    workMode: "Remote",
    companyPreference: "",
    dailyApplyLimit: 10,
  });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const payload = {
        jobTitles: form.jobTitles.split(",").map((item) => item.trim()),
        yearsExperience: Number(form.yearsExperience),
        salaryMin: Number(form.salaryMin),
        salaryMax: Number(form.salaryMax),
        locations: form.locations.split(",").map((item) => item.trim()),
        workMode: form.workMode,
        companyPreference: form.companyPreference,
        dailyApplyLimit: Number(form.dailyApplyLimit),
      };

      await apiRequest("/preferences/save", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      setMessage("Preferences saved successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="card">
      <h2>Job Preferences</h2>
      <p>Define exactly what roles AutoApply AI should target.</p>
      <form className="form-grid" onSubmit={handleSubmit}>
        <input
          name="jobTitles"
          value={form.jobTitles}
          onChange={handleChange}
          placeholder="Job titles (comma separated)"
        />
        <input
          name="yearsExperience"
          type="number"
          value={form.yearsExperience}
          onChange={handleChange}
          placeholder="Years of experience"
        />
        <input
          name="salaryMin"
          type="number"
          value={form.salaryMin}
          onChange={handleChange}
          placeholder="Minimum salary"
        />
        <input
          name="salaryMax"
          type="number"
          value={form.salaryMax}
          onChange={handleChange}
          placeholder="Maximum salary"
        />
        <input
          name="locations"
          value={form.locations}
          onChange={handleChange}
          placeholder="Preferred locations (comma separated)"
        />
        <select name="workMode" value={form.workMode} onChange={handleChange}>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Onsite">Onsite</option>
        </select>
        <input
          name="companyPreference"
          value={form.companyPreference}
          onChange={handleChange}
          placeholder="Company preference (optional)"
        />
        <input
          name="dailyApplyLimit"
          type="number"
          value={form.dailyApplyLimit}
          onChange={handleChange}
          placeholder="Daily apply limit"
        />
        <button type="submit">Save Preferences</button>
      </form>
      {message && <p className="badge">{message}</p>}
    </div>
  );
};

export default PreferencesPage;
