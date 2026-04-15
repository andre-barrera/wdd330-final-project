const API_KEY = import.meta.env.VITE_API_KEY;

export async function searchGames(query) {
  const res = await fetch(
    `https://api.rawg.io/api/games?key=${API_KEY}&search=${query}`
  );
  return (await res.json()).results;
}

export async function getGameById(id) {
  const res = await fetch(
    `https://api.rawg.io/api/games/${id}?key=${API_KEY}`
  );
  return await res.json();
}

export async function getDeals(title) {
  const res = await fetch(
    `https://www.cheapshark.com/api/1.0/deals?title=${title}`
  );
  return await res.json();
}

export async function getPopularGames() {
  const res = await fetch(
    `https://api.rawg.io/api/games?key=${API_KEY}&ordering=-rating&page_size=10`
  );
  return (await res.json()).results;
}

export async function getTopGame() {
  const res = await fetch(
    `https://api.rawg.io/api/games?key=${API_KEY}&ordering=-rating&page_size=1`
  );
  const data = await res.json();
  return data.results[0];
}

export async function getStores() {
  const res = await fetch("https://www.cheapshark.com/api/1.0/stores");
  return await res.json();
}