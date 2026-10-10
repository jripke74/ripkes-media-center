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

---
*Last updated: Chunk 1*
