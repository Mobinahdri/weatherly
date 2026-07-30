const OpenAI = require("openai");

function getClient() {
  const apiKey = process.env.GAPGPT_API_KEY;

  if (!apiKey) {
    const error = new Error("GAPGPT_API_KEY is not configured");
    error.code = "AI_NOT_CONFIGURED";
    throw error;
  }

  return new OpenAI({
    apiKey,
    baseURL: process.env.AI_BASE_URL || "https://api.gapgpt.app/v1",
    timeout: 15000,
    maxRetries: 1,
  });
}

async function generateResponse({ message, language }) {
  const client = getClient();
  const responseLanguage = language === "fa" ? "Persian" : "English";

  const completion = await client.chat.completions.create({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    temperature: 0.65,
    max_tokens: 280,
    messages: [
      {
        role: "system",
        content: `You are Weatherly AI, a warm, practical weather companion.
Answer in ${responseLanguage}, matching the user's language naturally.
Do not invent live weather facts. If current conditions are needed, ask the user to use Weatherly's weather display or one of its weather shortcuts.
You can answer general questions too. Keep answers concise, friendly, and easy to scan.
For dangerous weather, health, or travel conditions, be cautious and recommend checking official local alerts.
Never claim to replace emergency, medical, or official weather services.`,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  const answer = completion.choices?.[0]?.message?.content?.trim();

  if (!answer) {
    throw new Error("The AI provider returned an empty response");
  }

  return answer;
}

module.exports = {
  generateResponse,
};
