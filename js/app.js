// Ripke’s Media Center – Frontend JavaScript
// Chunk 2: Category rows with horizontal scrolling

const mediaCategories = [
  {
    title: "Movies",
    items: [
      { id: 1, title: "The Matrix", image: "https://via.placeholder.com/300x450/1d1d1f/f5f5f7?text=The+Matrix" },
      { id: 2, title: "Inception", image: "https://via.placeholder.com/300x450/1d1d1f/f5f5f7?text=Inception" },
      { id: 3, title: "Interstellar", image: "https://via.placeholder.com/300x450/1d1d1f/f5f5f7?text=Interstellar" },
      { id: 4, title: "The Dark Knight", image: "https://via.placeholder.com/300x450/1d1d1f/f5f5f7?text=Dark+Knight" },
    ],
  },
  {
    title: "TV Shows",
    items: [
      { id: 5, title: "Breaking Bad", image: "https://via.placeholder.com/300x450/0071e3/ffffff?text=Breaking+Bad" },
      { id: 6, title: "Stranger Things", image: "https://via.placeholder.com/300x450/0071e3/ffffff?text=Stranger+Things" },
      { id: 7, title: "The Office", image: "https://via.placeholder.com/300x450/0071e3/ffffff?text=The+Office" },
    ],
  },
  {
    title: "Documentaries",
    items: [
      { id: 8, title: "Planet Earth", image: "https://via.placeholder.com/300x450/34c759/ffffff?text=Planet+Earth" },
      { id: 9, title: "Our Planet", image: "https://via.placeholder.com/300x450/34c759/ffffff?text=Our+Planet" },
    ],
  },
  {
    title: "Music",
    items: [
      { id: 10, title: "Abbey Road", image: "https://via.placeholder.com/300x450/ff2d55/ffffff?text=Abbey+Road" },
      { id: 11, title: "Thriller", image: "https://via.placeholder.com/300x450/ff2d55/ffffff?text=Thriller" },
    ],
  },
  {
    title: "Photos",
    items: [
      { id: 12, title: "Family Photos", image: "https://via.placeholder.com/300x450/ff9500/ffffff?text=Family+Photos" },
      { id: 13, title: "Vacation 2024", image: "https://via.placeholder.com/300x450/ff9500/ffffff?text=Vacation" },
    ],
  },
  {
    title: "Home Videos",
    items: [{ id: 14, title: "Home Video 2023", image: "https://via.placeholder.com/300x450/af52de/ffffff?text=Home+Video" }],
  },
  {
    title: "Training",
    items: [
      { id: 15, title: "JavaScript Basics", image: "https://via.placeholder.com/300x450/5856d6/ffffff?text=JS+Training" },
      { id: 16, title: "Node.js Intro", image: "https://via.placeholder.com/300x450/5856d6/ffffff?text=Node.js" },
    ],
  },
];

function createMediaCard(item) {
  const card = document.createElement("div");
  card.className = "media-card";
  card.innerHTML = `
    <img src="${item.image}" alt="${item.title}">
    <div class="media-info">
      <div class="media-title">${item.title}</div>
    </div>
  `;
  return card;
}

function renderCategoryRows() {
  const container = document.getElementById("library");
  container.innerHTML = "";

  mediaCategories.forEach((category) => {
    const section = document.createElement("section");
    section.className = "category-row";

    const heading = document.createElement("h2");
    heading.textContent = category.title;
    section.appendChild(heading);

    const scroller = document.createElement("div");
    scroller.className = "row-scroller";

    category.items.forEach((item) => {
      scroller.appendChild(createMediaCard(item));
    });

    section.appendChild(scroller);
    container.appendChild(section);
  });
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
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCategoryRows();
  setupThemeToggle();
  setCurrentYear();
});
