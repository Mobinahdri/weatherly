const API_URL = "http://localhost:3000/api/weather";

/* ==========================================
                ELEMENTS
========================================== */

const cityName = document.getElementById("details-city");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const darkBtn = document.querySelector(".dark-mode-btn");

let currentWeather = null;

/* ==========================================
        PAGE LOAD
========================================== */

window.addEventListener("DOMContentLoaded", () => {
  loadTheme();

  const city = localStorage.getItem("selectedCity") || "Shiraz";

  loadDetails(city);
});

/* ==========================================
        DARK MODE
========================================== */

function loadTheme() {
  const theme = localStorage.getItem("theme");

  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  }
}

darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  localStorage.setItem(
    "theme",

    document.body.classList.contains("dark-mode") ? "dark" : "light",
  );
});

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
            LOAD DETAILS
========================================== */

async function loadDetails(city){

    try{

        const response = await fetch(

            `${API_URL}?city=${encodeURIComponent(city)}`

        );

        const result = await response.json();

        if(!result.success){

            throw new Error("City not found");

        }

        currentWeather = result.data;

        renderDetails();

    }

    catch(error){

        alert(error.message);

    }

}

/* ==========================================
            RENDER PAGE
========================================== */

function renderDetails(){

    if(!currentWeather) return;

    cityName.textContent = currentWeather.fullName;

    fillCurrent(currentWeather.current);

    fillForecast(currentWeather.forecast[0]);

}

/* ==========================================
            CURRENT DATA
========================================== */

function fillCurrent(current){

    humidity.textContent =
        `${current.humidity}%`;

    wind.textContent =

        currentLanguage==="fa"

        ?

        `${current.windSpeed} کیلومتر/ساعت`

        :

        `${current.windSpeed} km/h`;

    pressure.textContent =

        currentLanguage==="fa"

        ?

        `${current.pressure} هکتوپاسکال`

        :

        `${current.pressure} hPa`;

    visibility.textContent =

        currentLanguage==="fa"

        ?

        `${current.visibility} کیلومتر`

        :

        `${current.visibility} km`;

}

/* ==========================================
        SUNRISE / SUNSET
========================================== */

function fillForecast(today){

    sunrise.textContent = formatTime(today.sunrise);

    sunset.textContent = formatTime(today.sunset);

}

/* ==========================================
            TIME FORMAT
========================================== */
function formatTime(time) {
  if (currentLanguage === "en") {
    return time;
  }

  return new Date(`1970-01-01T${convertTo24Hour(time)}`).toLocaleTimeString(
    "fa-IR",

    {
      hour: "2-digit",

      minute: "2-digit",
    },
  );
}

function convertTo24Hour(time) {
  if (!time.includes("AM") && !time.includes("PM")) {
    return time;
  }

  let [clock, modifier] = time.split(" ");

  let [hours, minutes] = clock.split(":");

  hours = parseInt(hours);

  if (modifier === "PM" && hours < 12) {
    hours += 12;
  }

  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, "0")}:${minutes}`;
}
/* ==========================================
        LANGUAGE CHANGE SUPPORT
========================================== */

document.addEventListener(

    "languageChanged",

    ()=>{

        renderDetails();

    }

);

/* ==========================================
        WINDOW FOCUS
========================================== */

window.addEventListener(

    "focus",

    ()=>{

        if(currentWeather){

            renderDetails();

        }

    }

);
