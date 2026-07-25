const weatherService = require("../services/weatherService");

async function getWeather(req, res) {
  try {
    const city = req.query.city;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required",
      });
    }

    const data = await weatherService.getWeather(city);

    res.json(data);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  getWeather,
};
