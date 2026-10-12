// Ripke’s Media Center – Chunk 8: Basic authentication

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
    cookie: { secure: false }, // set to true when you use HTTPS on Heroku
  }),
);

// Serve static files
app.use(express.static(path.join(__dirname)));

// ----- Auth routes -----
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
      // unique violation
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

// ----- Media route (unchanged from Chunk 7) -----
app.get("/api/media", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, type, image, category, year, description FROM media ORDER BY category, title",
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
      });
    });

    res.json(Object.values(categoriesMap));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Fallback for the frontend
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Ripke’s Media Center running at http://localhost:${PORT}`);
});
