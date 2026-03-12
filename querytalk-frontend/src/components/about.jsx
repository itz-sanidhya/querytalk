function About() {
  const features = [
    { icon: "🧠", title: "AI-Powered Queries", desc: "Uses Groq's LLaMA model to understand natural language and convert it to database operations automatically." },
    { icon: "⚡", title: "Real-time Results", desc: "Queries execute instantly against your MongoDB database and results are displayed in a clean, readable table." },
    { icon: "🔒", title: "Validated Operations", desc: "Every operation is validated before execution — no accidental deletions or empty inserts." },
    { icon: "🗄️", title: "Full CRUD Support", desc: "Insert, read, update, and delete documents using plain English — no SQL or query syntax needed." },
  ];

  const examples = [
    { op: "INSERT", color: "#00f5c4", query: "Add a user named Sara, age 28, from Delhi" },
    { op: "READ", color: "#7b61ff", query: "Show all users from Hyderabad" },
    { op: "UPDATE", color: "#ffa94d", query: "Update city=Mumbai where name=Sara" },
    { op: "DELETE", color: "#ff6b6b", query: "Delete where name=Sara" },
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h2 className="page-title">📖 About QueryTalk</h2>
        <p className="page-subtitle">
          QueryTalk lets you interact with your MongoDB database using plain English.
          No query language required — just describe what you want.
        </p>
      </div>

      {/* FEATURES */}
      <div className="about-grid">
        {features.map((f, i) => (
          <div key={i} className="about-card glass">
            <div className="about-icon">{f.icon}</div>
            <h3 className="about-card-title">{f.title}</h3>
            <p className="about-card-desc">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* HOW TO USE */}
      <div className="about-section glass">
        <h3 className="section-title">💡 How to Use</h3>
        <ol className="how-list">
          <li>Type your query in plain English in the Dashboard</li>
          <li>Specify the collection name (default: <code>users</code>)</li>
          <li>Click <strong>Run</strong> or press <strong>Enter</strong></li>
          <li>Results appear instantly in the table below</li>
        </ol>
      </div>

      {/* EXAMPLE QUERIES */}
      <div className="about-section glass">
        <h3 className="section-title">📝 Example Queries</h3>
        <div className="examples-list">
          {examples.map((ex, i) => (
            <div key={i} className="example-row">
              <span className="op-badge" style={{ background: ex.color + "22", color: ex.color, border: `1px solid ${ex.color}` }}>
                {ex.op}
              </span>
              <code className="example-query">{ex.query}</code>
            </div>
          ))}
        </div>
      </div>

      {/* TECH STACK */}
      <div className="about-section glass">
        <h3 className="section-title">🛠️ Tech Stack</h3>
        <div className="tech-grid">
          {[
            { name: "React + Vite", role: "Frontend" },
            { name: "Node.js + Express", role: "Backend" },
            { name: "MongoDB", role: "Database" },
            { name: "Groq (LLaMA)", role: "AI / NLP" },
          ].map((t, i) => (
            <div key={i} className="tech-chip glass">
              <span className="tech-name">{t.name}</span>
              <span className="tech-role">{t.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;