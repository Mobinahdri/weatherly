const API_URL = "http://localhost:3000/api/weather";

/* ==========================================
                ELEMENTS
========================================== */

const cityTitle = document.getElementById("forecast-city");

const forecastContainer = document.getElementById("forecast-container");

const chartCanvas = document.getElementById("temperatureChart");

const darkBtn = document.querySelector(".dark-mode-btn");

let temperatureChart = null;

let currentForecastData = null;

let currentCity = localStorage.getItem("selectedCity") || "Shiraz";

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

window.addEventListener(
  "DOMContentLoaded",

  () => {
    loadTheme();

    loadForecast(currentCity);
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
            LOAD FORECAST
========================================== */

async function loadForecast(city) {
  try {
    const response = await fetch(`${API_URL}?city=${encodeURIComponent(city)}`);

    const result = await response.json();

    if (!result.success) {
      throw new Error(
        currentLanguage === "fa"
          ? "شهر پیدا نشد."
          : result.message || "City not found",
      );
    }

    currentForecastData = result.data;

    currentCity = result.data.city;

    localStorage.setItem(
      "selectedCity",

      currentCity,
    );

    cityTitle.textContent = result.data.fullName;

    createForecastCards(result.data.forecast);

    updateChart(result.data.forecast);
  } catch (error) {
    alert(error.message);
  }
}
/* ==========================================
            FORECAST CARDS
========================================== */

function createForecastCards(days){

    forecastContainer.innerHTML = "";

    days.forEach((day,index)=>{

        const card = document.createElement("div");

        card.className = "forecast-card";

        card.style.animationDelay = `${index * 0.08}s`;

        card.innerHTML = `

            <h2>

                ${formatWeekDay(day.date)}

                <br>

                <span>

                    ${formatDay(day.date)}

                </span>

            </h2>

            <img
                src="${day.icon}"
                alt="${translateCondition(day.condition)}"
            >

            <h3>

                ${translateCondition(day.condition)}

            </h3>

            <p class="max-temp">

                ↑ ${Math.round(day.maxTemp)}°

            </p>

            <p class="min-temp">

                ↓ ${Math.round(day.minTemp)}°

            </p>

        `;

        forecastContainer.appendChild(card);

    });

}

/* ==========================================
            DATE FORMAT
========================================== */

function formatWeekDay(date){

    return new Date(date).toLocaleDateString(

        getLocale(),

        {

            weekday:"long"

        }

    );

}

function formatDay(date){

    return new Date(date).toLocaleDateString(

        getLocale(),

        {

            day:"numeric",

            month:"short"

        }

    );

}

/* ==========================================
        LANGUAGE CHANGE SUPPORT
========================================== */

document.addEventListener(

    "languageChanged",

    ()=>{

        if(!currentForecastData) return;

        cityTitle.textContent =
            currentForecastData.fullName;

        createForecastCards(

            currentForecastData.forecast

        );

        updateChart(

            currentForecastData.forecast

        );

    }

);
/* ==========================================
                CHART
========================================== */

function updateChart(days){

    const labels = days.map(day => formatDay(day.date));

    const temperatures = days.map(

        day => Math.round(day.maxTemp)

    );

    const datasetLabel =

        currentLanguage === "fa"

        ?

        "دما"

        :

        "Temperature";

    if(!temperatureChart){

        temperatureChart = new Chart(

            chartCanvas,

            {

                type:"line",

                data:{

                    labels,

                    datasets:[{

                        label:datasetLabel,

                        data:temperatures,

                        borderColor:"#4f8cff",

                        backgroundColor:"rgba(79,140,255,.15)",

                        borderWidth:4,

                        fill:true,

                        tension:.45,

                        pointRadius:6,

                        pointHoverRadius:8,

                        pointBackgroundColor:"#4f8cff",

                        pointBorderColor:"#ffffff",

                        pointBorderWidth:2

                    }]

                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

                    animation:{

                        duration:900,

                        easing:"easeOutQuart"

                    },

                    interaction:{

                        intersect:false,

                        mode:"index"

                    },

                    plugins:{

                        legend:{

                            display:false

                        },

                        tooltip:{

                            backgroundColor:"#1f2937",

                            titleColor:"#fff",

                            bodyColor:"#fff",

                            displayColors:false,

                            callbacks:{

                                label(context){

                                    return `${datasetLabel}: ${context.raw}°C`;

                                }

                            }

                        }

                    },

                    scales:{

                        x:{

                            grid:{

                                display:false

                            },

                            ticks:{

                                color:"#6b7280",

                                font:{

                                    size:14,

                                    weight:"600"

                                }

                            }

                        },

                        y:{

                            beginAtZero:false,

                            grid:{

                                color:"rgba(0,0,0,.08)"

                            },

                            ticks:{

                                color:"#6b7280",

                                callback(value){

                                    return value + "°";

                                }

                            }

                        }

                    }

                }

            }

        );

    }

    else{

        temperatureChart.data.labels = labels;

        temperatureChart.data.datasets[0].label = datasetLabel;

        temperatureChart.data.datasets[0].data = temperatures;

        temperatureChart.update();

    }

}

/* ==========================================
        LANGUAGE UPDATE
========================================== */

document.addEventListener(

    "languageChanged",

    ()=>{

        if(currentForecastData){

            cityTitle.textContent =
                currentForecastData.fullName;

            createForecastCards(

                currentForecastData.forecast

            );

            updateChart(

                currentForecastData.forecast

            );

        }

    }

);