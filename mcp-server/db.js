const { MongoClient } = require("mongodb");
require("dotenv").config();

let client;
let database;

async function connectDB() {
    try {
        client = new MongoClient(process.env.MONGO_URI);

        await client.connect();

        database = client.db("querytalk_db"); // make sure this DB exists

        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1);
    }
}

function getDB() {
    if (!database) {
        throw new Error("❌ Database not initialized. Call connectDB() first.");
    }
    return database;
}

module.exports = { connectDB, getDB };
