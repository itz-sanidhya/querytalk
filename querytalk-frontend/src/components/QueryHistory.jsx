function QueryHistory({ history }) {
  return (
    <div className="history-panel glass">
      <div className="history-header">
        <span className="history-icon">🕒</span>
        <span className="history-title">History</span>
      </div>
      {history.length === 0 ? (
        <p className="history-empty">No queries yet.<br />Run something!</p>
      ) : (
        <ul className="history-list">
          {history.map((item) => (
            <li key={item.id} className={`history-item ${item.success ? "success" : "fail"}`}>
              <span className="history-status">{item.success ? "✅" : "❌"}</span>
              <div className="history-content">
                <p className="history-text">{item.text}</p>
                <span className="history-time">{item.time}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default QueryHistory;
