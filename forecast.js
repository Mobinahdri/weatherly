const API_URL = "http://localhost:3000/api/weather";

const cityTitle = document.getElementById("forecast-city");
const forecastContainer = document.getElementById("forecast-container");

const darkBtn = document.querySelector(".dark-mode-btn");

const chartCanvas = document.getElementById("temperatureChart");

let temperatureChart = null;


// Load Page

window.addEventListener("DOMContentLoaded", () => {

    loadTheme();

    const city =
        localStorage.getItem("selectedCity") || "Shiraz";

    loadForecast(city);

});

// Theme

function loadTheme(){

    const theme = localStorage.getItem("theme");

    if(theme === "dark"){

        document.body.classList.add("dark-mode");

    }

}

darkBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){

        localStorage.setItem("theme","dark");

    }else{

        localStorage.setItem("theme","light");

    }

});

// Get Forecast

async function loadForecast(city){

    try{

        const response = await fetch(

            `${API_URL}?city=${encodeURIComponent(city)}`

        );

        const result = await response.json();

        if(!result.success){

            throw new Error("City not found");

        }
        const weather = result.data;

        cityTitle.textContent = weather.fullName;

        createForecastCards(weather.forecast);

        updateChart(weather.forecast);
    }

    catch(error){

        alert(error.message);

    }

}

// Forecast Cards

function createForecastCards(days){

    forecastContainer.innerHTML = "";

    days.forEach((day,index)=>{

        const card = document.createElement("div");

        card.className="forecast-card";

        card.style.animationDelay=`${index*0.08}s`;

        card.innerHTML=`

            <h2>

                ${formatWeekDay(day.date)}

                <br>

                <span>

                    ${formatDay(day.date)}

                </span>

            </h2>

            <img
                src="${day.icon}"
                alt="weather"
            >

            <h3>

                ${day.condition}

            </h3>

            <p class="max-temp">

                ${day.maxTemp}°

            </p>

            <p class="min-temp">

                ${day.minTemp}°

            </p>

        `;

        forecastContainer.appendChild(card);

    });

}

// Date Format

function formatWeekDay(date){

    return new Date(date).toLocaleDateString(

        "en-US",

        {

            weekday:"long"

        }

    );

}

function formatDay(date){

    return new Date(date).toLocaleDateString(

        "en-US",

        {

            day:"numeric",

            month:"short"

        }

    );

}

// Chart

function updateChart(days){
  const labels = days.map((day) => formatDay(day.date));

  const temperatures = days.map((day) => day.maxTemp);
  if (temperatureChart === null) {
    temperatureChart = new Chart(chartCanvas, {
      type: "line",

      data: {
        labels,

        datasets: [
          {
            label: "Temperature",

            data: temperatures,

            borderColor: "#4f8cff",

            backgroundColor: "rgba(79,140,255,.15)",

            borderWidth: 4,

            fill: true,

            tension: 0.45,

            pointRadius: 6,

            pointHoverRadius: 8,

            pointBackgroundColor: "#4f8cff",

            pointBorderColor: "#ffffff",

            pointBorderWidth: 2,
          },
        ],
      },

      options: {
        responsive: true,

        maintainAspectRatio: false,

        animation: {
          duration: 900,

          easing: "easeOutQuart",
        },

        plugins: {
          legend: {
            display: false,
          },

          tooltip: {
            backgroundColor: "#1f2937",

            titleColor: "#fff",

            bodyColor: "#fff",

            displayColors: false,

            callbacks: {
              label(context) {
                return `${context.raw}°C`;
              },
            },
          },
        },

        interaction: {
          intersect: false,

          mode: "index",
        },

        scales: {
          x: {
            grid: {
              display: false,
            },

            ticks: {
              color: "#6b7280",

              font: {
                size: 14,

                weight: "600",
              },
            },
          },

          y: {
            beginAtZero: false,

            grid: {
              color: "rgba(0,0,0,.08)",
            },

            ticks: {
              stepSize: 2,

              color: "#6b7280",

              callback(value) {
                return value + "°";
              },
            },
          },
        },
      },
    });
  } else {
    temperatureChart.data.labels = labels;

    temperatureChart.data.datasets[0].data = temperatures;

    temperatureChart.update();
  }
}