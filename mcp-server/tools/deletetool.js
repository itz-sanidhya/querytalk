const { getDB } = require("../db");

async function deleteData(collectionName, filter) {
    const db = getDB();

    const result = await db.collection(collectionName).deleteOne(filter);

    return {
        message: "Document deleted successfully",
        deletedCount: result.deletedCount
    };
}

module.exports = deleteData;
