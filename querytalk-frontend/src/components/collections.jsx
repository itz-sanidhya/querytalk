import { useState } from "react";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000";

function Collections({ token }) {
  const [collection, setCollection] = useState("users");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCollection = async () => {
    if (!collection.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/read`,
        { collection, query: {} },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch collection.");
    } finally {
      setLoading(false);
    }
  };

  const headers = data?.data?.length
    ? [...new Set(data.data.flatMap((doc) => Object.keys(doc)))]
    : [];

  const quickCollections = ["users", "products", "orders", "employees"];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h2 className="page-title">🗄️ Collections</h2>
        <p className="page-subtitle">Browse and inspect your MongoDB collections directly.</p>
      </div>

      <div className="collections-search glass">
        <div className="collections-top">
          <div className="quick-collections">
            <span className="input-label">Quick Access:</span>
            {quickCollections.map((c) => (
              <button
                key={c}
                className={`example-chip ${collection === c ? "chip-active" : ""}`}
                onClick={() => setCollection(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="collections-bottom">
          <input
            type="text"
            className="collection-input"
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            placeholder="Enter collection name..."
            onKeyDown={(e) => e.key === "Enter" && fetchCollection()}
          />
          <button className="submit-btn" onClick={fetchCollection} disabled={loading}>
            {loading ? <span className="spinner" /> : "Browse ▶"}
          </button>
        </div>
      </div>

      {error && <div className="error-box">❌ {error}</div>}

      {data && (
        <div className="table-card glass fade-in">
          <div className="table-header-bar">
            <span className="table-title">📁 {collection}</span>
            <span className="table-count">{data.count} document(s)</span>
          </div>
          {data.data.length === 0 ? (
            <p style={{ padding: "24px", opacity: 0.5 }}>No documents found.</p>
          ) : (
            <div className="table-scroll">
              <table className="results-table">
                <thead>
                  <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {data.data.map((doc, i) => (
                    <tr key={i} className="table-row-animate" style={{ animationDelay: `${i * 0.05}s` }}>
                      {headers.map((h) => (
                        <td key={h}>
                          {typeof doc[h] === "object" ? JSON.stringify(doc[h]) : String(doc[h] ?? "—")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Collections;