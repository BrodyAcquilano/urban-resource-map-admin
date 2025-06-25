// src/db.js

import { MongoClient } from "mongodb";

// In-memory cache to store clients by URI
const mongoClientCache = {};

// Optional: Default URI (your current community database)
const DEFAULT_URI = process.env.MONGO_URI;

export async function getMongoClient(uri) {
  // Fallback to default URI if empty
  const connectionURI = uri || DEFAULT_URI;

  if (mongoClientCache[connectionURI]) {
    return mongoClientCache[connectionURI];
  }

  const client = new MongoClient(connectionURI);

  try {
    await client.connect();
    console.log(`✅ New MongoDB Client connected for URI: ${connectionURI}`);
    mongoClientCache[connectionURI] = client;
    return client;
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    throw err;
  }
}
