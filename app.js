const API_URL = "http://localhost:3000/api/weather";

/* ==========================================
                ELEMENTS
========================================== */

const welcomeScreen = document.getElementById("welcome-screen");
const welcomeBtn = document.getElementById("welcome-btn");
const welcomeInput = document.getElementById("welcome-input");

const hero = document.getElementById("hero");

const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");

const weatherIcon = document.getElementById("weather-icon");

const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const weatherStatus = document.getElementById("weather-status");

const cityTime = document.getElementById("city-time");
const cityDate = document.getElementById("city-date");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");

const darkBtn = document.querySelector(".dark-mode-btn");
const favoriteBtn = document.getElementById("favorite-btn");

let currentCity = "";
let currentWeatherData = null;

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

function getLocale() {
  return currentLanguage === "fa" ? "fa-IR" : "en-US";
}

function translateCondition(condition) {
  if (currentLanguage === "en") {
    return condition;
  }

  return weatherConditions[condition] || condition;
}

/* ==========================================
                PAGE LOAD
========================================== */

window.addEventListener("DOMContentLoaded", () => {
  loadTheme();

  initializeHome();
});

/* ==========================================
            INITIALIZE HOME
========================================== */

function initializeHome() {
  const savedCity = localStorage.getItem("selectedCity");

  const navigation = performance.getEntriesByType("navigation")[0];

  const isReload = navigation && navigation.type === "reload";

  if (isReload) {
    sessionStorage.removeItem("welcomeSeen");
  }

  const welcomeSeen = sessionStorage.getItem("welcomeSeen");

  if (welcomeSeen && savedCity) {
    welcomeScreen.classList.add("hide");

    hero.classList.add("show");

    document.querySelector(".main-container")?.classList.add("show-assistant");

    document.dispatchEvent(new CustomEvent("homeEntered"));

    getWeather(savedCity);
  }
}

/* ==========================================
                EVENTS
========================================== */

welcomeBtn.addEventListener("click", () => {
  const city = welcomeInput.value.trim();

  if (!city) {
    alert(
      currentLanguage === "fa"
        ? "نام شهر را وارد کنید."
        : "Please enter a city.",
    );

    return;
  }

  sessionStorage.setItem(
    "welcomeSeen",

    "true",
  );

  getWeather(city);
});

searchBtn.addEventListener("click", () => {
  getWeather(searchInput.value.trim());
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getWeather(searchInput.value.trim());
  }
});

welcomeInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    welcomeBtn.click();
  }
});
/* ==========================================
                GET WEATHER
========================================== */

async function getWeather(city){

    if(!city) return;

    try{

        const response = await fetch(

            `${API_URL}?city=${encodeURIComponent(city)}`

        );

        const result = await response.json();

        if(!result.success){

            throw new Error(

                currentLanguage==="fa"

                ?

                "شهر پیدا نشد."

                :

                (result.message || "City not found")

            );

        }

        const data = result.data;

        currentWeatherData = data;

        currentCity = data.city;

        localStorage.setItem(

            "selectedCity",

            currentCity

        );

        updateWeatherUI(data);

        updateFavoriteButton();

        welcomeScreen.classList.add("hide");

        hero.classList.add("show");

        document.querySelector(".main-container")
          ?.classList.add("show-assistant");

        document.dispatchEvent(new CustomEvent("homeEntered"));

    }

    catch(error){

        alert(error.message);

    }

}

/* ==========================================
            UPDATE WEATHER UI
========================================== */

function updateWeatherUI(data){

    cityName.textContent = data.fullName;

    temperature.textContent =
        `${Math.round(data.current.temperature)}°C`;

    weatherStatus.textContent =
        translateCondition(
            data.current.condition
        );

    weatherIcon.src =
        data.current.icon;

    weatherIcon.alt =
        data.current.condition;

    humidity.textContent =
        `${data.current.humidity}%`;

    wind.textContent =
        `${Math.round(data.current.windSpeed)} km/h`;

    pressure.textContent =
        `${Math.round(data.current.pressure)} hPa`;

    visibility.textContent =
        `${Math.round(data.current.visibility)} km`;

    const now = new Date();

    cityDate.textContent =
        now.toLocaleDateString(

            getLocale(),

            {

                weekday:"long",

                month:"long",

                day:"numeric",

                year:"numeric"

            }

        );

    cityTime.textContent =
        now.toLocaleTimeString(

            getLocale(),

            {

                hour:"2-digit",

                minute:"2-digit",

                hour12:
                    currentLanguage==="en"

            }

        );

}

/* ==========================================
        LANGUAGE REFRESH SUPPORT
========================================== */

document.addEventListener(

    "languageChanged",

    ()=>{

        if(currentWeatherData){

            updateWeatherUI(

                currentWeatherData

            );

        }

    }

);
/* ==========================================
            FAVORITE BUTTON
========================================== */

function updateFavoriteButton(){

    if(!favoriteBtn) return;

    const icon =
        favoriteBtn.querySelector("i");

    if(isFavorite(currentCity)){

        favoriteBtn.classList.add("active");

        icon.className =
            "fa-solid fa-star";

        favoriteBtn.title =
            currentLanguage === "fa"

            ?

            "حذف از علاقه‌مندی‌ها"

            :

            "Remove from Favorites";

    }

    else{

        favoriteBtn.classList.remove("active");

        icon.className =
            "fa-regular fa-star";

        favoriteBtn.title =
            currentLanguage === "fa"

            ?

            "افزودن به علاقه‌مندی‌ها"

            :

            "Add to Favorites";

    }

}

/* ==========================================
            FAVORITE CLICK
========================================== */

if(favoriteBtn){

    favoriteBtn.addEventListener(

        "click",

        ()=>{

            if(!currentCity) return;

            toggleFavorite(currentCity);

            updateFavoriteButton();

        }

    );

}

/* ==========================================
                DARK MODE
========================================== */

function loadTheme(){

    const theme =
        localStorage.getItem("theme");

    if(theme==="dark"){

        document.body.classList.add("dark-mode");

    }

}

if(darkBtn){

    darkBtn.addEventListener(

        "click",

        ()=>{

            document.body.classList.toggle(

                "dark-mode"

            );

            localStorage.setItem(

                "theme",

                document.body.classList.contains("dark-mode")

                    ?

                    "dark"

                    :

                    "light"

            );

        }

    );

}

/* ==========================================
            WINDOW FOCUS
========================================== */

window.addEventListener(

    "focus",

    ()=>{

        if(currentCity){

            updateFavoriteButton();

        }

    }

);

/* ==========================================
        LANGUAGE UPDATE SUPPORT
========================================== */

document.addEventListener(

    "languageChanged",

    ()=>{

        if(currentWeatherData){

            updateWeatherUI(

                currentWeatherData

            );

        }

        updateFavoriteButton();

    }

);
// getWeather("New York");
