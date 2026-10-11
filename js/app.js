// Ripke’s Media Center – Chunk 3: Search + detail view

const mediaCategories = [
  {
    title: "Movies",
    items: [
      { id: 1, title: "The Matrix", type: "Movie", image: "https://via.placeholder.com/300x450/1d1d1f/f5f5f7?text=The+Matrix" },
      { id: 2, title: "Inception", type: "Movie", image: "https://via.placeholder.com/300x450/1d1d1f/f5f5f7?text=Inception" },
      { id: 3, title: "Interstellar", type: "Movie", image: "https://via.placeholder.com/300x450/1d1d1f/f5f5f7?text=Interstellar" },
      { id: 4, title: "The Dark Knight", type: "Movie", image: "https://via.placeholder.com/300x450/1d1d1f/f5f5f7?text=Dark+Knight" }
    ]
  },
  {
    title: "TV Shows",
    items: [
      { id: 5, title: "Breaking Bad", type: "TV Show", image: "https://via.placeholder.com/300x450/0071e3/ffffff?text=Breaking+Bad" },
      { id: 6, title: "Stranger Things", type: "TV Show", image: "https://via.placeholder.com/300x450/0071e3/ffffff?text=Stranger+Things" },
      { id: 7, title: "The Office", type: "TV Show", image: "https://via.placeholder.com/300x450/0071e3/ffffff?text=The+Office" }
    ]
  },
  {
    title: "Documentaries",
    items: [
      { id: 8, title: "Planet Earth", type: "Documentary", image: "https://via.placeholder.com/300x450/34c759/ffffff?text=Planet+Earth" },
      { id: 9, title: "Our Planet", type: "Documentary", image: "https://via.placeholder.com/300x450/34c759/ffffff?text=Our+Planet" }
    ]
  },
  {
    title: "Music",
    items: [
      { id: 10, title: "Abbey Road", type: "Music", image: "https://via.placeholder.com/300x450/ff2d55/ffffff?text=Abbey+Road" },
      { id: 11, title: "Thriller", type: "Music", image: "https://via.placeholder.com/300x450/ff2d55/ffffff?text=Thriller" }
    ]
  },
  {
    title: "Photos",
    items: [
      { id: 12, title: "Family Photos", type: "Photos", image: "https://via.placeholder.com/300x450/ff9500/ffffff?text=Family+Photos" },
      { id: 13, title: "Vacation 2024", type: "Photos", image: "https://via.placeholder.com/300x450/ff9500/ffffff?text=Vacation" }
    ]
  },
  {
    title: "Home Videos",
    items: [
      { id: 14, title: "Home Video 2023", type: "Home Video", image: "https://via.placeholder.com/300x450/af52de/ffffff?text=Home+Video" }
    ]
  },
  {
    title: "Training",
    items: [
      { id: 15, title: "JavaScript Basics", type: "Training", image: "https://via.placeholder.com/300x450/5856d6/ffffff?text=JS+Training" },
      { id: 16, title: "Node.js Intro", type: "Training", image: "https://via.placeholder.com/300x450/5856d6/ffffff?text=Node.js" }
    ]
  }
];

let allCards = []; // flat list for search

function createMediaCard(item) {
  const card = document.createElement("div");
  card.className = "media-card";
  card.dataset.title = item.title.toLowerCase();
  card.dataset.type = item.type.toLowerCase();
  card.innerHTML = `
    <img src="${item.image}" alt="${item.title}">
    <div class="media-info">
      <div class="media-title">${item.title}</div>
    </div>
  `;
  card.addEventListener("click", () => openDetail(item));
  allCards.push(card);
  return card;
}

function renderCategoryRows() {
  const container = document.getElementById("library");
  container.innerHTML = "";
  allCards = [];

  mediaCategories.forEach(category => {
    const section = document.createElement("section");
    section.className = "category-row";

    const heading = document.createElement("h2");
    heading.textContent = category.title;
    section.appendChild(heading);

    const scroller = document.createElement("div");
    scroller.className = "row-scroller";

    category.items.forEach(item => {
      scroller.appendChild(createMediaCard(item));
    });

    section.appendChild(scroller);
    container.appendChild(section);
  });
}

function filterMedia(query) {
  const q = query.toLowerCase().trim();
  const rows = document.querySelectorAll(".category-row");

  rows.forEach(row => {
    const cards = row.querySelectorAll(".media-card");
    let visibleCount = 0;

    cards.forEach(card => {
      const matches = !q ||
        card.dataset.title.includes(q) ||
        card.dataset.type.includes(q);
      card.style.display = matches ? "" : "none";
      if (matches) visibleCount++;
    });

    row.classList.toggle("hidden", visibleCount === 0);
  });
}

function openDetail(item) {
  document.getElementById("detail-image").src = item.image;
  document.getElementById("detail-image").alt = item.title;
  document.getElementById("detail-title").textContent = item.title;
  document.getElementById("detail-type").textContent = item.type;
  document.getElementById("detail-overlay").classList.remove("hidden");
}

function closeDetail() {
  document.getElementById("detail-overlay").classList.add("hidden");
}

function setupThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  const body = document.body;

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
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

function setupSearch() {
  const input = document.getElementById("search-input");
  input.addEventListener("input", () => filterMedia(input.value));
}

function setupDetail() {
  document.getElementById("detail-close").addEventListener("click", closeDetail);
  document.getElementById("detail-overlay").addEventListener("click", (e) => {
    if (e.target.id === "detail-overlay") closeDetail();
  });
  document.getElementById("detail-play").addEventListener("click", () => {
    alert("Playback will be added in a later chunk.");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCategoryRows();
  setupThemeToggle();
  setCurrentYear();
  setupSearch();
  setupDetail();
});
