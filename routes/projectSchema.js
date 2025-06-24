import express from "express";
const router = express.Router();

// GET all project schemas
router.get("/", async (req, res) => {
  const db = req.app.locals.db;

  try {
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

// GET specific schema by projectName (via query parameter)
router.get("/project", async (req, res) => {
  const db = req.app.locals.db;
  const { projectName } = req.query;

  if (!projectName) {
    return res.status(400).json({ error: "Missing projectName query parameter." });
  }

  try {
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
