const chatService = require("../services/chatService");

function text(value, maxLength = 160) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function number(value, min, max) {
  return Number.isFinite(value) && value >= min && value <= max
    ? value
    : null;
}

function time(value) {
  const safeValue = text(value, 5);

  return /^\d{2}:\d{2}$/.test(safeValue) ? safeValue : "";
}

function sanitizeWeather(weather) {
  if (!weather || typeof weather !== "object") return null;

  const current =
    weather.current && typeof weather.current === "object"
      ? weather.current
      : {};
  const today =
    weather.today && typeof weather.today === "object" ? weather.today : null;
  const city = text(weather.city, 80);
  const fullName = text(weather.fullName, 160);

  if (!city && !fullName) return null;

  return {
    city,
    country: text(weather.country, 80),
    fullName,
    latitude: number(weather.latitude, -90, 90),
    longitude: number(weather.longitude, -180, 180),
    timezone: text(weather.timezone, 80),
    current: {
      temperature: number(current.temperature, -100, 70),
      feelsLike: number(current.feelsLike, -100, 80),
      humidity: number(current.humidity, 0, 100),
      windSpeed: number(current.windSpeed, 0, 500),
      visibility: number(current.visibility, 0, 1000),
      cloudCover: number(current.cloudCover, 0, 100),
      uvIndex: number(current.uvIndex, 0, 30),
      condition: text(current.condition, 120),
      sunrise: time(current.sunrise),
      sunset: time(current.sunset),
    },
    today: today
      ? {
          date: text(today.date, 10),
          minTemp: number(today.minTemp, -100, 70),
          maxTemp: number(today.maxTemp, -100, 70),
          condition: text(today.condition, 120),
          description: text(today.description, 240),
          precipitationProbability: number(
            today.precipitationProbability,
            0,
            100,
          ),
        }
      : null,
  };
}

async function createChatResponse(req, res) {
  try {
    const { message, language, weather } = req.body || {};

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "A message is required",
      });
    }

    if (message.length > 600) {
      return res.status(400).json({
        success: false,
        message: "Message is too long",
      });
    }

    const answer = await chatService.generateResponse({
      message: message.trim(),
      language: language === "fa" ? "fa" : "en",
      weather: sanitizeWeather(weather),
    });

    return res.json({
      success: true,
      data: { answer },
    });
  } catch (error) {
    console.error("Assistant error:", error.message);

    const status = error.code === "AI_NOT_CONFIGURED" ? 503 : 502;

    return res.status(status).json({
      success: false,
      message: "The AI assistant is temporarily unavailable",
    });
  }
}

module.exports = {
  createChatResponse,
};
