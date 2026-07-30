/* ==========================================
                LANGUAGE
========================================== */

let currentLanguage = localStorage.getItem("language") || "en";

const languageBtn = document.getElementById("language-btn");

/* ==========================================
            GET TRANSLATION
========================================== */

function getDictionary() {
  return currentLanguage === "fa" ? FA : EN;
}

/* ==========================================
            TRANSLATE TEXT
========================================== */

function translatePage() {
  const dictionary = getDictionary();

  // -------------------------
  // Normal Text
  // -------------------------

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;

    if (dictionary[key]) {
      element.textContent = dictionary[key];
    }
  });

  // -------------------------
  // Placeholder
  // -------------------------

  document.querySelectorAll("[data-placeholder]").forEach((element) => {
    const key = element.dataset.placeholder;

    if (dictionary[key]) {
      element.placeholder = dictionary[key];
    }
  });

  // -------------------------
  // Language Button
  // -------------------------

  if (languageBtn) {
    const languageText = languageBtn.querySelector("span");

    languageText.textContent = currentLanguage === "en" ? "FA" : "EN";
  }

  // -------------------------
  // HTML Direction
  // -------------------------

  document.documentElement.lang = currentLanguage;

  document.documentElement.dir = currentLanguage === "fa" ? "rtl" : "ltr";
}

/* ==========================================
            CHANGE LANGUAGE
========================================== */

function toggleLanguage() {
  currentLanguage = currentLanguage === "en" ? "fa" : "en";

  localStorage.setItem(
    "language",

    currentLanguage,
  );

  translatePage();
  
  document.dispatchEvent(new Event("languageChanged"));
}

/* ==========================================
            EVENTS
========================================== */

if (languageBtn) {
  languageBtn.addEventListener(
    "click",

    toggleLanguage,
  );
}

/* ==========================================
            LOAD
========================================== */

document.addEventListener(
  "DOMContentLoaded",

  () => {
    translatePage();
  },

  
);
