const API_URL = "http://localhost:3000/api/weather";

const cityName = document.getElementById("details-city");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const darkBtn = document.querySelector(".dark-mode-btn");

/* PAGE LOAD */

window.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem("theme");

  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  }

  const city = localStorage.getItem("selectedCity") || "Shiraz";

  loadDetails(city);
});

/* LOAD DATA */

async function loadDetails(city) {
  try {
    const response = await fetch(`${API_URL}?city=${encodeURIComponent(city)}`);

    const result = await response.json();

    if (!result.success) {
      throw new Error("City not found");
    }

    const data = result.data;

   const displayCity = data.city.replace(`, ${data.country}`, "");
  cityName.textContent = data.fullName;
    fillCurrent(data.current);

    fillForecast(data.forecast[0]);
  } catch (err) {
    alert(err.message);
  }
}

/* CURRENT DATA */

function fillCurrent(current) {
  humidity.textContent = `${current.humidity}%`;

  wind.textContent = `${current.windSpeed} km/h`;

  pressure.textContent = `${current.pressure} hPa`;

  visibility.textContent = `${current.visibility} km`;
}

/*  SUNRISE / SUNSET */

function fillForecast(today) {
  sunrise.textContent = today.sunrise;

  sunset.textContent = today.sunset;
}

/*   DARK MODE */

darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});
