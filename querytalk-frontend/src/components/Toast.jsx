function Toast({ message, type }) {
  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{type === "success" ? "✅" : "❌"}</span>
      <span className="toast-msg">{message}</span>
    </div>
  );
}

export default Toast;
