// Ripke’s Media Center – Frontend
// Loads media from API, handles auth, search, detail view, theme, and mobile menu.

let mediaCategories = [];
let isLoginMode = true;

function createMediaCard(item) {
  const card = document.createElement("div");
  card.className = "media-card";
  card.dataset.id = item.id;
  card.dataset.title = (item.title || "").toLowerCase();
  card.dataset.type = (item.type || "").toLowerCase();
  card.dataset.genre = (item.genre || "").toLowerCase();
  card.dataset.description = (item.description || "").toLowerCase();

  const progressBar =
    item.progress && item.progress > 0
      ? `<div class="progress-bar"><div class="progress-fill" style="width:${Math.min(100, item.progress)}%"></div></div>`
      : "";

  card.innerHTML = `
    <img src="${item.image || ""}" alt="${item.title || ""}">
    ${progressBar}
    <div class="media-info">
      <div class="media-title">${item.title || ""}</div>
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
  const img = document.getElementById("detail-image");
  const video = document.getElementById("detail-video");
  const playBtn = document.getElementById("detail-play");

  document.getElementById("detail-title").textContent = item.title;
  document.getElementById("detail-type").textContent = item.type || "";
  document.getElementById("detail-year").textContent = item.year
    ? `Year: ${item.year}`
    : "";
  const genreEl = document.getElementById("detail-genre");
  const durationEl = document.getElementById("detail-duration");
  const ratingEl = document.getElementById("detail-rating");
  const actions = document.getElementById("detail-actions");
  const editBtn = document.getElementById("detail-edit");
  const deleteBtn = document.getElementById("detail-delete");

  if (actions && editBtn && deleteBtn) {
    // Show buttons only for admins
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.loggedIn && data.isAdmin) {
          actions.classList.remove("hidden");
          editBtn.onclick = () => {
            closeDetail();
            openEditModal(item);
          };
          deleteBtn.onclick = () => {
            if (confirm("Delete this item?")) {
              deleteMedia(item.id);
              closeDetail();
            }
          };
        } else {
          actions.classList.add("hidden");
        }
      })
      .catch(() => actions.classList.add("hidden"));
  }
  if (genreEl) genreEl.textContent = item.genre ? `Genre: ${item.genre}` : "";
  if (durationEl)
    durationEl.textContent = item.duration
      ? `Duration: ${item.duration} min`
      : "";
  if (ratingEl)
    ratingEl.textContent = item.rating ? `Rating: ${item.rating}/10` : "";
  document.getElementById("detail-description").textContent =
    item.description || "";

  // Reset previous video
  video.pause();
  video.style.display = "none";
  video.src = "";
  img.style.display = "block";

  if (item.video_url) {
    img.style.display = "none";
    video.style.display = "block";
    video.src = item.video_url;
    playBtn.textContent = "▶ Play Video";
    playBtn.onclick = () => video.play();

    // Resume from saved progress
    video.onloadedmetadata = () => {
      if (item.progress && item.progress > 0 && item.progress < 95) {
        video.currentTime = (item.progress / 100) * video.duration;
      }
    };

    video.ontimeupdate = () => {
      if (video.duration && item.id) {
        const progress = Math.round((video.currentTime / video.duration) * 100);
        fetch("/api/continue-watching", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mediaId: item.id, progress }),
        }).catch(() => {});
      }
    };
  } else {
    img.src = item.image;
    img.alt = item.title;
    playBtn.textContent = "▶ Play";
    playBtn.onclick = () => {
      alert("No video available for this item yet.");
    };
  }

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
    if (toggle) toggle.textContent = "☀️";
  }

  if (toggle) {
    toggle.addEventListener("click", () => {
      body.classList.toggle("dark");
      const isDark = body.classList.contains("dark");
      toggle.textContent = isDark ? "☀️" : "🌙";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }
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

function setupMenuToggle() {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("header-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    menu.classList.toggle("open");
    toggle.textContent = menu.classList.contains("open") ? "✕" : "☰";
  });
}

let currentPage = 1;

async function loadMedia(page) {
  if (typeof page === "number" && page > 0) {
    currentPage = page;
  }
  console.log("loadMedia using currentPage:", currentPage);
  try {
    const response = await fetch(`/api/media?page=${currentPage}`);
    if (response.status === 401) {
      document.getElementById("library").innerHTML = `
        <div class="login-prompt">
          <h2>Please log in</h2>
          <p>Log in or create an account to view your media library.</p>
          <button id="prompt-login" class="auth-btn">Log in</button>
        </div>
      `;
      const promptBtn = document.getElementById("prompt-login");
      if (promptBtn) promptBtn.addEventListener("click", showAuthModal);
      return;
    }
    if (!response.ok) throw new Error("Failed to load media");
    const data = await response.json();

    mediaCategories = data.categories || [];
    renderCategoryRows();
    renderPagination(data.page || currentPage, data.totalPages || 1);

    if (typeof showCardActionsIfLoggedIn === "function")
      showCardActionsIfLoggedIn();
  } catch (err) {
    console.error(err);
  }
}

function renderPagination(current, totalPages) {
  console.log("renderPagination:", current, totalPages);
  let nav = document.getElementById("pagination");
  if (!nav) {
    nav = document.createElement("div");
    nav.id = "pagination";
    nav.style.cssText =
      "display:flex; justify-content:center; gap:1rem; margin:1.5rem 0;";
    const library = document.getElementById("library");
    if (library && library.parentNode)
      library.parentNode.insertBefore(nav, library.nextSibling);
  }
  nav.innerHTML = "";
  if (!totalPages || totalPages <= 1) return;

  const prev = document.createElement("button");
  prev.className = "auth-btn";
  prev.textContent = "Previous";
  prev.disabled = current <= 1;
  prev.onclick = () => {
    currentPage = current - 1;
    loadMedia();
  };

  const info = document.createElement("span");
  info.textContent = `Page ${current} of ${totalPages}`;

  const next = document.createElement("button");
  next.className = "auth-btn";
  next.textContent = "Next";
  next.disabled = current >= totalPages;
  next.onclick = () => {
    currentPage = current + 1;
    loadMedia();
  };

  nav.append(prev, info, next);
}

function showAuthModal() {
  document.getElementById("auth-overlay").classList.remove("hidden");
  document.getElementById("auth-message").textContent = "";
}

function hideAuthModal() {
  document.getElementById("auth-overlay").classList.add("hidden");
}

function updateAuthUI(user) {
  const authArea = document.getElementById("auth-area");
  if (!authArea) return;

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
    loadMedia();
    // Also refresh add-media form visibility
    if (typeof updateAddMediaVisibility === "function") {
      updateAddMediaVisibility();
    }
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
  const closeBtn = document.getElementById("auth-close");
  const overlay = document.getElementById("auth-overlay");
  const form = document.getElementById("auth-form");
  const toggleLink = document.getElementById("toggle-auth-mode");

  if (closeBtn) closeBtn.addEventListener("click", hideAuthModal);
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target.id === "auth-overlay") hideAuthModal();
    });
  }
  if (form) form.addEventListener("submit", handleAuthSubmit);

  if (toggleLink) {
    toggleLink.addEventListener("click", (e) => {
      e.preventDefault();
      isLoginMode = !isLoginMode;
      document.getElementById("auth-title").textContent = isLoginMode
        ? "Log in"
        : "Register";
      document.getElementById("auth-toggle-text").innerHTML = isLoginMode
        ? 'Need an account? <a href="#" id="toggle-auth-mode">Register</a>'
        : 'Already have an account? <a href="#" id="toggle-auth-mode">Log in</a>';
      document
        .getElementById("toggle-auth-mode")
        .addEventListener("click", arguments.callee);
    });
  }

  checkAuth();
}

function setupAddMedia() {
  const section = document.getElementById("add-media-section");
  const form = document.getElementById("add-media-form");
  const message = document.getElementById("add-media-message");
  if (!section || !form) return;

  section.classList.add("hidden");

  window.updateAddMediaVisibility = async function () {
    try {
      const res = await fetch("/api/me");
      const data = await res.json();
      if (data.loggedIn && data.isAdmin) {
        section.classList.remove("hidden");
      } else {
        section.classList.add("hidden");
      }
    } catch (err) {
      section.classList.add("hidden");
    }
  };

  setTimeout(window.updateAddMediaVisibility, 150);
  window.updateAddMediaVisibility();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("new-title").value.trim();
    const type = document.getElementById("new-type").value.trim();
    const category = document.getElementById("new-category").value.trim();
    if (!title || !type || !category) {
      message.textContent = "Title, type, and category are required.";
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("category", category);
    formData.append("year", document.getElementById("new-year").value || "");
    formData.append("genre", document.getElementById("new-genre").value.trim());
    formData.append(
      "duration",
      document.getElementById("new-duration").value || "",
    );
    formData.append(
      "rating",
      document.getElementById("new-rating").value || "",
    );
    formData.append(
      "description",
      document.getElementById("new-description").value.trim(),
    );
    formData.append("image", document.getElementById("new-image").value.trim());
    formData.append(
      "video_url",
      document.getElementById("new-video").value.trim(),
    );
    formData.append(
      "audio_url",
      document.getElementById("new-audio").value.trim(),
    );

    if (document.getElementById("new-image-file").files[0])
      formData.append(
        "imageFile",
        document.getElementById("new-image-file").files[0],
      );
    if (document.getElementById("new-video-file").files[0])
      formData.append(
        "videoFile",
        document.getElementById("new-video-file").files[0],
      );
    if (document.getElementById("new-audio-file").files[0])
      formData.append(
        "audioFile",
        document.getElementById("new-audio-file").files[0],
      );

    try {
      const res = await fetch("/api/media", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        message.textContent = data.error || "Failed to add";
        return;
      }
      message.textContent = "Added successfully!";
      form.reset();
      loadMedia();
    } catch (err) {
      message.textContent = "Network error";
    }
  });
}

function openEditModal(item) {
  document.getElementById("edit-id").value = item.id || "";
  document.getElementById("edit-title").value = item.title || "";
  document.getElementById("edit-type").value = item.type || "";
  document.getElementById("edit-category").value = item.category || "";
  document.getElementById("edit-year").value = item.year || "";
  document.getElementById("edit-genre").value = item.genre || "";
  document.getElementById("edit-duration").value = item.duration || "";
  document.getElementById("edit-rating").value = item.rating || "";
  document.getElementById("edit-description").value = item.description || "";
  document.getElementById("edit-image").value = item.image || "";
  document.getElementById("edit-video").value = item.video_url || "";
  document.getElementById("edit-audio").value = item.audio_url || "";
  const msg = document.getElementById("edit-message");
  if (msg) msg.textContent = "";
  document.getElementById("edit-overlay")?.classList.remove("hidden");
}

function closeEditModal() {
  document.getElementById("edit-overlay")?.classList.add("hidden");
}

function setupEdit() {
  const closeBtn = document.getElementById("edit-close");
  const overlay = document.getElementById("edit-overlay");
  const form = document.getElementById("edit-media-form");
  const message = document.getElementById("edit-message");

  if (closeBtn) closeBtn.addEventListener("click", closeEditModal);
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target.id === "edit-overlay") closeEditModal();
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("edit-id").value;
      const formData = new FormData();
      formData.append(
        "title",
        document.getElementById("edit-title").value.trim(),
      );
      formData.append(
        "type",
        document.getElementById("edit-type").value.trim(),
      );
      formData.append(
        "category",
        document.getElementById("edit-category").value.trim(),
      );
      formData.append("year", document.getElementById("edit-year").value || "");
      formData.append(
        "genre",
        document.getElementById("edit-genre").value.trim(),
      );
      formData.append(
        "duration",
        document.getElementById("edit-duration").value || "",
      );
      formData.append(
        "rating",
        document.getElementById("edit-rating").value || "",
      );
      formData.append(
        "description",
        document.getElementById("edit-description").value.trim(),
      );
      formData.append(
        "image",
        document.getElementById("edit-image").value.trim(),
      );
      formData.append(
        "video_url",
        document.getElementById("edit-video").value.trim(),
      );
      formData.append(
        "audio_url",
        document.getElementById("edit-audio").value.trim(),
      );

      if (document.getElementById("edit-image-file")?.files[0])
        formData.append(
          "imageFile",
          document.getElementById("edit-image-file").files[0],
        );
      if (document.getElementById("edit-video-file")?.files[0])
        formData.append(
          "videoFile",
          document.getElementById("edit-video-file").files[0],
        );
      if (document.getElementById("edit-audio-file")?.files[0])
        formData.append(
          "audioFile",
          document.getElementById("edit-audio-file").files[0],
        );

      try {
        const res = await fetch(`/api/media/${id}`, {
          method: "PUT",
          body: formData,
        });
        if (!res.ok) {
          const data = await res.json();
          if (message) message.textContent = data.error || "Failed to update";
          return;
        }
        if (message) message.textContent = "Updated!";
        setTimeout(() => {
          closeEditModal();
          loadMedia();
        }, 600);
      } catch (err) {
        if (message) message.textContent = "Network error";
      }
    });
  }
}

async function deleteMedia(id) {
  if (!confirm("Delete this item?")) return;
  try {
    const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Could not delete");
      return;
    }
    loadMedia();
  } catch (err) {
    alert("Network error");
  }
}

function showCardActionsIfLoggedIn() {
  fetch("/api/me")
    .then((r) => r.json())
    .then((data) => {
      document.querySelectorAll(".card-actions").forEach((el) => {
        el.classList.toggle("hidden", !(data.loggedIn && data.isAdmin));
      });
    })
    .catch(() => {});
}

function setupUsers() {
  const section = document.getElementById("users-section");
  const list = document.getElementById("users-list");
  if (!section || !list) return;

  async function loadUsers() {
    try {
      const meRes = await fetch("/api/me");
      const me = await meRes.json();
      if (!me.loggedIn || !me.isAdmin) {
        section.classList.add("hidden");
        list.innerHTML = "";
        return;
      }
      section.classList.remove("hidden");

      const usersRes = await fetch("/api/users");
      if (!usersRes.ok) {
        list.innerHTML = "<p>Could not load users</p>";
        return;
      }
      const users = await usersRes.json();
      if (!users.length) {
        list.innerHTML = "<p>No users found</p>";
        return;
      }
      list.innerHTML = users
        .map(
          (u) => `
        <div style="padding:0.6rem 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; gap:0.5rem;">
          <div>
            <strong>${u.email}</strong>
            <span style="color:var(--muted); margin-left:0.5rem;">
              ${u.is_admin ? "Admin" : "User"}
            </span>
          </div>
          ${
            u.id !== me.id
              ? `
            <div style="display:flex; gap:0.4rem;">
              <button class="auth-btn toggle-admin" data-id="${u.id}" style="font-size:0.85rem; padding:0.3rem 0.7rem;">
                ${u.is_admin ? "Remove Admin" : "Make Admin"}
              </button>
              <button class="auth-btn delete-user" data-id="${u.id}" style="font-size:0.85rem; padding:0.3rem 0.7rem; background:#ff3b30;">
                Delete
              </button>
            </div>
          `
              : ""
          }
        </div>
      `,
        )
        .join("");

      list.querySelectorAll(".toggle-admin").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          try {
            const res = await fetch(`/api/users/${id}/toggle-admin`, {
              method: "POST",
            });
            if (!res.ok) {
              alert("Could not update");
              return;
            }
            loadUsers();
          } catch (err) {
            alert("Network error");
          }
        });
      });

      list.querySelectorAll(".delete-user").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          if (!confirm("Delete this user?")) return;
          try {
            const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
            if (!res.ok) {
              alert("Could not delete");
              return;
            }
            loadUsers();
          } catch (err) {
            alert("Network error");
          }
        });
      });
    } catch (err) {
      section.classList.add("hidden");
      list.innerHTML = "";
    }
  }

  window.loadUsers = loadUsers;
  loadUsers();
}

document.addEventListener("DOMContentLoaded", () => {
  setupThemeToggle();
  setCurrentYear();
  setupSearch();
  setupDetail();
  setupMenuToggle();
  setupAuth();
  setupAddMedia();
  setupEdit();
  setupUsers();

  const originalLoadMedia = loadMedia;
  loadMedia = async function () {
    await originalLoadMedia();
    showCardActionsIfLoggedIn();
  };
});
