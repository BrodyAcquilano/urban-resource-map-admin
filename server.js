import express from "express";
import dotenv from "dotenv";
import connectToMongo from "./db.js";
import schemaRoutes from "./routes/projectSchema.js";
import locationRoutes from "./routes/locations.js";


import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/schema", schemaRoutes);
app.use("/api/locations", locationRoutes);


async function startServer() {
  const db = await connectToMongo();
  app.locals.db = db;

  app.get("/", (req, res) => {
    res.send("🌐 Urban Resource Map backend is running.");
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server is listening on port ${PORT}`);
  });
}

startServer();
