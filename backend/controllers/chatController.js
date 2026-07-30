const chatService = require("../services/chatService");

async function createChatResponse(req, res) {
  try {
    const { message, language, weather, history } = req.body || {};

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
      weather,
      history,
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
