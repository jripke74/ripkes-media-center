// Ripke’s Media Center – Chunk 6: PostgreSQL

const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection (local development defaults)
const pool = new Pool({
  user: process.env.PGUSER || "macprolaptop", // change this if needed
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "ripkes_media",
  password: process.env.PGPASSWORD || "", // leave blank for local peer auth
  port: process.env.PGPORT || 5432,
});

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// GET /api/media – returns categories the frontend expects
app.get("/api/media", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, type, image, category FROM media ORDER BY category, title",
    );

    // Group flat rows into the category structure the frontend uses
    const categoriesMap = {};
    result.rows.forEach((row) => {
      if (!categoriesMap[row.category]) {
        categoriesMap[row.category] = { title: row.category, items: [] };
      }
      categoriesMap[row.category].items.push({
        id: row.id,
        title: row.title,
        type: row.type,
        image: row.image,
      });
    });

    const mediaCategories = Object.values(categoriesMap);
    res.json(mediaCategories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Fallback for the frontend (must be last)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Ripke’s Media Center running at http://localhost:${PORT}`);
});
