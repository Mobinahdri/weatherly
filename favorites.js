const API_URL = "http://localhost:3000/api/weather";

/* ==========================================
                ELEMENTS
========================================== */

const container = document.getElementById("favorites-container");

const emptyState = document.getElementById("empty-state");

const darkBtn = document.querySelector(".dark-mode-btn");

let favoriteWeatherData = [];

/* ==========================================
        WEATHER TRANSLATIONS
========================================== */

const weatherConditions = {
  Clear: "صاف",

  Sunny: "آفتابی",

  "Partially cloudy": "نیمه ابری",

  Cloudy: "ابری",

  Overcast: "کاملاً ابری",

  Rain: "بارانی",

  "Light Rain": "باران ملایم",

  "Heavy Rain": "باران شدید",

  Snow: "برفی",

  Fog: "مه",

  Mist: "مه رقیق",

  Thunderstorm: "رعد و برق",

  Windy: "باد شدید",
};

/* ==========================================
                HELPERS
========================================== */

function translateCondition(condition) {
  if (currentLanguage === "en") {
    return condition;
  }

  return weatherConditions[condition] || condition;
}

function getLocale() {
  return currentLanguage === "fa" ? "fa-IR" : "en-US";
}

/* ==========================================
                PAGE LOAD
========================================== */

window.addEventListener(
  "DOMContentLoaded",

  () => {
    loadTheme();

    loadFavorites();
  },
);

/* ==========================================
                DARK MODE
========================================== */

function loadTheme() {
  const theme = localStorage.getItem("theme");

  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  }
}

if (darkBtn) {
  darkBtn.addEventListener(
    "click",

    () => {
      document.body.classList.toggle("dark-mode");

      localStorage.setItem(
        "theme",

        document.body.classList.contains("dark-mode") ? "dark" : "light",
      );
    },
  );
}

/* ==========================================
            LOAD FAVORITES
========================================== */

async function loadFavorites() {
  container.innerHTML = "";

  favoriteWeatherData = [];

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
        favoriteWeatherData.push(result.data);

        createCard(result.data);
      }
    } catch (error) {
      console.error(error);
    }
  }
  updateEmptyState();
}
/* ==========================================
            CREATE CARD
========================================== */

function createCard(weather){

    const card = document.createElement("div");

    card.className = "favorite-card";

    card.innerHTML = `

        <button
            class="remove-btn"
            title="${
                currentLanguage==="fa"

                ?

                "حذف از علاقه‌مندی‌ها"

                :

                "Remove from Favorites"
            }">

            <i class="fa-solid fa-star"></i>

        </button>

        <div class="favorite-city">

            <h3>

                ${weather.city}

            </h3>

            <p>

                ${weather.country}

            </p>

        </div>

        <div class="favorite-weather">

            <img

                src="${weather.current.icon}"

                alt="${translateCondition(weather.current.condition)}"

            >

            <div class="favorite-weather-info">

                <span class="favorite-temp">

                    ${Math.round(weather.current.temperature)}°C

                </span>

                <small class="favorite-condition">

                    ${translateCondition(weather.current.condition)}

                </small>

            </div>

        </div>

    `;

    /* =====================
            REMOVE
    ====================== */

    const removeBtn =

        card.querySelector(".remove-btn");

    removeBtn.addEventListener(

        "click",

        (e)=>{

            e.stopPropagation();

            removeCard(

                weather.city,

                card

            );

        }

    );

    /* =====================
        OPEN FORECAST
    ====================== */

    card.addEventListener(

        "click",

        ()=>{

            localStorage.setItem(

                "selectedCity",

                weather.city

            );

            window.location.href =

                "forecast.html";

        }

    );

    container.appendChild(card);

}
/* ==========================================
            REMOVE CARD
========================================== */

function removeCard(city, card){

    card.classList.add("removing");

    setTimeout(()=>{

        removeFavorite(city);

        loadFavorites();

    },300);

}

/* ==========================================
            WINDOW FOCUS
========================================== */

window.addEventListener(

    "focus",

    ()=>{

        loadFavorites();

    }

);

/* ==========================================
        LANGUAGE CHANGE SUPPORT
========================================== */

document.addEventListener(

    "languageChanged",

    ()=>{

        if(favoriteWeatherData.length===0){

            return;

        }

        container.innerHTML="";

        favoriteWeatherData.forEach(weather=>{

            createCard(weather);

        });

    }

);

/* ==========================================
        EMPTY STATE UPDATE
========================================== */

function updateEmptyState(){

    const favorites = getFavorites();

    if(favorites.length===0){

        emptyState.style.display="block";

        container.style.display="none";

    }

    else{

        emptyState.style.display="none";

        container.style.display="grid";

    }

}

document.addEventListener(

    "languageChanged",

    ()=>{

        updateEmptyState();

    }

);
