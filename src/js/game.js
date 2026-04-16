import { getGameById, getDeals, getStores } from "./ExternalServices.mjs";
import { saveFavorite } from "./utils.mjs";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const container = document.querySelector("#details");
const dealsContainer = document.querySelector("#deals");
const saveBtn = document.querySelector("#saveBtn");

let currentGame;

function getDescription(game) {
  if (game.description_raw) return game.description_raw;

  if (game.description) {
    return game.description.replace(/<[^>]*>/g, ""); // remove HTML tags
  }

  return "No description available.";
}

async function init() {
  try {
    const game = await getGameById(id);
    currentGame = game;

    container.innerHTML = `
      <h1>${game.name || "Unknown Game"}</h1>
      <img src="${game.background_image || ""}" />
      <p>${getDescription(game)}</p>
    `;

    const deals = await getDeals(game.name);
    const stores = await getStores();

    if (!deals || deals.length === 0) {
      dealsContainer.innerHTML = "<p>No deals found</p>";
      return;
    }

    dealsContainer.innerHTML = deals
      .slice(0, 5)
      .map((d) => {
        const store = stores.find(
          (s) => Number(s.storeID) === Number(d.storeID)
        );

        return `
          <div class="deal-card glass">
            <p><strong>💰 $${d.salePrice}</strong></p>
            <p class="original-price">$${d.normalPrice}</p>
            <p>Discount: ${Math.round(d.savings)}%</p>

            <p>🏪 ${store ? store.storeName : "Unknown Store"}</p>

            <a href="https://www.cheapshark.com/redirect?dealID=${d.dealID}" 
               target="_blank">
              🔗 View Deal
            </a>
          </div>
        `;
      })
      .join("");

  } catch (err) {
    console.error("❌ Error loading game:", err);
    container.innerHTML = "<p>Error loading game details.</p>";
  }
}

if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    if (currentGame) {
      saveFavorite(currentGame);
      alert("Saved to favorites!");
    }
  });
}

init();