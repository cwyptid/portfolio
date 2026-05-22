const btn = document.getElementById("hamburger-btn");
const menu = document.getElementById("menu");

btn.addEventListener("click", () => {
  const isOpen = btn.getAttribute("aria-expanded") === "true";
  btn.setAttribute("aria-expanded", !isOpen);
  menu.classList.toggle("open");
});
