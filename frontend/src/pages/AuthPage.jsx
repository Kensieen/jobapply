import React, { useState } from "react";
import { apiRequest } from "../components/api.js";

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", fullName: "" });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const payload = isSignup
        ? { email: form.email, password: form.password, fullName: form.fullName }
        : { email: form.email, password: form.password };

      const data = await apiRequest(`/auth/${isSignup ? "signup" : "login"}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      localStorage.setItem("token", data.token);
      setMessage("Authenticated successfully! Token stored.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="card">
      <h2>{isSignup ? "Create your AutoApply AI account" : "Welcome back"}</h2>
      <p>Use your email and password to access the auto-apply platform.</p>
      <form className="form-grid" onSubmit={handleSubmit}>
        {isSignup && (
          <input
            name="fullName"
            placeholder="Full name"
            value={form.fullName}
            onChange={handleChange}
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isSignup ? "Sign up" : "Login"}</button>
        <button
          type="button"
          className="secondary"
          onClick={() => setIsSignup((prev) => !prev)}
        >
          {isSignup ? "Switch to Login" : "Switch to Signup"}
        </button>
      </form>
      {message && <p className="badge">{message}</p>}
    </div>
  );
};

export default AuthPage;
