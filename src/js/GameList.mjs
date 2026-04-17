import { renderStars } from "./utils.mjs";

export function renderGameList(games) {
  const container = document.querySelector("#results");

  if (!container) return;

  container.innerHTML = "";

  if (!games || games.length === 0) {
    container.innerHTML = "<p>No games found.</p>";
    return;
  }

  games.forEach(game => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3>${game.name}</h3>
      <img src="${game.background_image || ""}" />
      <p>${renderStars(game.rating || 0)}</p>
    `;

    div.addEventListener("click", () => {
      window.location.href = "game_details/index.html?id=" + game.id;
    });

    container.appendChild(div);
  });
}