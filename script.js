// migrationScript.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

async function migrateData() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  console.log("Connected to MongoDB");

  const db = client.db(); // Use the DB from your URI
  const collection = db.collection("communityResources"); // Replace with your collection

  const cursor = collection.find();

  while (await cursor.hasNext()) {
    const doc = await cursor.next();

    if (!doc.scores) continue;

    // Build new scores object with capitalized keys
    const newScores = {};
    for (let key in doc.scores) {
      const correctedKey = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize first letter
      newScores[correctedKey] = doc.scores[key];
    }

    await collection.updateOne(
      { _id: doc._id },
      { $set: { scores: newScores } }
    );

    console.log(`Updated document with ID: ${doc._id}`);
  }

  console.log("Migration complete");
  await client.close();
}

migrateData().catch(console.error);
