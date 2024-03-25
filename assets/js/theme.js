const themeClasses = document.querySelectorAll(".theme");
const themeToggler = document.querySelector('.theme_toggler');

initializeTheme();

function initializeTheme() {
  let currentTheme = localStorage.getItem("theme") || "default";
  setTheme(currentTheme);
}

function toggleTheme() {
  const currentTheme = localStorage.getItem("theme") || "default";
  const newTheme = currentTheme === "default" ? "dark" : "default";
  localStorage.setItem("theme", newTheme);
  setTheme(newTheme);
}

function setTheme(theme) {
  if (theme === "default") {
    applyDefaultTheme();
  } else applyDarkTheme();
}

function applyDefaultTheme() {
  themeToggler.style.justifyContent = "flex-start";
  themeClasses.forEach((themeClass) => themeClass.classList.add("defaultTheme"));
}

function applyDarkTheme() {
  themeToggler.style.justifyContent = "flex-end";
  themeClasses.forEach(themeClass => {
    themeClass.classList.remove("defaultTheme");
    themeClass.classList.add("darkTheme");
  })
}

themeToggler.addEventListener('click', toggleTheme);