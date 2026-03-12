require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
const { connectDB } = require("./db");
const readData = require("./tools/readtool");
const insertData = require("./tools/inserttool");
const updateData = require("./tools/updatetool");
const deleteData = require("./tools/deletetool");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth");

const app = express();

console.log("GROQ KEY:", process.env.GROQ_API_KEY ? "loaded ✅" : "missing ❌");
console.log("JWT SECRET:", process.env.JWT_SECRET ? "loaded ✅" : "missing ❌");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
    timeout: 15000,
});

app.use(cors({
    origin: ["http://localhost:5173", "https://your-vercel-app.vercel.app"],
    methods: ["GET", "POST"],
}));
app.use(express.json());

/* -------------------- AUTH ROUTES (public) -------------------- */
app.use("/auth", authRoutes);

/* -------------------- ROOT ROUTE -------------------- */
app.get("/", (req, res) => {
    res.send("QueryTalk MCP Server Running 🚀");
});

/* -------------------- PROTECTED ROUTES -------------------- */
app.post("/read", authMiddleware, async (req, res) => {
    try {
        const { collection, query } = req.body;
        if (!collection) {
            return res.status(400).json({ error: "Collection name is required." });
        }
        const data = await readData(collection, query || {});
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/insert", authMiddleware, async (req, res) => {
    try {
        const { collection, document } = req.body;
        if (!collection) {
            return res.status(400).json({ error: "Collection name is required." });
        }
        if (!document || typeof document !== "object" || Array.isArray(document)) {
            return res.status(400).json({ error: "A valid document object is required." });
        }
        if (Object.keys(document).length === 0) {
            return res.status(400).json({ error: "Document cannot be empty." });
        }
        const result = await insertData(collection, document);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/update", authMiddleware, async (req, res) => {
    try {
        const { collection, filter, update } = req.body;
        if (!collection) {
            return res.status(400).json({ error: "Collection name is required." });
        }
        if (!filter || typeof filter !== "object" || Object.keys(filter).length === 0) {
            return res.status(400).json({ error: "A valid filter object is required." });
        }
        if (!update || typeof update !== "object" || Object.keys(update).length === 0) {
            return res.status(400).json({ error: "A valid update object is required." });
        }
        const result = await updateData(collection, filter, update);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/delete", authMiddleware, async (req, res) => {
    try {
        const { collection, filter } = req.body;
        if (!collection) {
            return res.status(400).json({ error: "Collection name is required." });
        }
        if (!filter || typeof filter !== "object" || Object.keys(filter).length === 0) {
            return res.status(400).json({ error: "A valid filter object is required to prevent accidental deletion." });
        }
        const result = await deleteData(collection, filter);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/query", authMiddleware, async (req, res) => {
    try {
        const { text, collection } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Query text is required." });
        }
        if (typeof text !== "string" || text.trim().length === 0) {
            return res.status(400).json({ error: "Query text must be a non-empty string." });
        }

        const targetCollection = collection || "users";
        console.log(`📨 Query received: "${text}" → collection: "${targetCollection}" by user: ${req.user.username}`);

        const groqCall = groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            max_tokens: 300,
            temperature: 0,
            messages: [
                {
                    role: "system",
                    content: `You are a database query assistant. Analyze the natural language query and return ONLY a raw JSON object with this structure:
{
  "intent": "insert" | "read" | "update" | "delete",
  "filter": {},
  "document": {},
  "update": {}
}
Rules:
- Return ONLY raw JSON. No explanation, no markdown, no backticks.
- Numbers must be numbers not strings.
- insert: put fields in "document".
- read: put filter fields in "filter". If no filter use {}.
- update: put filter condition in "filter", fields to change in "update".
- delete: put filter condition in "filter".
- Unknown intent: return { "intent": "unknown" }.`
                },
                {
                    role: "user",
                    content: text
                }
            ]
        });

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Groq API timed out. Please try again.")), 15000)
        );

        const chatResponse = await Promise.race([groqCall, timeoutPromise]);
        const raw = chatResponse.choices[0].message.content.trim();
        console.log("🤖 Groq raw response:", raw);

        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (e) {
            return res.status(500).json({ error: "AI returned invalid JSON. Try rephrasing your query.", raw });
        }

        const { intent, filter, document, update } = parsed;
        console.log("✅ Parsed intent:", intent);

        if (intent === "insert") {
            if (!document || Object.keys(document).length === 0) {
                return res.status(400).json({ error: "No fields found to insert." });
            }
            const result = await insertData(targetCollection, document);
            return res.json(result);
        }

        if (intent === "read") {
            const result = await readData(targetCollection, filter || {});
            return res.json(result);
        }

        if (intent === "update") {
            if (!filter || Object.keys(filter).length === 0) {
                return res.status(400).json({ error: "No filter found for update. Specify who to update." });
            }
            if (!update || Object.keys(update).length === 0) {
                return res.status(400).json({ error: "No fields found to update." });
            }
            const result = await updateData(targetCollection, filter, update);
            return res.json(result);
        }

        if (intent === "delete") {
            if (!filter || Object.keys(filter).length === 0) {
                return res.status(400).json({ error: "No filter found for delete. Specify who to delete." });
            }
            const result = await deleteData(targetCollection, filter);
            return res.json(result);
        }

        return res.status(400).json({ error: "Could not understand the query. Please rephrase." });

    } catch (error) {
        console.error("❌ Query error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/* -------------------- START SERVER -------------------- */
(async () => {
    try {
        console.log("Connecting to MongoDB...");
        await connectDB();
        console.log("MongoDB Connected Successfully");

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:");
        console.error(error);
    }
})();