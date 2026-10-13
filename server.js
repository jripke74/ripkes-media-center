// Ripke’s Media Center – Chunk 11: Basic video playback

const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

// Database
const pool = new Pool({
  user: process.env.PGUSER || "macprolaptop", // ← change this
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "ripkes_media",
  password: process.env.PGPASSWORD || "",
  port: process.env.PGPORT || 5432,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "change-this-to-a-long-random-string-later",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

app.use(express.static(path.join(__dirname)));

function requireLogin(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ error: "Please log in" });
}

// Auth routes
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, password_hash],
    );
    req.session.userId = result.rows[0].id;
    req.session.email = result.rows[0].email;
    res.json({
      message: "Registered and logged in",
      email: result.rows[0].email,
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "Email already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    req.session.userId = user.id;
    req.session.email = user.email;
    res.json({ message: "Logged in", email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

app.get("/api/me", (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true, email: req.session.email });
  } else {
    res.json({ loggedIn: false });
  }
});

// Media route (includes video_url and audio_url)
app.get("/api/media", requireLogin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, type, image, category, year, description, video_url, audio_url FROM media ORDER BY category, title",
    );

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
        year: row.year,
        description: row.description,
        video_url: row.video_url,
        audio_url: row.audio_url,
      });
    });

    res.json(Object.values(categoriesMap));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/api/media/:id", requireLogin, async (req, res) => {
  const { id } = req.params;
  const {
    title,
    type,
    category,
    year,
    description,
    image,
    video_url,
    audio_url,
  } = req.body;
  if (!title || !type || !category) {
    return res
      .status(400)
      .json({ error: "Title, type, and category are required" });
  }
  try {
    await pool.query(
      `UPDATE media
       SET title = $1, type = $2, category = $3, year = $4,
           description = $5, image = $6, video_url = $7, audio_url = $8
       WHERE id = $9`,
      [
        title,
        type,
        category,
        year || null,
        description || null,
        image || null,
        video_url || null,
        audio_url || null,
        id,
      ],
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update media" });
  }
});

app.delete("/api/media/:id", requireLogin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM media WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete media" });
  }
});

app.post("/api/media", requireLogin, async (req, res) => {
  const {
    title,
    type,
    category,
    year,
    description,
    image,
    video_url,
    audio_url,
  } = req.body;
  if (!title || !type || !category) {
    return res
      .status(400)
      .json({ error: "Title, type, and category are required" });
  }
  try {
    await pool.query(
      `INSERT INTO media (title, type, category, year, description, image, video_url, audio_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        title,
        type,
        category,
        year || null,
        description || null,
        image || null,
        video_url || null,
        audio_url || null,
      ],
    );
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not add media" });
  }
});

// Fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Ripke’s Media Center running at http://localhost:${PORT}`);
});
