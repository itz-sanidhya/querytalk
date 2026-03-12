import { useState } from "react";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000";

function Register({ onSwitch }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !password || !confirm) return;
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/register`, { username, password });
      setSuccess(res.data.message);
      setTimeout(() => onSwitch(), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass">
        <div className="auth-logo">
          <span className="logo-icon">⬡</span>
          <span className="logo-text">Query<span className="accent">Talk</span></span>
        </div>
        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Get started with QueryTalk</p>

        {error && <div className="auth-error">❌ {error}</div>}
        {success && <div className="auth-success">✅ {success}</div>}

        <div className="auth-fields">
          <div className="auth-field">
            <label className="input-label">Username</label>
            <input
              type="text"
              className="auth-input"
              placeholder="Choose a username (min 3 chars)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="auth-field">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="Choose a password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="auth-field">
            <label className="input-label">Confirm Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
            />
          </div>
        </div>

        <button className="auth-btn" onClick={handleRegister} disabled={loading}>
          {loading ? <span className="spinner" /> : "Create Account →"}
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <button className="auth-link" onClick={onSwitch}>
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;