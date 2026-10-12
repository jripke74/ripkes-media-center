// Ripke’s Media Center – Chunk 5: Load media from the API

let mediaCategories = []; // filled by the API

function createMediaCard(item) {
  const card = document.createElement("div");
  card.className = "media-card";
  card.dataset.title = item.title.toLowerCase();
  card.dataset.type = (item.type || "").toLowerCase();
  card.innerHTML = `
    <img src="${item.image}" alt="${item.title}">
    <div class="media-info">
      <div class="media-title">${item.title}</div>
    </div>
  `;
  card.addEventListener("click", () => openDetail(item));
  return card;
}

function renderCategoryRows() {
  const container = document.getElementById("library");
  container.innerHTML = "";

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
  document.getElementById("detail-type").textContent = item.type || "";
  document.getElementById("detail-year").textContent = item.year ? `Year: ${item.year}` : "";
  document.getElementById("detail-description").textContent = item.description || "";
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
  if (input) {
    input.addEventListener("input", () => filterMedia(input.value));
  }
}

function setupDetail() {
  const closeBtn = document.getElementById("detail-close");
  const overlay = document.getElementById("detail-overlay");
  const playBtn = document.getElementById("detail-play");

  if (closeBtn) closeBtn.addEventListener("click", closeDetail);
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target.id === "detail-overlay") closeDetail();
    });
  }
  if (playBtn) {
    playBtn.addEventListener("click", () => {
      alert("Playback will be added in a later chunk.");
    });
  }
}

async function loadMedia() {
  try {
    const response = await fetch("/api/media");
    if (!response.ok) throw new Error("Failed to load media");
    mediaCategories = await response.json();
    renderCategoryRows();
  } catch (err) {
    console.error(err);
    const container = document.getElementById("library");
    if (container) {
      container.innerHTML = "<p>Could not load the media library. Is the server running?</p>";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupThemeToggle();
  setCurrentYear();
  setupSearch();
  setupDetail();
  loadMedia(); // fetch and render
});
