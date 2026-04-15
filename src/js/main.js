import { searchGames, getPopularGames, getTopGame } from "./ExternalServices.mjs";
import { renderGameList } from "./GameList.mjs";

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

      const query = document.querySelector("#searchInput").value;

      console.log("🔍 Searching for:", query);

      try {
        const games = await searchGames(query);

        console.log("🎮 Games received:", games);

        renderGameList(games);
    
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

    const heroImage = document.querySelector(".hero-image");
    const heroText = document.querySelector(".hero-text");

    if (!game) return;

    heroImage.style.backgroundImage = `url(${game.background_image})`;
    heroImage.style.backgroundSize = "cover";
    heroImage.style.backgroundPosition = "center";

    heroText.innerHTML = `
      <h2>${game.name}</h2>
      <p>${game.released || "Release date unavailable"}</p>
      <button onclick="window.location.href='/game_details/index.html?id=${game.id}'">
        View Game
      </button>
    `;
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
        window.location.href = `/game_details/index.html?id=${game.id}`;
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
}

init();