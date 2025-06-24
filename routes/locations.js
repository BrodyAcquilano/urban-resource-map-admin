// routes/locations.js

import express from "express";
import { ObjectId } from "mongodb";
const router = express.Router();

// POST - Add Location
router.post("/", async (req, res) => {
  const db = req.app.locals.db;
  const collectionName = req.query.collectionName;

  if (!collectionName) {
    return res.status(400).json({ error: "Missing collection name." });
  }

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
    scores 
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
  const db = req.app.locals.db;
  const collectionName = req.query.collectionName;

  if (!collectionName) {
    return res.status(400).json({ error: "Missing collection name." });
  }

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
  const db = req.app.locals.db;
  const { id } = req.params;
  const collectionName = req.query.collectionName;

  if (!collectionName) {
    return res.status(400).json({ error: "Missing collection name." });
  }

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
  const db = req.app.locals.db;
  const { id } = req.params;
  const collectionName = req.query.collectionName;

  if (!collectionName) {
    return res.status(400).json({ error: "Missing collection name." });
  }

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

router.get("/", async (req, res) => {
  const db = req.app.locals.db;

  try {
    const locations = await db.collection("locations").find().toArray();
    res.json(locations);
  } catch (err) {
    console.error("Fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

// PUT to update
router.put("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  try {
    const updateResult = await db
      .collection("locations")
      .updateOne({ _id: new ObjectId(id) }, { $set: req.body });
    res.status(200).json({ message: "Location updated" });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ error: "Failed to update location" });
  }
});

router.delete("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  try {
    const result = await db
      .collection("locations")
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
