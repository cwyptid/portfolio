const btn = document.getElementById("hamburger-btn");
const menu = document.getElementById("menu");
const toggle = document.getElementById("menuToggle");

btn.addEventListener("click", () => {
  const isOpen = btn.getAttribute("aria-expanded") === "true";
  btn.setAttribute("aria-expanded", !isOpen);
  menu.classList.toggle("open");
});
