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
const weatherNote = document.getElementById("weather-note");
const weatherNoteIcon = document.getElementById("weather-note-icon");
const weatherNoteMessage = document.getElementById("weather-note-message");
const weatherNoteContext = document.getElementById("weather-note-context");

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
          WEATHER-BASED DAILY NOTE
========================================== */

const dailyNotes = {
  en: {
    seasons: {
      spring: "Spring says: grow at your own gentle pace.",
      summer: "Summer says: make a little room for joy.",
      autumn: "Autumn says: change can be beautiful too.",
      winter: "Winter says: quiet progress still counts.",
    },
    clear: [
      "The sky left the light on for you—take one brave step today.",
      "A bright day is a gentle reminder that you can begin again.",
    ],
    rain: [
      "Let the rain soften the day; slow progress is still beautiful progress.",
      "Clouds are watering tomorrow’s brighter moments. Keep growing.",
    ],
    snow: [
      "The world is taking a quiet pause. You are allowed one too.",
      "Even the coldest days can hold the warmest little moments.",
    ],
    cloud: [
      "The sun is still there, even when you cannot see it. So is your spark.",
      "A soft sky suits a gentle pace—do one good thing for yourself.",
    ],
    storm: [
      "Storms pass. Stay grounded, protect your peace, and trust your strength.",
      "Today may be loud, but your calm can be louder.",
    ],
    fog: [
      "You do not need to see the whole path—just the next kind step.",
      "Move gently through the haze; clarity often arrives along the way.",
    ],
    wind: [
      "Let the wind clear some space for a fresh thought and a new start.",
      "Breezy days are proof that change can feel refreshing.",
    ],
    hot: [
      "Take it easy, drink some water, and let small wins be enough today.",
      "Save your energy for what matters—steady is more than enough.",
    ],
    cold: [
      "Wrap up warmly and carry a little kindness with you.",
      "Cold outside, warm heart—make today cozy in your own way.",
    ],
    mild: [
      "The day feels balanced—borrow a little of that calm for yourself.",
      "A gentle day for a gentle reminder: you are doing better than you think.",
    ],
  },
  fa: {
    seasons: {
      spring: "بهار می‌گوید: با ریتم آرام خودت رشد کن.",
      summer: "تابستان می‌گوید: کمی برای شادی جا باز کن.",
      autumn: "پاییز می‌گوید: تغییر هم می‌تواند زیبا باشد.",
      winter: "زمستان می‌گوید: پیشرفت آرام هم ارزشمند است.",
    },
    clear: [
      "آسمان امروز برای تو روشن است؛ فقط یک قدم شجاعانه بردار.",
      "این روز روشن یادآوری می‌کند که همیشه می‌توانی دوباره شروع کنی.",
    ],
    rain: [
      "بگذار باران روزت را آرام کند؛ پیشرفت آهسته هم زیباست.",
      "ابرها لحظه‌های روشن فردا را آبیاری می‌کنند؛ به رشدت ادامه بده.",
    ],
    snow: [
      "دنیا کمی آرام گرفته؛ تو هم اجازه داری مکث کنی.",
      "حتی سردترین روزها هم می‌توانند گرم‌ترین لحظه‌ها را بسازند.",
    ],
    cloud: [
      "خورشید هنوز پشت ابرهاست؛ درست مثل درخشش درون تو.",
      "آسمان آرام، یک قدم آرام می‌خواهد؛ امروز با خودت مهربان باش.",
    ],
    storm: [
      "طوفان‌ها می‌گذرند؛ آرامشت را حفظ کن و به قدرتت اعتماد داشته باش.",
      "شاید امروز پرهیاهو باشد، اما آرامش تو قوی‌تر است.",
    ],
    fog: [
      "لازم نیست تمام مسیر را ببینی؛ همان قدم بعدی کافی است.",
      "آرام از میان مه عبور کن؛ وضوح در طول مسیر از راه می‌رسد.",
    ],
    wind: [
      "بگذار باد برای یک فکر تازه و شروعی نو جا باز کند.",
      "روزهای بادی یادمان می‌آورند که تغییر می‌تواند تازه‌کننده باشد.",
    ],
    hot: [
      "آرام‌تر پیش برو، آب بنوش و بگذار موفقیت‌های کوچک کافی باشند.",
      "انرژی‌ات را برای چیزهای مهم نگه دار؛ پیوسته رفتن کافی است.",
    ],
    cold: [
      "گرم بپوش و کمی مهربانی با خودت همراه کن.",
      "هوای سرد و قلب گرم؛ امروز را به سبک خودت دل‌نشین کن.",
    ],
    mild: [
      "هوا متعادل است؛ کمی از این آرامش را برای خودت بردار.",
      "یک روز ملایم و یک یادآوری ساده: بهتر از چیزی که فکر می‌کنی پیش می‌روی.",
    ],
  },
};

function getSeason(latitude) {
  const month = new Date().getMonth();
  const northernSeason = month >= 2 && month <= 4
    ? "spring"
    : month >= 5 && month <= 7
      ? "summer"
      : month >= 8 && month <= 10
        ? "autumn"
        : "winter";

  if (Number(latitude) >= 0) {
    return northernSeason;
  }

  return {
    spring: "autumn",
    summer: "winter",
    autumn: "spring",
    winter: "summer",
  }[northernSeason];
}

function getNoteCategory(data) {
  const condition = String(data.current.condition || "").toLowerCase();
  const temperatureValue = Number(data.current.temperature);
  const windSpeed = Number(data.current.windSpeed);

  if (/thunder|storm|tornado|squall/.test(condition)) return "storm";
  if (/snow|ice|sleet|freez/.test(condition)) return "snow";
  if (/rain|drizzle|shower/.test(condition)) return "rain";
  if (/fog|mist|haze|smoke/.test(condition)) return "fog";
  if (temperatureValue >= 32) return "hot";
  if (temperatureValue <= 5) return "cold";
  if (windSpeed >= 35) return "wind";
  if (/cloud|overcast/.test(condition)) return "cloud";
  if (/clear|sun/.test(condition)) return "clear";

  return "mild";
}

function getDailyNoteIndex(city, optionsLength) {
  const dayKey = new Date().toISOString().slice(0, 10);
  const seed = `${city}-${dayKey}`.split("").reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );

  return seed % optionsLength;
}

function updateWeatherNote(data) {
  if (!weatherNote || !weatherNoteMessage || !weatherNoteContext) return;

  const language = currentLanguage === "fa" ? "fa" : "en";
  const category = getNoteCategory(data);
  const options = dailyNotes[language][category];
  const season = getSeason(data.latitude);
  const noteIndex = getDailyNoteIndex(data.city, options.length);
  const contextLabels = {
    en: {
      spring: "Spring mood",
      summer: "Summer mood",
      autumn: "Autumn mood",
      winter: "Winter mood",
    },
    fa: {
      spring: "حال‌وهوای بهاری",
      summer: "حال‌وهوای تابستانی",
      autumn: "حال‌وهوای پاییزی",
      winter: "حال‌وهوای زمستانی",
    },
  };
  const icons = {
    clear: "fa-sun",
    rain: "fa-cloud-rain",
    snow: "fa-snowflake",
    cloud: "fa-cloud",
    storm: "fa-cloud-bolt",
    fog: "fa-smog",
    wind: "fa-wind",
    hot: "fa-temperature-high",
    cold: "fa-temperature-low",
    mild: "fa-sparkles",
  };

  weatherNoteMessage.textContent =
    `${options[noteIndex]} ${dailyNotes[language].seasons[season]}`;

  weatherNoteContext.textContent =
    `${contextLabels[language][season]} • ${Math.round(data.current.temperature)}°C • ${data.city}`;
  weatherNoteIcon.innerHTML = `<i class="fa-solid ${icons[category]}"></i>`;
  weatherNote.classList.add("show");
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

    updateWeatherNote(data);

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
