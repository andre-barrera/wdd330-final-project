import { getFavorites } from "./utils.mjs";

const container = document.querySelector("#favorites");

const favorites = getFavorites();

container.innerHTML = favorites.map(game => `
  <div>
    <h3>${game.name}</h3>
    <img src="${game.background_image}" />
  </div>`).join("");