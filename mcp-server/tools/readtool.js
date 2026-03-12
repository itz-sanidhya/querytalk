const { getDB } = require("../db");

async function readData(collectionName, query = {}) {
    const db = getDB();
    const result = await db.collection(collectionName).find(query).toArray();
    return {
        message: "Documents fetched successfully",
        count: result.length,
        data: result
    };
}

module.exports = readData;