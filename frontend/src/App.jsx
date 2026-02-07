import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import ResumeUploadPage from "./pages/ResumeUploadPage.jsx";
import PreferencesPage from "./pages/PreferencesPage.jsx";
import MatchedJobsPage from "./pages/MatchedJobsPage.jsx";
import AutoApplyPage from "./pages/AutoApplyPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

const App = () => {
  return (
    <div className="app">
      <aside className="sidebar">
        <h1>AutoApply AI</h1>
        <nav>
          <NavLink to="/">Login</NavLink>
          <NavLink to="/resume">Resume Upload</NavLink>
          <NavLink to="/preferences">Preferences</NavLink>
          <NavLink to="/jobs">Matched Jobs</NavLink>
          <NavLink to="/auto-apply">Auto-Apply</NavLink>
          <NavLink to="/dashboard">Status Dashboard</NavLink>
        </nav>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/resume" element={<ResumeUploadPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="/jobs" element={<MatchedJobsPage />} />
          <Route path="/auto-apply" element={<AutoApplyPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
