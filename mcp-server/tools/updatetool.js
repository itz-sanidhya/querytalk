const { getDB } = require("../db");

async function updateData(collectionName, filter, updateFields) {
    const db = getDB();

    const result = await db.collection(collectionName).updateOne(
        filter,
        { $set: updateFields }
    );

    return {
        message: "Document updated successfully",
        modifiedCount: result.modifiedCount
    };
}

module.exports = updateData;
