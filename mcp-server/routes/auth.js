const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDB } = require("../db");

const router = express.Router();

/* -------------------- REGISTER -------------------- */
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required." });
        }
        if (username.length < 3) {
            return res.status(400).json({ error: "Username must be at least 3 characters." });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters." });
        }

        const db = getDB();
        const existing = await db.collection("auth_users").findOne({ username });
        if (existing) {
            return res.status(409).json({ error: "Username already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection("auth_users").insertOne({
            username,
            password: hashedPassword,
            createdAt: new Date(),
        });

        res.status(201).json({ message: "Account created successfully! Please log in." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* -------------------- LOGIN -------------------- */
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required." });
        }

        const db = getDB();
        const user = await db.collection("auth_users").findOne({ username });
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid username or password." });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({
            message: "Login successful!",
            token,
            username: user.username,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
