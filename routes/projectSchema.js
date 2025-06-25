// routes/projectSchema.js

import express from "express";
import { getMongoClient } from "../db.js";

const router = express.Router();

// GET all project schemas
// Example: GET /api/projectSchema?mongoURI=yourMongoURI
router.get("/", async (req, res) => {
  const { mongoURI } = req.query;

  if (!mongoURI) {
    return res.status(400).json({ error: "Missing mongoURI query parameter." });
  }

  try {
    const client = await getMongoClient(mongoURI);
    const db = client.db(); // Uses the DB from the connection string

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
// Example: GET /api/projectSchema/project?projectName=X&mongoURI=yourMongoURI
router.get("/project", async (req, res) => {
  const { mongoURI, projectName } = req.query;

  if (!mongoURI || !projectName) {
    return res.status(400).json({ error: "Missing mongoURI or projectName query parameter." });
  }

  try {
    const client = await getMongoClient(mongoURI);
    const db = client.db();

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
