(function () {
  const preloadImages = ["./images/web-bg.svg", "./images/web-bg-dark.svg"];

  preloadImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  const themeToggleButton = document.getElementById("theme-toggle");
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const storedTheme = localStorage.getItem("theme");
  const currentTheme =
    storedTheme || (darkModeMediaQuery.matches ? "dark" : "light");

  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    updateButtonState(true);
  } else {
    document.documentElement.removeAttribute("data-theme");
    updateButtonState(false);
  }

  function toggleTheme(event) {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateButtonState(newTheme === "dark");

    // Remove focus from button to prevent "stuck" appearance on mobile taps.
    // event.detail === 0 means the click came from the keyboard (or was
    // dispatched programmatically), so we leave focus-visible alone there.
    if (event && event.currentTarget && event.detail !== 0) {
      event.currentTarget.blur();
    }
  }

  function updateButtonState(isDark) {
    if (!themeToggleButton) return;

    const icon = themeToggleButton.querySelector("i");
    if (icon) {
      if (isDark) {
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
      } else {
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
      }
    }
    themeToggleButton.title = isDark ? "Lights on?" : "Lights off?";
    themeToggleButton.setAttribute("aria-pressed", String(isDark));
  }

  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", toggleTheme);
  }

  darkModeMediaQuery.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      const newTheme = e.matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      updateButtonState(e.matches);
    }
  });
})();
