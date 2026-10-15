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

The `<head>` is for information _about_ the page, not content the user sees. Search engines and social platforms read these tags. The visible content stays in the `<body>`.

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

_Last updated: Chunk 1.2 – Footer with dynamic year_

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

_Last updated: Chunk 13 + post-chunk polish_

## Chunk 14: Add Media Form

### What we did

- Added a form on the main page for creating new media items.
- Created a protected `POST /api/media` endpoint.
- The form only appears when the user is logged in.
- After a successful add, the library refreshes.

### Key learning notes

- `POST` is used for creating resources.
- The form is hidden until the user is authenticated.
- We reuse the existing `loadMedia()` function to refresh the grid.

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
- Action buttons are shown or hidden based on login state.

## Chunk 16: More Metadata (Genre, Duration, Rating)

### What we did

- Added genre, duration (minutes), and rating (0–10) columns to the media table.
- Updated the add form, edit form, and detail panel to include the new fields.
- Backend routes now accept and return the extra metadata.

### Key learning notes

- `ALTER TABLE` is used to add columns to an existing table.
- Numeric fields are optional and stored as `NULL` when left blank.
- The detail view only shows a field when it has a value.

## Chunk 17: Recently Added Row

### What we did

- Added a `created_at` timestamp column to the media table.
- Updated the media API to return a “Recently Added” category at the top.
- The row shows the 12 newest items.

### Key learning notes

- `DEFAULT CURRENT_TIMESTAMP` automatically records when a row is created.
- We build a special category on the server and prepend it to the response.
- Limiting to 12 items keeps the row from getting too long.

## Chunk 18: Better Form Validation

### What we did

- Added client-side checks for required fields and valid ranges (year, rating).
- Improved error messages so the user knows what to fix.
- Added matching server-side validation.

### Key learning notes

- Client-side validation gives instant feedback.
- Server-side validation protects the database even if someone bypasses the form.
- Clear error messages improve the user experience.

### Suggested commit for recent chunks

```bash
git add index.html css/styles.css js/app.js server.js DEVELOPMENT.md
git commit -m "Add media CRUD, metadata, Recently Added row, and form validation"
```

### Next chunk ideas

- Image file upload instead of URL.
- Search that includes genre and description.
- “Continue Watching” placeholder.
- Sort options on category rows.

---

_Last updated: Chunk 18 – Form validation_

## Chunk 19: Admin Role, Media Uploads, and File Validation

### What we did

- Added an `is_admin` flag to users.
- Restricted add/edit/delete to admins.
- Added file upload support for images, videos, and audio using multer.
- Validated file types and size on the server.
- Forms accept either a file or a URL.

### Key learning notes

- Admin checks protect sensitive actions.
- `multer` handles multipart form data for file uploads.
- File validation reduces the risk of malicious uploads.
- Uploaded files are served from `/uploads`.

### Commit

````bash
git add server.js index.html js/app.js package.json DEVELOPMENT.md
git commit -m "Add admin role, file uploads, and validation"

## Chunk 20: Search Includes Genre and Description

### What we did
- Expanded the client-side search so it matches title, type, genre, and description.
- Stored the extra fields as data attributes on each card.

### Key learning notes
- Data attributes let us keep searchable text on the element without extra lookups.
- The filter still hides entire category rows when none of their cards match.
- This is still client-side; a later chunk can move search to the server if the library grows.

### Commit
```bash
git add js/app.js DEVELOPMENT.md
git commit -m "Expand search to include genre and description"

## Chunk 21: Genre and Description on Media Cards

### What we did
- Displayed genre and a short description directly on each media card.
- Truncated long descriptions so cards stay neat.
- Kept the existing search data attributes.

### Key learning notes
- Showing a preview on the card reduces the need to open the detail panel.
- CSS line clamping keeps the card height consistent.
- The full description is still available in the detail view.

### Commit
```bash
git add js/app.js css/styles.css DEVELOPMENT.md
git commit -m "Show genre and description on media cards"

## Chunk 22: Admin User List

### What we did
- Added a protected `/api/users` endpoint that returns all users.
- Created a simple “Users” section that only appears for admins.
- Displayed each user’s email and admin status.

### Key learning notes
- Admin-only routes use the existing `requireAdmin` middleware.
- The frontend checks `isAdmin` before showing the section.
- This is a read-only list for now; editing roles can come later.

### Commit
```bash
git add server.js index.html js/app.js DEVELOPMENT.md
git commit -m "Add admin user list"
````
## Chunk 23: Toggle Admin Status

### What we did
- Added a protected endpoint to flip a user’s admin flag.
- Added buttons on the user list so admins can promote or demote others.
- Prevented users from changing their own admin status.

### Key learning notes
- We use `NOT is_admin` to toggle the boolean in one query.
- The frontend reloads the list after a successful change.
- Protecting against self-demotion avoids locking yourself out.

### Commit
```bash
git add server.js js/app.js DEVELOPMENT.md
git commit -m "Allow admins to toggle user admin status"

## Chunk 24: Delete User Accounts

### What we did
- Added a protected `DELETE /api/users/:id` endpoint.
- Added a Delete button next to each user (except the current admin).
- Confirmation dialog prevents accidental deletion.

### Key learning notes
- Admins cannot delete their own account.
- The list refreshes after a successful delete.
- Confirmation dialogs are important for destructive actions.

### Commit
```bash
git add server.js js/app.js DEVELOPMENT.md
git commit -m "Allow admins to delete user accounts"

## Chunk 25: Upload Progress Feedback

### What we did
- Added a progress bar to the add and edit forms.
- Switched the upload to XMLHttpRequest so we can track progress.
- The bar appears during upload and hides when finished.

### Key learning notes
- `fetch` does not expose upload progress easily.
- `xhr.upload.onprogress` gives us the percentage.
- The progress element is hidden by default and shown only while uploading.

### Commit
```bash
git add index.html js/app.js DEVELOPMENT.md
git commit -m "Add upload progress feedback"

## Chunk 26: Server-side Search

### What we did
- Moved search from the browser to the server.
- The `/api/media` endpoint now accepts a `q` query parameter.
- Search matches title, type, genre, and description using `ILIKE`.
- The frontend waits 300 ms after typing before sending the request.

### Key learning notes
- Server-side search scales better as the library grows.
- `ILIKE` is case-insensitive.
- Debouncing prevents a request on every keystroke.

### Commit
```bash
git add server.js js/app.js DEVELOPMENT.md
git commit -m "Add server-side search"

## Chunk 27: Continue Watching Placeholder

### What we did
- Saved the last few opened items to localStorage.
- Added a “Continue Watching” row that appears at the top of the library.
- Limited the list to the 8 most recent items.

### Key learning notes
- localStorage keeps data between page loads in the browser.
- We rebuild the row after every media load so it stays in sync.
- This is a client-side placeholder; a later chunk can move it to the database.

### Commit
```bash
git add js/app.js DEVELOPMENT.md
git commit -m "Add Continue Watching row using localStorage"

## Chunk 28: Continue Watching in the Database

### What we did
- Created a `continue_watching` table linked to users and media.
- Added endpoints to save and retrieve the list.
- Updated the frontend to use the server instead of localStorage.
- Limited the list to the 8 most recent items per user.

### Key learning notes
- `ON CONFLICT` lets us upsert (insert or update) in one query.
- The list is now tied to the logged-in user.
- `ON DELETE CASCADE` cleans up entries if a user or media item is deleted.

### Commit
```bash
git add server.js js/app.js DEVELOPMENT.md
git commit -m "Move Continue Watching to the database"

## Chunk 29: Password Reset

### What we did
- Created a `password_resets` table for temporary codes.
- Added endpoints to request a code and to set a new password.
- Added a simple reset form inside the login modal.
- Codes expire after 15 minutes and can only be used once.

### Key learning notes
- We don’t reveal whether an email exists (good security practice).
- For learning we log the code to the console; a real app would email it.
- The code is marked as used after a successful reset.

### Commit
```bash
git add server.js index.html js/app.js DEVELOPMENT.md
git commit -m "Add password reset flow"