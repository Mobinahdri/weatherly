/*     DARK MODE */

const darkBtn = document.querySelector(".dark-mode-btn");

const darkIcon = darkBtn.querySelector("i");

/* - Load Mode - */

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");

  darkIcon.classList.remove("fa-moon");
  darkIcon.classList.add("fa-sun");
}

/* -- Toggle -- */

darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");

    darkIcon.classList.remove("fa-moon");
    darkIcon.classList.add("fa-sun");
  } else {
    localStorage.setItem("theme", "light");

    darkIcon.classList.remove("fa-sun");
    darkIcon.classList.add("fa-moon");
  }
});

/* PAGE ANIMATION */

window.addEventListener("load", () => {
  document.querySelector(".about-section").style.opacity = "1";
});
