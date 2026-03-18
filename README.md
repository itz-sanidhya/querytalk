# ⬡ QueryTalk

> Talk to your MongoDB database in plain English — no query language required.

QueryTalk is a full-stack AI-powered database interface that lets you interact with MongoDB using natural language. Type what you want in plain English and the AI handles the rest.

## 🔗 Live Demo

👉 **[querytalk-frontend.vercel.app](https://querytalk-frontend.vercel.app)**

---

## ✨ Features

- 🧠 **AI-Powered Queries** — Uses Groq's LLaMA model to understand natural language and convert it to database operations
- ⚡ **Full CRUD Support** — Insert, read, update, and delete documents using plain English
- 🔒 **JWT Authentication** — Secure register/login system with hashed passwords
- 🗄️ **Collection Browser** — Browse and inspect any MongoDB collection directly
- 📖 **Query History** — Track your last 10 queries with success/fail status
- 🌙 **Dark/Light Mode** — Toggle between themes
- 📱 **Responsive Design** — Works on desktop and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express v5 |
| Database | MongoDB v7 |
| AI / NLP | Groq (LLaMA 3.1) |
| Auth | JWT + bcryptjs |
| Styling | Custom CSS (Glassmorphism) |

---

## 📁 Project Structure
```
QueryTalk/
├── mcp-server/               # Backend
│   ├── tools/
│   │   ├── readtool.js
│   │   ├── inserttool.js
│   │   ├── updatetool.js
│   │   └── deletetool.js
│   ├── routes/
│   │   └── auth.js
│   ├── middleware/
│   │   └── auth.js
│   ├── db.js
│   ├── server.js
│   └── .env
└── querytalk-frontend/       # Frontend
    └── src/
        ├── components/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── QueryBox.jsx
        │   ├── ResultsTable.jsx
        │   ├── QueryHistory.jsx
        │   ├── Collections.jsx
        │   ├── About.jsx
        │   └── Toast.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── App.jsx
        └── App.css
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.19.0
- MongoDB Atlas account (or local MongoDB)
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the repository
```bash
git clone https://github.com/itz-sanidhya/querytalk.git
cd querytalk
```

### 2. Setup the Backend
```bash
cd mcp-server
npm install
```

Create a `.env` file in `mcp-server/`:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret_key
```

Start the backend:
```bash
npm start
```

### 3. Setup the Frontend
```bash
cd querytalk-frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 💡 Example Queries

| Operation | Example |
|-----------|---------|
| **INSERT** | `Add a user named Sara, age 28, from Delhi` |
| **READ** | `Show all users from Hyderabad` |
| **READ** | `Show all users` |
| **UPDATE** | `Update city=Mumbai where name=Sara` |
| **DELETE** | `Delete where name=Sara` |

---

## 🔐 API Endpoints

### Auth (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new account |
| POST | `/auth/login` | Login and receive JWT token |

### Database (Protected — requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/query` | Natural language query |
| POST | `/read` | Read documents |
| POST | `/insert` | Insert a document |
| POST | `/update` | Update a document |
| POST | `/delete` | Delete a document |

All protected routes require the header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🌐 Deployment

- **Backend** — [Render](https://sanidhya-querytalk-backend.onrender.com)
- **Frontend** — [Vercel](https://querytalk-frontend.vercel.app)

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

<p align="center">Built with ❤️ using React, Express, MongoDB, and Groq AI</p>
