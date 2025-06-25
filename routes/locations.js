// routes/locations.js

import express from "express";
import { ObjectId } from "mongodb";
import { getMongoClient } from "../db.js";

const router = express.Router();

// Extract database name from Mongo URI
function getDatabaseName(uri) {
  try {
    const url = new URL(uri);
    const dbName = url.pathname.split("/")[1];
    return dbName || "test"; // Fallback if no database is provided
  } catch (err) {
    console.error("Invalid Mongo URI format:", err);
    return null;
  }
}

// POST - Add Location
router.post("/", async (req, res) => {
  const { mongoURI, collectionName } = req.query;

  if (!mongoURI || !collectionName) {
    return res.status(400).json({ error: "Missing mongoURI or collection name." });
  }

  const client = await getMongoClient(mongoURI);
  const dbName = getDatabaseName(mongoURI);

  if (!dbName) {
    return res.status(400).json({ error: "Invalid MongoDB URI format (no database specified)." });
  }

  const db = client.db(dbName);

  const {
    name,
    latitude,
    longitude,
    address,
    website,
    phone,
    wheelchairAccessible,
    isLocationOpen,
    openHours,
    categories,
    scores,
  } = req.body;

  if (!name || !latitude || !longitude) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await db.collection(collectionName).insertOne({
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address: address || "",
      website: website || "",
      phone: phone || "",
      wheelchairAccessible: !!wheelchairAccessible,
      isLocationOpen: isLocationOpen || {},
      openHours: openHours || {},
      categories: categories || {},
      scores: scores || {},
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Location added", id: result.insertedId });
  } catch (err) {
    console.error("Insert failed:", err);
    res.status(500).json({ error: "Failed to add location" });
  }
});

// GET - Fetch All Locations
router.get("/", async (req, res) => {
  const { mongoURI, collectionName } = req.query;

  if (!mongoURI || !collectionName) {
    return res.status(400).json({ error: "Missing mongoURI or collection name." });
  }

  const client = await getMongoClient(mongoURI);
  const dbName = getDatabaseName(mongoURI);

  if (!dbName) {
    return res.status(400).json({ error: "Invalid MongoDB URI format (no database specified)." });
  }

  const db = client.db(dbName);

  try {
    const locations = await db.collection(collectionName).find().toArray();
    res.json(locations);
  } catch (err) {
    console.error("Fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

// PUT - Update Location
router.put("/:id", async (req, res) => {
  const { mongoURI, collectionName } = req.query;
  const { id } = req.params;

  if (!mongoURI || !collectionName) {
    return res.status(400).json({ error: "Missing mongoURI or collection name." });
  }

  const client = await getMongoClient(mongoURI);
  const dbName = getDatabaseName(mongoURI);

  if (!dbName) {
    return res.status(400).json({ error: "Invalid MongoDB URI format (no database specified)." });
  }

  const db = client.db(dbName);

  try {
    const updateResult = await db
      .collection(collectionName)
      .updateOne({ _id: new ObjectId(id) }, { $set: req.body });

    res.status(200).json({ message: "Location updated" });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ error: "Failed to update location" });
  }
});

// DELETE - Remove Location
router.delete("/:id", async (req, res) => {
  const { mongoURI, collectionName } = req.query;
  const { id } = req.params;

  if (!mongoURI || !collectionName) {
    return res.status(400).json({ error: "Missing mongoURI or collection name." });
  }

  const client = await getMongoClient(mongoURI);
  const dbName = getDatabaseName(mongoURI);

  if (!dbName) {
    return res.status(400).json({ error: "Invalid MongoDB URI format (no database specified)." });
  }

  const db = client.db(dbName);

  try {
    const result = await db
      .collection(collectionName)
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.json({ message: "Location deleted" });
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({ error: "Failed to delete location" });
  }
});

export default router;

