const axios = require("axios");

const BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

/* CITY ALIASES */

const cityAliases = {
  // ---------- Iran ----------

  تهران: "Tehran, Iran",
  شیراز: "Shiraz, Iran",
  اصفهان: "Isfahan, Iran",
  مشهد: "Mashhad, Iran",
  تبریز: "Tabriz, Iran",

  کیش: "Kish Island, Iran",
  قشم: "Qeshm Island, Iran",

  بندرعباس: "Bandar Abbas, Iran",
  "بندر عباس": "Bandar Abbas, Iran",

  بوشهر: "Bushehr, Iran",

  اهواز: "Ahvaz, Iran",
  کرج: "Karaj, Iran",
  رشت: "Rasht, Iran",
  ساری: "Sari, Iran",
  یزد: "Yazd, Iran",
  کرمان: "Kerman, Iran",
  همدان: "Hamedan, Iran",
  اراک: "Arak, Iran",
  ارومیه: "Urmia, Iran",
  اردبیل: "Ardabil, Iran",
  گرگان: "Gorgan, Iran",
  زنجان: "Zanjan, Iran",
  سنندج: "Sanandaj, Iran",

  "خرم آباد": "Khorramabad, Iran",
  خرم‌آباد: "Khorramabad, Iran",

  بیرجند: "Birjand, Iran",
  زاهدان: "Zahedan, Iran",
  قم: "Qom, Iran",
  ایلام: "Ilam, Iran",
  بجنورد: "Bojnord, Iran",

  // ---------- World ----------

  لندن: "London",
  پاریس: "Paris",
  رم: "Rome",
  برلین: "Berlin",
  استانبول: "Istanbul",
  دبی: "Dubai",
  ابوظبی: "Abu Dhabi",
  دوحه: "Doha",

  نیویورک: "New York",
  "لس آنجلس": "Los Angeles",
  واشنگتن: "Washington",

  مسکو: "Moscow",

  پکن: "Beijing",
  شانگهای: "Shanghai",
  توکیو: "Tokyo",
  سئول: "Seoul",
};

/* NORMALIZE CITY= */

function normalizeCity(city) {
  if (!city) {
    throw new Error("City is required");
  }

  let searchCity = city.trim();

  if (cityAliases[searchCity]) {
    return cityAliases[searchCity];
  }

  searchCity = searchCity.replace(/\s+/g, " ").trim();

  const lower = searchCity.toLowerCase();

  switch (lower) {
    case "kish":
      return "Kish Island, Iran";

    case "qeshm":
      return "Qeshm Island, Iran";

    case "bandar abbas":
      return "Bandar Abbas, Iran";

    case "bushehr":
      return "Bushehr, Iran";

    case "shiraz":
      return "Shiraz, Iran";

    case "tehran":
      return "Tehran, Iran";

    case "isfahan":
      return "Isfahan, Iran";

    case "mashhad":
      return "Mashhad, Iran";

    case "tabriz":
      return "Tabriz, Iran";

    default:
      return searchCity;
  }
}

/*  WEATHER ICON */

function getWeatherIcon(icon) {
  return `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/SVG/1st%20Set%20-%20Color/${icon}.svg`;
}
/* GET WEATHER */

async function getWeather(city) {
  const searchCity = normalizeCity(city);

  const response = await axios.get(
    `${BASE_URL}/${encodeURIComponent(searchCity)}`,

    {
      params: {
        unitGroup: "metric",

        include: "current,days",

        key: process.env.VISUAL_CROSSING_API_KEY,

        contentType: "json",
      },

      timeout: 15000,
    },
  );

  const weather = response.data;

  const current = weather.currentConditions;

  /*  CITY */

  let cityName = weather.address || city;

  if (cityName.includes(",")) {
    cityName = cityName

      .split(",")

      .map((item) => item.trim())[0];
  }

  /*  COUNTRY */

  let country = "";

  if (weather.resolvedAddress) {
    const parts = weather.resolvedAddress

      .split(",")

      .map((item) => item.trim());

    if (parts.length > 1) {
      country = parts[parts.length - 1];
    }
  }

  /*   FULL NAME */

  const fullName = country ? `${cityName}, ${country}` : cityName;

  /*   FORECASt */

  const forecast = weather.days

    .slice(0, 5)

    .map((day) => ({
      date: day.datetime,

      maxTemp: Math.round(day.tempmax),

      minTemp: Math.round(day.tempmin),

      temp: Math.round(day.temp),

      feelsLike: Math.round(day.feelslike),

      humidity: Math.round(day.humidity),

      pressure: Math.round(day.pressure),

      windSpeed: Math.round(day.windspeed),

      windDirection: Math.round(day.winddir),

      visibility: day.visibility,

      cloudCover: Math.round(day.cloudcover),

      uvIndex: day.uvindex,

      sunrise: day.sunrise.substring(0, 5),

      sunset: day.sunset.substring(0, 5),

      condition: day.conditions,

      description: day.description,

      icon: getWeatherIcon(day.icon),
    }));
  /*  RESPONSE */

  return {
    success: true,

    data: {
      city: cityName,

      country: country,

      fullName: fullName,

      latitude: weather.latitude,

      longitude: weather.longitude,

      timezone: weather.timezone,

      current: {
        temperature: Math.round(current.temp),

        feelsLike: Math.round(current.feelslike),

        humidity: Math.round(current.humidity),

        pressure: Math.round(current.pressure),

        windSpeed: Math.round(current.windspeed),

        windDirection: Math.round(current.winddir),

        visibility: current.visibility,

        cloudCover: Math.round(current.cloudcover),

        uvIndex: current.uvindex,

        sunrise: current.sunrise.substring(0, 5),

        sunset: current.sunset.substring(0, 5),

        condition: current.conditions,

        description: current.conditions,

        icon: getWeatherIcon(current.icon),
      },

      forecast,
    },
  };
}

/*  EXPORT */

module.exports = {
  getWeather,
};
