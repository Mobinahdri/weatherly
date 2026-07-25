const API_URL = "http://localhost:3000/api/weather";

const container = document.getElementById("favorites-container");
const emptyState = document.getElementById("empty-state");

const darkBtn = document.querySelector(".dark-mode-btn");

/* PAGE LOAD */

window.addEventListener("DOMContentLoaded", () => {
  loadTheme();

  loadFavorites();
});

/* LOAD THEME */

function loadTheme() {
  const theme = localStorage.getItem("theme");

  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  }
}

/* LOAD FAVORITES */

async function loadFavorites() {
  container.innerHTML = "";

  const favorites = getFavorites();

  if (favorites.length === 0) {
    emptyState.style.display = "block";

    return;
  }

  emptyState.style.display = "none";

  for (const city of favorites) {
    try {
      const response = await fetch(
        `${API_URL}?city=${encodeURIComponent(city)}`,
      );

      const result = await response.json();

      if (result.success) {
        createCard(result.data);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
/* CREATE CARD */

function createCard(weather){

    const card =
        document.createElement("div");

    card.className =
        "favorite-card";

    card.innerHTML=`

        <i class="fa-solid fa-star remove-btn"></i>

        <div class="favorite-city">

            <h3>${weather.city}</h3>

            <p>${weather.country}</p>

        </div>

        <div class="favorite-weather">

            <img
                src="${weather.current.icon}"
                alt="${weather.current.condition}">

            <span>${Math.round(weather.current.temperature)}°C</span>

        </div>

    `;

    /* -- Remove -- */

    const removeBtn =
        card.querySelector(".remove-btn");

    removeBtn.addEventListener("click",(e)=>{

        e.stopPropagation();

        removeCard(weather.city,card);

    });

    /* -- Open Forecast -- */

    card.addEventListener("click",()=>{

        localStorage.setItem(

            "selectedCity",

            weather.city

        );

        window.location.href=
            "forecast.html";

    });

    container.appendChild(card);

}

/* REMOVE CARD */

function removeCard(city,card){

    card.classList.add("removing");

    setTimeout(()=>{

        removeFavorite(city);

        loadFavorites();

    },300);

}

/*  DARK MODE */

darkBtn.addEventListener("click",()=>{

    document.body.classList.toggle(

        "dark-mode"

    );

    localStorage.setItem(

        "theme",

        document.body.classList.contains("dark-mode")

        ? "dark"

        : "light"

    );

});

/* SYNC */

window.addEventListener("focus",()=>{

    loadFavorites();

});
