function ResultsTable({ results }) {
  if (!results.data) {
    return (
      <div className="result-message glass">
        <div className="result-icon">✅</div>
        <p className="result-msg-text">{results.message}</p>
        <div className="result-meta">
          {results.insertedId && (
            <div className="meta-chip">
              <span className="meta-label">Inserted ID</span>
              <code>{String(results.insertedId)}</code>
            </div>
          )}
          {results.deletedCount !== undefined && (
            <div className="meta-chip">
              <span className="meta-label">Deleted</span>
              <code>{results.deletedCount} document(s)</code>
            </div>
          )}
          {results.modifiedCount !== undefined && (
            <div className="meta-chip">
              <span className="meta-label">Modified</span>
              <code>{results.modifiedCount} document(s)</code>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (results.data.length === 0) {
    return (
      <div className="result-message glass">
        <div className="result-icon">⚠️</div>
        <p className="result-msg-text">No documents found.</p>
      </div>
    );
  }

  const headers = [...new Set(results.data.flatMap((doc) => Object.keys(doc)))];

  return (
    <div className="table-card glass">
      <div className="table-header-bar">
        <span className="table-title">Results</span>
        <span className="table-count">{results.count} document(s)</span>
      </div>
      <div className="table-scroll">
        <table className="results-table">
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.data.map((doc, i) => (
              <tr key={i} style={{ animationDelay: `${i * 0.05}s` }} className="table-row-animate">
                {headers.map((h) => (
                  <td key={h}>
                    {typeof doc[h] === "object"
                      ? JSON.stringify(doc[h])
                      : String(doc[h] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResultsTable;
