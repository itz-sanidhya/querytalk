import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const BACKEND_URL = "https://sanidhya-querytalk-backend.onrender.com";

function Login({ onSwitch }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/login`, { username, password });
      login(res.data.token, res.data.username);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
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
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to access your database</p>

        {error && <div className="auth-error">❌ {error}</div>}

        <div className="auth-fields">
          <div className="auth-field">
            <label className="input-label">Username</label>
            <input
              type="text"
              className="auth-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          <div className="auth-field">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
        </div>

        <button className="auth-btn" onClick={handleLogin} disabled={loading}>
          {loading ? <span className="spinner" /> : "Sign In →"}
        </button>

        <p className="auth-switch">
          Don't have an account?{" "}
          <button className="auth-link" onClick={onSwitch}>
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;