/*  FAVORITES MANAGER */

const FAVORITES_KEY = "favorites";

/*   GET FAVORITES */

function getFavorites() {
  const favorites = localStorage.getItem(FAVORITES_KEY);

  return favorites ? JSON.parse(favorites) : [];
}

/* SAVE FAVORITES */

function saveFavorites(favorites) {
  localStorage.setItem(
    FAVORITES_KEY,

    JSON.stringify(favorites),
  );
}

/* NORMALIZE CITY */

function normalizeCity(city) {
  return city.trim().toLowerCase();
}

/* CHECK FAVORITE */

function isFavorite(city) {
  return getFavorites().some(
    (item) => normalizeCity(item) === normalizeCity(city),
  );
}

/* ADD FAVORITE */

function addFavorite(city) {
  let favorites = getFavorites();

  if (!isFavorite(city)) {
    favorites.push(city);

    saveFavorites(favorites);
  }
}

/* REMOVE FAVORITE */

function removeFavorite(city) {
  let favorites = getFavorites();

  favorites = favorites.filter(
    (item) => normalizeCity(item) !== normalizeCity(city),
  );

  saveFavorites(favorites);
}

/* TOGGLE FAVORITE */

function toggleFavorite(city) {
  if (isFavorite(city)) {
    removeFavorite(city);

    return false;
  }

  addFavorite(city);

  return true;
}

/* EXPORT TO WINDOW */

window.getFavorites = getFavorites;

window.saveFavorites = saveFavorites;

window.isFavorite = isFavorite;

window.addFavorite = addFavorite;

window.removeFavorite = removeFavorite;

window.toggleFavorite = toggleFavorite;
