// Ripke’s Media Center – Frontend JavaScript
// Chunk 1: Render sample media items into the grid and handle dark mode toggle.

const sampleMedia = [
  {
    id: 1,
    title: "The Matrix",
    type: "Movie",
    image: "https://via.placeholder.com/300x450/1d1d1f/f5f5f7?text=The+Matrix"
  },
  {
    id: 2,
    title: "Breaking Bad",
    type: "TV Show",
    image: "https://via.placeholder.com/300x450/0071e3/ffffff?text=Breaking+Bad"
  },
  {
    id: 3,
    title: "Planet Earth",
    type: "Documentary",
    image: "https://via.placeholder.com/300x450/34c759/ffffff?text=Planet+Earth"
  },
  {
    id: 4,
    title: "Abbey Road",
    type: "Music",
    image: "https://via.placeholder.com/300x450/ff2d55/ffffff?text=Abbey+Road"
  },
  {
    id: 5,
    title: "Family Photos",
    type: "Photos",
    image: "https://via.placeholder.com/300x450/ff9500/ffffff?text=Family+Photos"
  },
  {
    id: 6,
    title: "Home Video 2023",
    type: "Home Video",
    image: "https://via.placeholder.com/300x450/af52de/ffffff?text=Home+Video"
  },
  {
    id: 7,
    title: "JavaScript Basics",
    type: "Training",
    image: "https://via.placeholder.com/300x450/5856d6/ffffff?text=JS+Training"
  },
  {
    id: 8,
    title: "Inception",
    type: "Movie",
    image: "https://via.placeholder.com/300x450/1d1d1f/f5f5f7?text=Inception"
  }
];

function renderMediaGrid() {
  const grid = document.getElementById("media-grid");
  grid.innerHTML = ""; // clear any existing content

  sampleMedia.forEach(item => {
    const card = document.createElement("div");
    card.className = "media-card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="media-info">
        <div class="media-title">${item.title}</div>
        <div class="media-type">${item.type}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function setupThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  const body = document.body;

  // Check for saved preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark");
    toggle.textContent = "☀️";
  }

  toggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    const isDark = body.classList.contains("dark");
    toggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

function setCurrentYear() {
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// Run when the page loads
document.addEventListener("DOMContentLoaded", () => {
  renderMediaGrid();
  setupThemeToggle();
  setCurrentYear();
});
