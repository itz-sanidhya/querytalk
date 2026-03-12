const { getDB } = require("../db");

async function insertData(collectionName, document) {
    const db = getDB();
    const result = await db.collection(collectionName).insertOne(document);
    return {
        message: "Document inserted successfully",
        insertedId: result.insertedId
    };
}

module.exports = insertData;
