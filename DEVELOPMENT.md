# Ripke’s Media Center – Development Guide

This file tracks what we build, why we build it, and explanations of the code. We work in small ~30-minute chunks.

## Project Goals
- Full-stack media center (movies, TV, music, photos, etc.) similar to Infuse / Jellyfin / Plex.
- Beginner-friendly learning project.
- Tech: HTML, CSS, JavaScript (frontend) → Node.js + Express + PostgreSQL (backend).
- Architecture: MVC + modular/layered.
- Visual style: Light theme by default, dark mode option. Apple TV-inspired grid / row scrolling.
- Multi-user from the start (auth added early, currently email/password; Apple Sign In and SMS 2FA later).
- Hosting: Heroku (paid Eco dynos). GitHub repo under jripke74.
- Media: Start with sample/placeholder data and images. Local storage for development; production will use durable storage later.

## Chunk 1: Project Setup & Basic Frontend Grid (this session)

### What we are doing
1. Create the project folder and initialize Git.
2. Set up a clean folder structure for the frontend.
3. Build a simple HTML page with a responsive media grid.
4. Add basic CSS for light theme + dark mode toggle.
5. Use JavaScript to render sample media items.
6. Create this DEVELOPMENT.md file.

### Why this order?
We start with the frontend so you can see something visual immediately. No backend yet. This keeps the first chunk small and focused.

### Folder structure we are creating
```
ripkes-media-center/
├── DEVELOPMENT.md          ← this file
├── README.md
├── index.html              ← main page
├── css/
│   └── styles.css
└── js/
    └── app.js
```

### Git workflow (do this on your Mac)
1. Open Terminal.
2. Navigate to where you keep projects, e.g.:
   ```bash
   cd ~/Projects   # or wherever you prefer
   ```
3. Create and enter the folder:
   ```bash
   mkdir ripkes-media-center
   cd ripkes-media-center
   ```
4. Initialize Git:
   ```bash
   git init
   ```
5. Create a .gitignore (we will add it later if needed; for now it is optional).
6. After adding the files from this chunk, make the first commit:
   ```bash
   git add .
   git commit -m "Initial frontend: basic media grid with light/dark theme"
   ```
7. Create a new repository on GitHub.com under your account (jripke74) named `ripkes-media-center`.
8. Connect and push (GitHub will show you the exact commands after you create the empty repo):
   ```bash
   git remote add origin https://github.com/jripke74/ripkes-media-center.git
   git branch -M main
   git push -u origin main
   ```

### Next chunk (preview)
- Polish the UI (better Apple TV-style rows, hover effects).
- Add a simple navigation header.
- Introduce more sample media categories (Movies, TV, Music, Photos).
- Begin thinking about the backend (Node.js + Express).

### Key learning notes for this chunk
- **HTML** provides the structure.
- **CSS** controls appearance and layout (we use CSS Grid / Flexbox).
- **JavaScript** dynamically generates the media cards from data so we don’t hard-code dozens of HTML elements.
- Dark mode is done with a CSS class on the `<body>` and a toggle button.
- All of this is pure vanilla (no frameworks) so you understand the fundamentals.

## Chunk 1.1: SEO Meta Tags in the HTML Head

### What we added
Basic SEO-friendly metadata inside the `<head>` of `index.html`:

- **Title** – Clear, descriptive page title.
- **Meta description** – Short summary shown in search results (aim for ~150–160 characters).
- **Keywords** – Optional; modern search engines mostly ignore this, but it doesn’t hurt for a learning project.
- **Canonical URL** – Tells search engines the preferred address of the page (update the placeholder when you deploy to Heroku).
- **Open Graph tags** – Control how the page looks when shared on Facebook, LinkedIn, Slack, etc.
- **Twitter Card tags** – Similar control for Twitter/X.
- **Theme color** – Lets the browser tint its UI to match the light/dark theme.

### Why this matters
Even for a personal/learning project, good metadata helps if you later share the link or want the site to look professional in search results and social shares. These tags are free and only take a minute to add.

### What you should do
1. Replace the placeholder URLs (`https://your-app-name.herokuapp.com/`) with your real Heroku app URL once you deploy.
2. Later you can replace the placeholder Open Graph image with a real screenshot or logo.
3. Commit the change:
   ```bash
   git add index.html DEVELOPMENT.md
   git commit -m "Add SEO meta tags and Open Graph data to index.html"
   ```

### Key learning note
The `<head>` is for information *about* the page, not content the user sees. Search engines and social platforms read these tags. The visible content stays in the `<body>`.

---
*Last updated: Chunk 1.1 – SEO meta tags*

## Chunk 2: Apple TV-Style Horizontal Category Rows

### What we did
- Grouped sample media into categories (Movies, TV Shows, Documentaries, Music, Photos, Home Videos, Training).
- Replaced the single grid with multiple horizontal scrolling rows.
- Each row scrolls sideways with the mouse wheel, trackpad, or touch.
- Cards stay the same size and keep the hover lift effect.

### Why this layout?
This matches the “grid-like scrolling” / Apple TV look more closely than a single wrapping grid. Users can scan categories quickly and scroll within each row.

### Key learning notes
- We used Flexbox (`display: flex`) + `overflow-x: auto` for the horizontal scroller.
- `flex: 0 0 180px` keeps every card the same fixed width so the row doesn’t shrink them.
- JavaScript now builds the entire library dynamically from the `mediaCategories` array.
- The old single-grid code was removed so the page stays clean.

### Commit
```bash
git add index.html css/styles.css js/app.js DEVELOPMENT.md
git commit -m "Add horizontal category rows for Apple TV-style library"
