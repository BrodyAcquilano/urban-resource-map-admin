// routes/projectSchema.js

import express from "express";
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

// GET all project schemas
router.get("/", async (req, res) => {
  const { mongoURI } = req.query;

  if (!mongoURI) {
    return res.status(400).json({ error: "Missing mongoURI query parameter." });
  }

  try {
    const client = await getMongoClient(mongoURI);
    const dbName = getDatabaseName(mongoURI);

    if (!dbName) {
      return res.status(400).json({ error: "Invalid MongoDB URI format (no database specified)." });
    }

    const db = client.db(dbName);

    const schemas = await db.collection("projectSchema").find().toArray();
    if (!schemas || schemas.length === 0) {
      return res.status(404).json({ error: "No schemas found." });
    }
    res.json(schemas);
  } catch (err) {
    console.error("Fetch schemas failed:", err);
    res.status(500).json({ error: "Failed to fetch schemas." });
  }
});

// GET specific schema by projectName
router.get("/project", async (req, res) => {
  const { mongoURI, projectName } = req.query;

  if (!mongoURI || !projectName) {
    return res.status(400).json({ error: "Missing mongoURI or projectName query parameter." });
  }

  try {
    const client = await getMongoClient(mongoURI);
    const dbName = getDatabaseName(mongoURI);

    if (!dbName) {
      return res.status(400).json({ error: "Invalid MongoDB URI format (no database specified)." });
    }

    const db = client.db(dbName);

    const schemaDoc = await db.collection("projectSchema").findOne({ projectName });
    if (!schemaDoc) {
      return res.status(404).json({ error: `Schema not found for project: ${projectName}` });
    }
    res.json(schemaDoc);
  } catch (err) {
    console.error("Fetch schema failed:", err);
    res.status(500).json({ error: "Failed to fetch schema." });
  }
});

export default router;

