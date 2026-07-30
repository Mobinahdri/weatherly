/* ==========================================
        WEATHERLY AI ASSISTANT
========================================== */

const assistantToggle = document.getElementById("assistant-toggle");

const assistantWindow = document.getElementById("assistant-window");

const assistantClose = document.getElementById("assistant-close");

const assistantInput = document.getElementById("assistant-input");

const assistantSend = document.getElementById("assistant-send");

const assistantBody = document.getElementById("assistant-body");

const assistantCity = document.getElementById("assistant-city");

const assistantGreeting = document.getElementById("assistant-greeting");

let language = localStorage.getItem("language") || "en";

let currentWeather = null;
let isSending = false;
const conversationHistory = [];
document.addEventListener("languageChanged", () => {
  language = localStorage.getItem("language") || "en";

  loadAssistantCity();
});
/* ==========================================
        SAFETY CHECK
========================================== */

if (!assistantToggle || !assistantWindow) {
  console.log("Weather AI not available");
}

/* ==========================================
        OPEN / CLOSE
========================================== */

assistantToggle?.addEventListener("click", () => {
  assistantWindow.classList.add("active");

  loadAssistantCity();
});

assistantClose?.addEventListener("click", () => {
  assistantWindow.classList.remove("active");
});

/* ==========================================
        CITY CONTEXT
========================================== */

function loadAssistantCity() {
  const city = localStorage.getItem("selectedCity");

  if (city) {
    const dictionary = language === "fa" ? FA : EN;

    assistantCity.textContent = `${dictionary.assistantCurrentCity}: ${
      language === "fa" ? translateCity(city) : city
    }`;

    loadWeather(city);
  } else {
    assistantCity.textContent =
      language === "fa" ? "شهری انتخاب نشده" : "No city selected";
  }
}

async function loadWeather(city) {
  try {
    const response = await fetch(`${API_URL}?city=${encodeURIComponent(city)}`);

    const result = await response.json();

    if (result.success) {
      currentWeather = result.data;
    }
  } catch (error) {
    console.log(error);
  }
}

/* ==========================================
        SEND MESSAGE
========================================== */

assistantSend?.addEventListener("click", sendMessage);

assistantInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

async function sendMessage() {
  const text = assistantInput.value.trim();

  if (!text || isSending) return;

  addMessage(text, "user");

  assistantInput.value = "";

  showTyping();
  setSendingState(true);

  try {
    const answer = await requestAIResponse(text);

    conversationHistory.push(
      { role: "user", content: text },
      { role: "assistant", content: answer }
    );

    addMessage(answer, "bot");
  } catch (error) {
    console.error("Weatherly AI request failed:", error);

    addMessage(getUnavailableMessage(), "bot");
  } finally {
    removeTyping();
    setSendingState(false);
    assistantInput.focus();
  }
}

async function requestAIResponse(message) {
  const response = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      language,
      weather: currentWeather,
      history: conversationHistory.slice(-6),
    }),
  });

  const result = await response.json();

  if (!response.ok || !result.success || !result.data?.answer) {
    throw new Error(result.message || "AI request failed");
  }

  return result.data.answer;
}

function getUnavailableMessage() {
  return language === "fa"
    ? "الان نتوانستم به هوش مصنوعی وصل شوم ☁️ لطفاً کمی بعد دوباره امتحان کنید. گزینه‌های آماده‌ی سفر، لباس، فعالیت بیرونی و ایمنی همچنان در دسترس‌اند."
    : "I couldn't reach the AI just now ☁️ Please try again shortly. The travel, clothing, outdoor, and safety shortcuts are still available.";
}

function setSendingState(sending) {
  isSending = sending;
  assistantInput.disabled = sending;
  assistantSend.disabled = sending;
}

/* ==========================================
        MESSAGE
========================================== */

function addMessage(text, type) {
  const message = document.createElement("div");

  message.className = `assistant-message ${type}`;

  const paragraph = document.createElement("p");

  paragraph.textContent = text;

  message.appendChild(paragraph);

  assistantBody.appendChild(message);

  assistantBody.scrollTop = assistantBody.scrollHeight;
}

/* ==========================================
        TYPING
========================================== */

function showTyping() {
  const typing = document.createElement("div");

  typing.id = "assistant-typing";

  typing.className = "assistant-message bot typing";

  typing.innerHTML = `
<span></span>
<span></span>
<span></span>
`;

  assistantBody.appendChild(typing);

  assistantBody.scrollTop = assistantBody.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("assistant-typing");

  if (typing) {
    typing.remove();
  }
}

/* ==========================================
        QUICK ACTIONS
========================================== */

document
  .querySelectorAll(".assistant-action")

  .forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.question;

      const dictionary = language === "fa" ? FA : EN;

      let label = "";

      switch (type) {
        case "travel":
          label = dictionary.travelPlan;
          break;

        case "clothing":
          label = dictionary.clothingAdvice;
          break;

        case "outdoor":
          label = dictionary.outdoorActivity;
          break;

        case "health":
          label = dictionary.weatherSafety;
          break;
      }

      addMessage(label, "user");

      showTyping();

      setTimeout(() => {
        removeTyping();

        addMessage(generateAnswer(type), "bot");}, 700);
    });
  });

/* ==========================================
        AI RESPONSE
========================================== */

function generateAnswer(question) {
  const text = question.toLowerCase();

  const city = currentWeather?.fullName || "";

  const temp = currentWeather?.current?.temperature;

  /* CLOTHING */

  if (
    text.includes("clothing") ||
    text.includes("wear") ||
    text.includes("jacket") ||
    text.includes("لباس") ||
    text.includes("بپوش")
  ) {
    return language === "fa"
      ? `
برای ${translateCity(city)} 👕

دمای فعلی ${temp || "--"} درجه است.

${
  temp > 28
    ? "لباس سبک، نخی و عینک آفتابی انتخاب مناسبی است."
    : "یک ژاکت سبک یا لباس گرم‌تر بهتر است."
}
`
      : `
For ${city} 👕

Current temperature is ${temp || "--"}°C.

${
  temp > 28
    ? "Light clothes and sunglasses are recommended."
    : "A light jacket or warmer clothes may be useful."
}

`;
  }

  /* TRAVEL */

  if (
    text.includes("travel") ||
    text.includes("trip") ||
    text.includes("سفر")
  ) {
    return language === "fa"
      ? `
برای سفر به ${translateCity(city)} ✈️

قبل از حرکت وضعیت هوا را بررسی کنید.

دمای فعلی ${temp || "--"} درجه است.

لباس مناسب و وسایل ضروری همراه داشته باشید.
`
      : `
For your trip to ${city} ✈️

Check the weather before leaving.

Current temperature is ${temp || "--"}°C.

Take suitable clothes and essentials.
`;
  }

  /* OUTDOOR */

  if (
    text.includes("outdoor") ||
    text.includes("outside") ||
    text.includes("بیرون")
  ) {
    return language === "fa"
      ? `
برای فعالیت بیرونی در ${translateCity(city)}:

شرایط باد و دما را بررسی کنید.

آب و ضدآفتاب همراه داشته باشید.
`
      : `
For outdoor activities in ${city}:

Check wind and temperature conditions.

Stay hydrated and use sunscreen.
`;
  }

  /* HEALTH */

  if (text.includes("health") || text.includes("سلامت")) {
    return language === "fa"
      ? `
تغییرات آب‌وهوا روی بدن تاثیر دارد.

در هوای گرم آب کافی بنوشید و در هوای سرد لباس مناسب بپوشید.
`
      : `
Weather changes can affect your body.

Stay hydrated in hot weather and dress properly in cold weather.
`;
  }

  /* DEFAULT */

  return language === "fa"
    ? `
من Weatherly AI هستم ☁️

می‌توانم درباره آب‌وهوا، سفر، لباس مناسب و فعالیت‌های بیرونی کمک کنم.
`
    : `
I'm Weatherly AI ☁️

I can help you with weather, travel, clothing and outdoor activities.
`;
}

/* ==========================================
        CITY TRANSLATION
========================================== */

function translateCity(city) {
  const cities = {
    Shiraz: "شیراز",

    Tehran: "تهران",

    London: "لندن",

    Berlin: "برلین",

    Paris: "پاریس",

    Tokyo: "توکیو",

    Dubai: "دبی",
  };

  return cities[city] || city;
}
function showGreeting() {
  if (!assistantGreeting) return;

  assistantGreeting.classList.add("show");

  setTimeout(() => {
    assistantGreeting.classList.remove("show");
  }, 5000);
}
/* ==========================================
        INITIALIZE ASSISTANT
========================================== */

window.addEventListener("load", () => {

    loadAssistantCity();

    setTimeout(() => {

        showGreeting();

    }, 1200);

});
