// routes/locations.js

import express from "express";
import { ObjectId } from "mongodb";
import { getMongoClient } from "../db.js";

const router = express.Router();

// POST - Add Location
// Example: POST /api/locations?collectionName=X&mongoURI=yourMongoURI
router.post("/", async (req, res) => {
  const { mongoURI, collectionName } = req.query;

  if (!mongoURI || !collectionName) {
    return res.status(400).json({ error: "Missing mongoURI or collection name." });
  }

  const client = await getMongoClient(mongoURI);
  const db = client.db();

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
// Example: GET /api/locations?collectionName=X&mongoURI=yourMongoURI
router.get("/", async (req, res) => {
  const { mongoURI, collectionName } = req.query;

  if (!mongoURI || !collectionName) {
    return res.status(400).json({ error: "Missing mongoURI or collection name." });
  }

  const client = await getMongoClient(mongoURI);
  const db = client.db();

  try {
    const locations = await db.collection(collectionName).find().toArray();
    res.json(locations);
  } catch (err) {
    console.error("Fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

// PUT - Update Location
// Example: PUT /api/locations/:id?collectionName=X&mongoURI=yourMongoURI
router.put("/:id", async (req, res) => {
  const { mongoURI, collectionName } = req.query;
  const { id } = req.params;

  if (!mongoURI || !collectionName) {
    return res.status(400).json({ error: "Missing mongoURI or collection name." });
  }

  const client = await getMongoClient(mongoURI);
  const db = client.db();

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
// Example: DELETE /api/locations/:id?collectionName=X&mongoURI=yourMongoURI
router.delete("/:id", async (req, res) => {
  const { mongoURI, collectionName } = req.query;
  const { id } = req.params;

  if (!mongoURI || !collectionName) {
    return res.status(400).json({ error: "Missing mongoURI or collection name." });
  }

  const client = await getMongoClient(mongoURI);
  const db = client.db();

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

