import { getGameById, getDeals, getStores } from "./ExternalServices.mjs";
import { saveFavorite } from "./utils.mjs";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const container = document.querySelector("#details");
const dealsContainer = document.querySelector("#deals");
const saveBtn = document.querySelector("#saveBtn");

let currentGame;

async function init() {
  try {
    const game = await getGameById(id);
    currentGame = game;

    container.innerHTML = `
      <h1>${game.name}</h1>
      <img src="${game.background_image || ""}" />
      <p>${game.description_raw || "No description available."}</p>
    `;

    const deals = await getDeals(game.name);
    const stores = await getStores();

    dealsContainer.innerHTML =
      deals && deals.length > 0
        ? deals.slice(0, 5).map(d => {

            const store = stores.find(s => s.storeID === d.storeID);

            return `
              <div class="deal-card glass">
                <p><strong>💰 $${d.salePrice}</strong></p>
                <p class="original-price">$${d.normalPrice}</p>
                <p>Discount: ${Math.round(d.savings)}%</p>

                <p>🏪 ${store ? store.storeName : "Unknown Store"}</p>

                <a href="https://www.cheapshark.com/redirect?dealID=${d.dealID}" target="_blank">
                  🔗 View Deal
                </a>
              </div>
            `;
          }).join("")
        : "<p>No deals found</p>";

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