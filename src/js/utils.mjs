export function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

export function saveFavorite(game) {
  const favs = getFavorites();

  const favorite = {
    id: game.id,
    name: game.name,
    image: game.background_image,
    rating: game.rating,
    addedAt: new Date().toISOString()
  };

  const exists = favs.some(f => f.id === favorite.id);

  if (!exists) {
    favs.push(favorite);
    localStorage.setItem("favorites", JSON.stringify(favs));
  }
}

export function removeFavorite(id) {
  let favs = getFavorites();

  favs = favs.filter(f => f.id !== id);

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