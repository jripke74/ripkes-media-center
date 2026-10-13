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

## Chunk 1.2: Footer with Dynamic Copyright Year

### What we added
A simple footer at the bottom of `index.html`:

```html
<footer class="footer">
  <p>&copy; <span id="current-year"></span> Jeff Ripke. All rights reserved.</p>
</footer>
```

- The year is filled in automatically by JavaScript using `new Date().getFullYear()`.
- CSS styles it to match the light/dark theme and stay subtle (small text, centered, top border).

### Why a dynamic year?
Hard-coding the year means you have to remember to update it every January. Letting JavaScript set it keeps the footer accurate without any maintenance.

### What you should do
```bash
git add index.html css/styles.css js/app.js DEVELOPMENT.md
git commit -m "Add footer with dynamic copyright year"
```

### Key learning note
- We used a `<span id="current-year">` so JavaScript can target just that piece of text.
- `new Date().getFullYear()` is a built-in JavaScript method that returns the current four-digit year.
- The footer uses the same CSS variables as the rest of the page, so it automatically respects light and dark mode.

---
*Last updated: Chunk 1.2 – Footer with dynamic year*

## Chunk 2: Backend Setup with Express

### What we did
- Initialized a Node.js project with `npm init`.
- Installed Express.
- Created `server.js` to serve the static frontend and a basic `/api/media` endpoint.
- Updated `package.json` with a start script.

### Key learning notes
- Express serves static files from the project root.
- The frontend fetches media data from the API instead of using hard-coded data.
- We use `app.use(express.static('.'))` so the browser can load `index.html`, CSS, and JS.

## Chunk 3: PostgreSQL Integration

### What we did
- Installed the `pg` package.
- Created a `media` table.
- Seeded sample movies, TV shows, and music.
- Updated the API to query the database.

### Key learning notes
- Connection details live in environment variables or a config object for now.
- The query groups items by category for the frontend rows.

## Chunk 4: Authentication (Email + Password)

### What we did
- Added `users` table and `bcrypt` for password hashing.
- Created `/api/register`, `/api/login`, `/api/logout`, and `/api/me` routes.
- Protected the media API with a session check.
- Added a login/register modal on the frontend.

### Key learning notes
- Passwords are never stored in plain text.
- Sessions keep the user logged in across page reloads.
- The frontend checks `/api/me` on load and shows the login prompt if needed.

## Chunk 5–10: Search, Detail Panel, and Polish

### What we did
- Client-side search that filters the visible cards.
- Detail overlay that shows title, year, description, and poster.
- Dark mode persistence with `localStorage`.
- Basic responsive adjustments.

## Chunk 11: Video Playback

### What we did
- Added a `video_url` column.
- Updated the detail panel to show an HTML5 `<video>` element when a URL is present.
- Sample public MP4s were used for testing.

## Chunk 12: Audio Playback

### What we did
- Added an `audio_url` column.
- Detail panel now shows an `<audio>` player for music items.
- Priority: video → audio → poster image.

## Chunk 13: Improved Detail Panel Layout

### What we did
- Split the detail panel into a media column and an info column.
- Side-by-side layout on screens ≥ 640 px; stacked on smaller screens.

## Post-Chunk 13: Header, Footer, and Responsive Polish

### What we did
- Rebuilt the header multiple times for reliability.
- Added a working hamburger menu for screens ≤ 680 px.
- Improved login prompt and form (larger type, better spacing).
- Made the footer larger and more prominent.
- Media cards stack vertically on very small screens and return to horizontal rows on wider screens.
- Added better focus states and larger touch targets for accessibility.

### Suggested commit for recent polish
```bash
git add index.html css/styles.css js/app.js DEVELOPMENT.md
git commit -m "Polish header, footer, login prompt, and responsive media layout"
```

### Next chunk ideas (Chunk 14)
- Simple form to add new media items.
- More metadata (genre, duration, rating).
- “Continue Watching” or “Recently Added” row.
- Better error handling for failed video/audio loads.

---
*Last updated: Chunk 13 + post-chunk polish*

## Chunk 15: Edit and Delete Media

### What we did
- Added Edit and Delete buttons on each media card (visible only when logged in).
- Created an edit modal that reuses the same fields as the add form.
- Added protected `PUT /api/media/:id` and `DELETE /api/media/:id` routes.
- After an edit or delete, the library refreshes.

### Key learning notes
- `PUT` is used for updating an existing resource.
- `DELETE` removes a resource.
- Confirmation dialogs help prevent accidental deletes.
- We toggle the visibility of action buttons based on login state.

### Commit
```bash
git add index.html css/styles.css js/app.js server.js DEVELOPMENT.md
git commit -m "Add edit and delete for media items"