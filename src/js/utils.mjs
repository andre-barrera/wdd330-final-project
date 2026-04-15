export function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

export function saveFavorite(game) {
  const favs = getFavorites();
  favs.push(game);
  localStorage.setItem("favorites", JSON.stringify(favs));
}

export function renderStars(rating) {
  const fullStars = Math.round(rating);
  let stars = "";

  for (let i = 0; i < 5; i++) {
    stars += i < fullStars ? "⭐" : "☆";
  }

  return stars;
}