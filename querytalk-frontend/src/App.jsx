import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import QueryBox from "./components/QueryBox";
import ResultsTable from "./components/ResultsTable";
import QueryHistory from "./components/QueryHistory";
import Collections from "./components/Collections";
import About from "./components/About";
import Toast from "./components/Toast";
import "./App.css";

function App() {
  const { isLoggedIn, logout, username, token } = useAuth();
  const [authPage, setAuthPage] = useState("login");
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null);
  const [animateResults, setAnimateResults] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleResults = (data, queryText) => {
    setAnimateResults(false);
    setTimeout(() => {
      setResults(data);
      setAnimateResults(true);
    }, 50);
    const entry = {
      id: Date.now(),
      text: queryText,
      time: new Date().toLocaleTimeString(),
      success: true,
    };
    setHistory((prev) => [entry, ...prev].slice(0, 10));
    showToast("Query executed successfully!", "success");
  };

  const handleError = (err, queryText) => {
    setError(err);
    const entry = {
      id: Date.now(),
      text: queryText,
      time: new Date().toLocaleTimeString(),
      success: false,
    };
    setHistory((prev) => [entry, ...prev].slice(0, 10));
    showToast(err, "error");
  };

  const navigateTo = (page) => {
    setActivePage(page);
    setMenuOpen(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="app dark">
        <div className="bg-orbs">
          <div className="orb orb1" />
          <div className="orb orb2" />
          <div className="orb orb3" />
        </div>
        {authPage === "login"
          ? <Login onSwitch={() => setAuthPage("register")} />
          : <Register onSwitch={() => setAuthPage("login")} />
        }
      </div>
    );
  }

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <div className="bg-orbs">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
      </div>

      {/* HEADER */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">⬡</span>
          <span className="logo-text">Query<span className="accent">Talk</span></span>
        </div>

        {/* DESKTOP NAV */}
        <nav className="nav">
          {["dashboard", "collections", "about"].map((page) => (
            <button
              key={page}
              className={`nav-btn ${activePage === page ? "nav-active" : ""}`}
              onClick={() => navigateTo(page)}
            >
              {page === "dashboard" && "⚡ Dashboard"}
              {page === "collections" && "🗄️ Collections"}
              {page === "about" && "📖 About"}
            </button>
          ))}
        </nav>

        <div className="header-right">
          <span className="status-dot" />
          <span className="status-text">@{username}</span>
          <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button className="logout-btn" onClick={logout}>Logout</button>
          {/* HAMBURGER - mobile only */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      {/* MOBILE DROPDOWN MENU */}
      {menuOpen && (
        <div className="mobile-menu glass">
          <div className="mobile-user">👤 @{username}</div>
          {["dashboard", "collections", "about"].map((page) => (
            <button
              key={page}
              className={`mobile-nav-btn ${activePage === page ? "nav-active" : ""}`}
              onClick={() => navigateTo(page)}
            >
              {page === "dashboard" && "⚡ Dashboard"}
              {page === "collections" && "🗄️ Collections"}
              {page === "about" && "📖 About"}
            </button>
          ))}
          <button className="mobile-nav-btn mobile-logout" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      )}

      {/* PAGES */}
      {activePage === "dashboard" && (
        <div className="layout">
          <aside className="sidebar">
            <QueryHistory history={history} />
          </aside>
          <main className="main">
            <div className="hero">
              <h1 className="title">
                Talk to your <span className="accent">Database</span>
              </h1>
              <p className="subtitle">
                Type anything in plain English — AI handles the rest.
              </p>
            </div>
            <QueryBox
              setResults={handleResults}
              setError={handleError}
              setLoading={setLoading}
              loading={loading}
              token={token}
            />
            {loading && <LoadingSkeleton />}
            {!loading && results && (
              <div className={`results-wrapper ${animateResults ? "fade-in" : ""}`}>
                <ResultsTable results={results} />
              </div>
            )}
          </main>
        </div>
      )}

      {activePage === "collections" && <Collections token={token} />}
      {activePage === "about" && <About />}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-header" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton-row" style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  );
}

export default App;