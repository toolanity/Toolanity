/**
 * theme-toggle.js
 * Handles dark/light theme selection and state preservation.
 */

(function () {
  // Read preference from storage or default unconditionally to light mode
  const savedTheme = localStorage.getItem("theme");
  const initialTheme = savedTheme || "light";

  // Apply immediately to prevent flash
  document.documentElement.setAttribute("data-theme", initialTheme);
})();

// Initialize event listeners once DOM or Header renders
function initThemeToggle() {
  const toggleButtons = document.querySelectorAll(".theme-toggle-btn");
  
  if (toggleButtons.length === 0) return;

  toggleButtons.forEach(button => {
    // Set appropriate initial aria-label
    updateAriaLabel(button);
    
    // De-duplicate listeners
    button.removeEventListener("click", handleToggleClick);
    button.addEventListener("click", handleToggleClick);
  });
}

function handleToggleClick(e) {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";
  
  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Add transition class only on user toggle (skipped if reduced motion preferred)
  if (!prefersReducedMotion) {
    document.documentElement.classList.add("theme-transition-active");
    document.documentElement.classList.add("theme-transitioning");
  }
  
  // Set theme attribute
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  
  // Update icon/accessibility state on all buttons
  const toggleButtons = document.querySelectorAll(".theme-toggle-btn");
  toggleButtons.forEach(btn => {
    updateAriaLabel(btn);
  });

  // Remove transition class after animation completes (300ms)
  if (!prefersReducedMotion) {
    if (window.__themeTransitionTimeout) {
      clearTimeout(window.__themeTransitionTimeout);
    }
    window.__themeTransitionTimeout = setTimeout(() => {
      document.documentElement.classList.remove("theme-transition-active");
      document.documentElement.classList.remove("theme-transitioning");
    }, 300);
  }
}

function updateAriaLabel(button) {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
  if (currentTheme === "light") {
    button.setAttribute("aria-label", "Switch to dark theme");
    button.classList.add("is-light");
    button.classList.remove("is-dark");
  } else {
    button.setAttribute("aria-label", "Switch to light theme");
    button.classList.add("is-dark");
    button.classList.remove("is-light");
  }
}

// Call on DOMContentLoaded in case script is loaded after HTML
document.addEventListener("DOMContentLoaded", initThemeToggle);
window.initThemeToggle = initThemeToggle; // Expose for dynamically rendered headers
