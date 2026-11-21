"use strict";

// Apply the saved appearance before the stylesheet paints the first frame.
const PaperAppearance = (() => {
  const storageKey = "gsg.paperbot-foundry.appearance";
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  const modes = ["system", "workshop", "night", "contrast"];
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    // Appearance remains usable when the browser blocks local storage.
  }
  let mode = modes.includes(saved.theme) ? saved.theme : "system";

  function apply() {
    const resolved = mode === "system" ? (systemDark.matches ? "night" : "workshop") : mode;
    document.documentElement.dataset.theme = resolved;
    const colors = {workshop: "#f5f3e9", night: "#18211d", contrast: "#050505"};
    document.querySelector('meta[name="theme-color"]').content = colors[resolved];
    const toggle = document.getElementById("dark-toggle");
    if (toggle) toggle.setAttribute("aria-pressed", String(resolved === "night"));
  }
  function choose(value) {
    if (modes.includes(value)) mode = value;
    apply();
  }
  systemDark.addEventListener("change", () => {
    if (mode === "system") apply();
  });
  apply();
  return {storageKey, grid: saved.grid !== false, get mode() { return mode; }, apply, choose};
})();
