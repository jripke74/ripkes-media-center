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

function filterMedia(query) {
  const q = query.toLowerCase().trim();
  const rows = document.querySelectorAll(".category-row");

  rows.forEach((row) => {
    const cards = row.querySelectorAll(".media-card");
    let visibleCount = 0;

    cards.forEach((card) => {
      const matches =
        !q || card.dataset.title.includes(q) || card.dataset.type.includes(q);
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
  document.getElementById("detail-year").textContent = item.year
    ? `Year: ${item.year}`
    : "";
  document.getElementById("detail-description").textContent =
    item.description || "";
  document.getElementById("detail-overlay").classList.remove("hidden");
}

function closeDetail() {
  document.getElementById("detail-overlay").classList.add("hidden");
}

let isLoginMode = true;

function showAuthModal() {
  document.getElementById("auth-overlay").classList.remove("hidden");
  document.getElementById("auth-message").textContent = "";
}

function hideAuthModal() {
  document.getElementById("auth-overlay").classList.add("hidden");
}

function updateAuthUI(user) {
  const authArea = document.getElementById("auth-area");
  if (user && user.loggedIn) {
    authArea.innerHTML = `
      <span>${user.email}</span>
      <button id="logout-btn" class="auth-btn">Log out</button>
    `;
    document.getElementById("logout-btn").addEventListener("click", logout);
  } else {
    authArea.innerHTML = `<button id="show-login" class="auth-btn">Log in</button>`;
    document
      .getElementById("show-login")
      .addEventListener("click", showAuthModal);
  }
}

async function checkAuth() {
  try {
    const res = await fetch("/api/me");
    const data = await res.json();
    updateAuthUI(data);
    loadMedia(); // refresh the library based on login state
  } catch (err) {
    console.error(err);
  }
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("auth-email").value;
  const password = document.getElementById("auth-password").value;
  const endpoint = isLoginMode ? "/api/login" : "/api/register";

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      document.getElementById("auth-message").textContent =
        data.error || "Something went wrong";
      return;
    }
    hideAuthModal();
    checkAuth();
  } catch (err) {
    document.getElementById("auth-message").textContent = "Network error";
  }
}

async function logout() {
  await fetch("/api/logout", { method: "POST" });
  checkAuth();
}

function setupAuth() {
  document
    .getElementById("show-login")
    ?.addEventListener("click", showAuthModal);
  document
    .getElementById("auth-close")
    .addEventListener("click", hideAuthModal);
  document.getElementById("auth-overlay").addEventListener("click", (e) => {
    if (e.target.id === "auth-overlay") hideAuthModal();
  });
  document
    .getElementById("auth-form")
    .addEventListener("submit", handleAuthSubmit);

  document.getElementById("toggle-auth-mode").addEventListener("click", (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    document.getElementById("auth-title").textContent = isLoginMode
      ? "Log in"
      : "Register";
    document.getElementById("toggle-auth-text").innerHTML = isLoginMode
      ? 'Need an account? <a href="#" id="toggle-auth-mode">Register</a>'
      : 'Already have an account? <a href="#" id="toggle-auth-mode">Log in</a>';
    // re-bind the new link
    document
      .getElementById("toggle-auth-mode")
      .addEventListener("click", arguments.callee);
  });

  checkAuth();
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
    if (response.status === 401) {
      document.getElementById("library").innerHTML = `
        <div class="login-prompt">
          <h2>Please log in</h2>
          <p>Log in or create an account to view your media library.</p>
          <button id="prompt-login" class="auth-btn">Log in</button>
        </div>
      `;
      document
        .getElementById("prompt-login")
        .addEventListener("click", showAuthModal);
      return;
    }
    if (!response.ok) throw new Error("Failed to load media");
    mediaCategories = await response.json();
    renderCategoryRows();
  } catch (err) {
    console.error(err);
    const container = document.getElementById("library");
    if (container) {
      container.innerHTML = "<p>Could not load the media library.</p>";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupThemeToggle();
  setCurrentYear();
  setupSearch();
  setupDetail();
  setupAuth(); // this calls checkAuth → loadMedia
});
