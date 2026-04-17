import { searchGames, getPopularGames, getTopGame } from "./ExternalServices.mjs";
import { renderGameList } from "./GameList.mjs";

let currentGames = [];

function goToGameDetails(id) {
  window.location.href = "/game_details/index.html?id=" + id;
}

function sortGames(games, type) {
  if (type === "rating") {
    return [...games].sort((a, b) => b.rating - a.rating);
  }

  if (type === "name") {
    return [...games].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  return games;
}

function filterGames(games, text) {
  return games.filter(game =>
    game.name.toLowerCase().includes(text.toLowerCase())
  );
}

function setupControls() {
  const sortSelect = document.querySelector("#sortSelect");
  const filterInput = document.querySelector("#filterInput");
  const form = document.querySelector("#controlsForm");

  if (!sortSelect || !filterInput) {
    console.error("❌ Controls not found");
    return;
  }

  function applyFilters() {
    let updated = [...currentGames];

    updated = filterGames(updated, filterInput.value);
    updated = sortGames(updated, sortSelect.value);

    renderGameList(updated);
  }

  sortSelect.addEventListener("change", applyFilters);

  filterInput.addEventListener("input", applyFilters);

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      applyFilters();
    });
  }
}

async function loadHeader() {
  try {
    const res = await fetch("/partials/header.html");
    const html = await res.text();
    document.querySelector("#header").innerHTML = html;

    const form = document.querySelector("#searchForm");

    if (!form) {
      console.error("❌ searchForm not found");
      return;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const query = document.querySelector("#searchInput").value.trim();
      if (!query) return;

      try {
        const games = await searchGames(query);

        currentGames = games;

        renderGameList(currentGames);

        document.querySelector("#results").scrollIntoView({
          behavior: "smooth"
        });

      } catch (err) {
        console.error("❌ Search failed:", err);
      }
    });

  } catch (err) {
    console.error("❌ Header failed to load:", err);
  }
}

async function loadHero() {
  try {
    const game = await getTopGame();
    if (!game) return;

    const heroImage = document.querySelector(".hero-image");
    const heroText = document.querySelector(".hero-text");

    heroImage.style.backgroundImage = `url(${game.background_image})`;
    heroImage.style.backgroundSize = "cover";
    heroImage.style.backgroundPosition = "center";

    heroText.innerHTML = `
      <h2>${game.name}</h2>
      <p>${game.released || "Release date unavailable"}</p>
      <button id="heroBtn">View Game</button>
    `;

    document.querySelector("#heroBtn").addEventListener("click", () => {
      goToGameDetails(game.id);
    });

  } catch (err) {
    console.error("❌ Hero failed:", err);
  }
}

async function loadFeatured() {
  try {
    const games = await getPopularGames();

    const container = document.querySelector(".featured-grid");
    if (!container) return;

    container.innerHTML = "";

    games.slice(0, 3).forEach(game => {
      const div = document.createElement("div");

      div.classList.add("card", "glass");

      div.innerHTML = `
        <img src="${game.background_image}" />
        <h4>${game.name}</h4>
        <p>${"⭐".repeat(Math.round(game.rating))}</p>
      `;

      div.addEventListener("click", () => {
        goToGameDetails(game.id);
      });

      container.appendChild(div);
    });

  } catch (err) {
    console.error("❌ Featured failed:", err);
  }
}

async function init() {
  await loadHeader();
  loadHero();
  loadFeatured();
  setupControls();
}

init();