import { navigate } from "../router.js";

export function onLinkClick(rootEl) {
  rootEl.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-link]");
    if (!a) return;
    e.preventDefault();
    navigate(a.getAttribute("href"));
  });
}

export function setActiveNav(path) {
  document.querySelectorAll(".nav a[data-link]").forEach(a => {
    const href = a.getAttribute("href");
    a.classList.toggle("active", href === path);
  });
}
