const express = require("express");
const path = require("path");
const fs = require("fs");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const session = require("express-session");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

// Database
const pool = new Pool({
  user: process.env.PGUSER || "macprolaptop",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "ripkes_media",
  password: process.env.PGPASSWORD || "",
  port: process.env.PGPORT || 5432,
});

// Uploads
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|mp4|webm|mp3|flac|m4a|wav/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) return cb(null, true);
    cb(new Error("Unsupported file type"));
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "change-this-to-a-long-random-string-later",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname)));
app.use("/uploads", express.static(uploadDir));

function requireLogin(req, res, next) {
  if (req.session.userId) return next();
  res.status(401).json({ error: "Please log in" });
}

async function requireAdmin(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: "Please log in" });
  try {
    const result = await pool.query("SELECT is_admin FROM users WHERE id = $1", [req.session.userId]);
    if (result.rows[0]?.is_admin) return next();
    res.status(403).json({ error: "Admin access required" });
  } catch (err) {
    res.status(500).json({ error: "Auth check failed" });
  }
}

// Auth routes
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, password_hash]
    );
    req.session.userId = result.rows[0].id;
    req.session.email = result.rows[0].email;
    res.json({ message: "Registered and logged in", email: result.rows[0].email });
  } catch (err) {
    if (err.code === "23505") return res.status(400).json({ error: "Email already exists" });
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid email or password" });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid email or password" });
    req.session.userId = user.id;
    req.session.email = user.email;
    res.json({ message: "Logged in", email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out" }));
});

app.get("/api/me", async (req, res) => {
  if (!req.session.userId) return res.json({ loggedIn: false });
  try {
    const result = await pool.query("SELECT email, is_admin FROM users WHERE id = $1", [req.session.userId]);
    const user = result.rows[0];
    res.json({ loggedIn: true, email: user.email, isAdmin: !!user.is_admin });
  } catch (err) {
    res.json({ loggedIn: false });
  }
});

// Media routes
app.get("/api/media", requireLogin, async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = 20;
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, title, type, image, category, year, description,
             video_url, audio_url, genre, duration, rating, created_at
      FROM media
    `;
    const params = [];
    if (q) {
      query += ` WHERE title ILIKE $1 OR type ILIKE $1 OR genre ILIKE $1 OR description ILIKE $1`;
      params.push(`%${q}%`);
    }
    query += ` ORDER BY created_at DESC NULLS LAST, title LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    let countQuery = "SELECT COUNT(*) FROM media";
    const countParams = [];
    if (q) {
      countQuery += " WHERE title ILIKE $1 OR type ILIKE $1 OR genre ILIKE $1 OR description ILIKE $1";
      countParams.push(`%${q}%`);
    }
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count, 10) || 0;

    const categoriesMap = {};
    result.rows.forEach(row => {
      if (!categoriesMap[row.category]) {
        categoriesMap[row.category] = { title: row.category, items: [] };
      }
      categoriesMap[row.category].items.push(row);
    });

    res.json({
      categories: Object.values(categoriesMap),
      page,
      totalPages: Math.ceil(total / limit) || 1,
      total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/media", requireAdmin, upload.fields([
  { name: "imageFile", maxCount: 1 },
  { name: "videoFile", maxCount: 1 },
  { name: "audioFile", maxCount: 1 }
]), async (req, res) => {
  const { title, type, category, year, description, genre, duration, rating } = req.body;
  if (!title || !type || !category) return res.status(400).json({ error: "Title, type, and category are required" });
  if (year && (year < 1900 || year > 2100)) return res.status(400).json({ error: "Year must be between 1900 and 2100" });
  if (rating && (rating < 0 || rating > 10)) return res.status(400).json({ error: "Rating must be between 0 and 10" });

  const image = req.files?.imageFile?.[0] ? `/uploads/${req.files.imageFile[0].filename}` : (req.body.image || null);
  const video_url = req.files?.videoFile?.[0] ? `/uploads/${req.files.videoFile[0].filename}` : (req.body.video_url || null);
  const audio_url = req.files?.audioFile?.[0] ? `/uploads/${req.files.audioFile[0].filename}` : (req.body.audio_url || null);

  try {
    await pool.query(
      `INSERT INTO media (title, type, category, year, description, image, video_url, audio_url, genre, duration, rating)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [title, type, category, year || null, description || null, image, video_url, audio_url, genre || null, duration || null, rating || null]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not add media" });
  }
});

app.put("/api/media/:id", requireAdmin, upload.fields([
  { name: "imageFile", maxCount: 1 },
  { name: "videoFile", maxCount: 1 },
  { name: "audioFile", maxCount: 1 }
]), async (req, res) => {
  const { id } = req.params;
  const { title, type, category, year, description, genre, duration, rating } = req.body;
  if (!title || !type || !category) return res.status(400).json({ error: "Title, type, and category are required" });

  const image = req.files?.imageFile?.[0] ? `/uploads/${req.files.imageFile[0].filename}` : (req.body.image || null);
  const video_url = req.files?.videoFile?.[0] ? `/uploads/${req.files.videoFile[0].filename}` : (req.body.video_url || null);
  const audio_url = req.files?.audioFile?.[0] ? `/uploads/${req.files.audioFile[0].filename}` : (req.body.audio_url || null);

  try {
    await pool.query(
      `UPDATE media SET title=$1, type=$2, category=$3, year=$4, description=$5,
       image=$6, video_url=$7, audio_url=$8, genre=$9, duration=$10, rating=$11 WHERE id=$12`,
      [title, type, category, year || null, description || null, image, video_url, audio_url, genre || null, duration || null, rating || null, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update media" });
  }
});

app.delete("/api/media/:id", requireAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM media WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete media" });
  }
});

app.get("/api/users", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, email, is_admin FROM users ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load users" });
  }
});

app.post("/api/users/:id/toggle-admin", requireAdmin, async (req, res) => {
  const { id } = req.params;
  if (parseInt(id) === req.session.userId) {
    return res.status(400).json({ error: "You cannot change your own admin status" });
  }
  try {
    const result = await pool.query(
      "UPDATE users SET is_admin = NOT is_admin WHERE id = $1 RETURNING is_admin",
      [id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, isAdmin: result.rows[0].is_admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update user" });
  }
});

app.delete("/api/users/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  if (parseInt(id) === req.session.userId) {
    return res.status(400).json({ error: "You cannot delete your own account" });
  }
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "User not found" });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete user" });
  }
});

app.use((req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.listen(PORT, () => {
  console.log(`Ripke’s Media Center running at http://localhost:${PORT}`);
});
