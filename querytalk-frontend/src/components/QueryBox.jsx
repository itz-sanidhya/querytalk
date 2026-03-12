import { useState } from "react";
import axios from "axios";

const BACKEND_URL = "https://sanidhya-querytalk-backend.onrender.com";

function QueryBox({ setResults, setError, setLoading, loading, token }) {
  const [text, setText] = useState("");
  const [collection, setCollection] = useState("users");

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/query`,
        { text, collection },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(res.data, text);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.", text);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const examples = [
    "Show all users",
    "Add user name Sara age 28 city Delhi",
    "Update city=Mumbai where name=Sara",
    "Delete where name=Sara",
  ];

  return (
    <div className="query-card glass">
      <div className="query-top">
        <label className="input-label">Collection</label>
        <input
          type="text"
          className="collection-input"
          value={collection}
          onChange={(e) => setCollection(e.target.value)}
          placeholder="e.g. users"
        />
      </div>
      <div className="query-bottom">
        <textarea
          className="query-input"
          rows={3}
          placeholder='e.g. "Add a user named Ravi, age 22, from Hyderabad"'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? <span className="spinner" /> : <>Run <span className="btn-arrow">▶</span></>}
        </button>
      </div>
      <div className="examples">
        <span className="examples-label">Try:</span>
        {examples.map((ex, i) => (
          <button key={i} className="example-chip" onClick={() => setText(ex)}>
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QueryBox;