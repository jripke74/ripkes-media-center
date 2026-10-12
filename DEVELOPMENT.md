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

## Chunk 3: Search + Basic Detail View

### What we added
- Search input in the header that filters cards by title or type across all categories.
- Empty rows are hidden when nothing matches.
- Clicking any card opens a simple detail panel with the image, title, type, and a Play button (placeholder for now).
- Overlay closes when you click the × or the dark background.

### Key learning notes
- Search uses the `input` event and checks `dataset` attributes we stored on each card.
- The detail view is just a fixed overlay (`position: fixed`) shown/hidden with a CSS class.
- The Play button currently shows an alert; real video/audio playback comes later.
- We kept the existing horizontal row layout and dark mode.

### Commit
```bash
git add index.html css/styles.css js/app.js DEVELOPMENT.md
git commit -m "Add search filter and basic detail view for media cards"

## Chunk 4: Node.js + Express Backend (basic)

### What we did
- Added a simple Express server (`server.js`).
- The server serves the existing frontend files.
- Added a `/api/media` endpoint that returns the sample library as JSON.
- Created `package.json` and installed Express.

### Why this step?
This is the start of the backend. The frontend still works the same way, but now we have a server we can extend (authentication, database, real media files, etc.).

### How to run it
```bash
npm install express   # only needed the first time
npm start

## Chunk 5: Load Media from the API

### What we did
- Removed the hard-coded `mediaCategories` array from `js/app.js`.
- Added an `async` function `loadMedia()` that fetches `/api/media`.
- The rest of the UI (rows, search, detail panel, dark mode) is unchanged.
- Added a simple error message if the server is not running.

### Why this matters
The frontend no longer owns the data. This is the start of a real client/server split. Later we can swap the sample data in `server.js` for real database results without changing the UI code.

### Key learning notes
- `fetch("/api/media")` requests JSON from our Express server.
- `async/await` makes the asynchronous code easy to read.
- We call `loadMedia()` on `DOMContentLoaded` so the page is ready before we try to render.
- Error handling is basic for now (console + a message on the page).

### Commit
```bash
git add js/app.js DEVELOPMENT.md
git commit -m "Load media library from /api/media instead of hard-coded data"

## Chunk 7: Year and Description in the Detail View

### What we did
- Added `year` and `description` columns to the `media` table.
- Updated the sample data with values for those columns.
- Modified the `/api/media` query and response to include the new fields.
- Updated the detail panel (HTML + JS + CSS) to display them.

### Key learning notes
- `ALTER TABLE` lets us add columns without recreating the table.
- The frontend only needs to read the extra properties that now arrive from the API.
- We kept the changes small so the existing search and category rows continue to work.

### Commit
```bash
git add server.js index.html js/app.js css/styles.css DEVELOPMENT.md
git commit -m "Add year and description fields to media and detail view"

## Chunk 8: Basic Email/Password Authentication

### What we did
- Created a `users` table.
- Added register, login, logout, and “who am I” API endpoints.
- Used bcrypt to hash passwords and express-session for login state.
- Added a simple login/register modal in the header.
- The media library continues to work for everyone (we have not locked it down yet).

### Key learning notes
- Passwords are never stored in plain text; bcrypt creates a one-way hash.
- Sessions keep the user logged in across page refreshes (cookie stored by the browser).
- The secret in the session config should be changed to a long random string before any real deployment.
- Registration and login share the same form; a small flag switches the mode.

### Commit
```bash
git add server.js index.html js/app.js css/styles.css package.json DEVELOPMENT.md
git commit -m "Add basic email/password registration and login"

## Chunk 9: Protect the Media Library

### What we did
- Added a `requireLogin` middleware that checks for a session.
- Applied it to the `/api/media` route so the API returns 401 if the user is not logged in.
- Updated the frontend so a 401 response shows a friendly “Please log in” prompt instead of the library.
- After login or logout the library automatically refreshes.

### Key learning notes
- Middleware in Express is just a function that can stop a request or pass it along with `next()`.
- The frontend treats a 401 status as “not authorized” and shows the right UI.
- Sessions still keep the user logged in across refreshes.

### Commit
```bash
git add server.js js/app.js css/styles.css DEVELOPMENT.md
git commit -m "Require login to view the media library"

## Chunk 10: Mobile-First Visual Refresh

### What we did
- Rewrote the CSS as mobile-first.
- Improved header, cards, horizontal rows, and the detail/auth panels for small screens.
- Added safe-area insets, better touch targets, and a bottom-sheet style modal on phones.
- Larger screens get wider cards, hover effects, and a centered modal.

### Commit
```bash
git add css/styles.css DEVELOPMENT.md
git commit -m "Improve UI with mobile-first responsive design"

## Chunk 10: Mobile-First Design & Visual Polish

### What we did
- Rewrote the CSS as mobile-first (base styles target phones, then media queries enhance for tablet and desktop).
- Improved the overall Apple-inspired look: better spacing, typography, card shadows, backdrop blur on the header, and refined buttons.
- Made the header stack on small screens and sit in a row on larger ones.
- Cards are smaller on mobile and grow on bigger screens.
- Touch-friendly targets and smoother scrolling.
- Polished the detail panel, login prompt, and footer.

### Key learning notes
- Mobile-first means writing the default styles for small screens, then using `@media (min-width: …)` to add enhancements.
- CSS custom properties (variables) make theming and dark mode much easier.
- `backdrop-filter` gives the sticky header a modern frosted-glass look (supported in modern browsers).
- Horizontal scrollers work especially well on touch devices.

### Commit
```bash
git add css/styles.css index.html DEVELOPMENT.md
git commit -m "Make design mobile-first and improve visual polish"