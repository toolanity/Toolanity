/**
 * nav-mega-menu.js
 * Controls navigation dropdowns, drawers, and accordion toggles for mobile view.
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
});

function initNavigation() {
  // 1. Desktop dropdown hover/click states & accessibility
  const dropdownTrigger = document.querySelector(".dropdown-trigger");
  const dropdownWrapper = document.querySelector(".has-dropdown");
  const megaMenu = document.querySelector(".mega-menu");

  if (dropdownTrigger && dropdownWrapper && megaMenu) {
    let closeTimeout = null;

    function openDropdown() {
      if (closeTimeout) clearTimeout(closeTimeout);
      dropdownTrigger.setAttribute("aria-expanded", "true");
      dropdownWrapper.classList.add("is-active");
      megaMenu.setAttribute("aria-hidden", "false");
    }

    function closeDropdown() {
      if (closeTimeout) clearTimeout(closeTimeout);
      dropdownTrigger.setAttribute("aria-expanded", "false");
      dropdownWrapper.classList.remove("is-active");
      megaMenu.setAttribute("aria-hidden", "true");
    }

    // Bind hover triggers to the shared parent container (.has-dropdown)
    dropdownWrapper.addEventListener("mouseenter", () => {
      if (window.innerWidth >= 769) {
        openDropdown();
      }
    });

    dropdownWrapper.addEventListener("mouseleave", () => {
      if (window.innerWidth >= 769) {
        closeTimeout = setTimeout(() => {
          closeDropdown();
        }, 200); // 200ms safe-zone delay
      }
    });

    // Touch/Click toggle (primarily for mobile/tablets where hover is unsupported)
    dropdownTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      
      const isExpanded = dropdownTrigger.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    // Close on click outside the menu bounds
    document.addEventListener("click", (e) => {
      if (!dropdownWrapper.contains(e.target)) {
        closeDropdown();
      }
    });

    // Close on ESC key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeDropdown();
      }
    });

    // Close when selecting a tool link
    const toolLinks = megaMenu.querySelectorAll(".mega-menu-list a:not(.coming-soon)");
    toolLinks.forEach(link => {
      link.addEventListener("click", () => {
        closeDropdown();
      });
    });
  }

  // 2. Mobile Drawer controls
  const burgerBtn = document.querySelector(".mobile-menu-trigger");
  const closeBtn = document.querySelector(".close-drawer-btn");
  const drawerOverlay = document.querySelector(".mobile-drawer-overlay");
  const drawer = document.querySelector(".mobile-drawer");

  if (burgerBtn && drawer && drawerOverlay) {
    burgerBtn.addEventListener("click", () => {
      const isExpanded = burgerBtn.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", closeMobileDrawer);
    }
    drawerOverlay.addEventListener("click", closeMobileDrawer);
  }

  function openMobileDrawer() {
    burgerBtn.setAttribute("aria-expanded", "true");
    burgerBtn.classList.add("is-active");
    drawer.classList.remove("hidden");
    drawerOverlay.classList.remove("hidden");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Prevent body scroll
    
    // Animate in
    setTimeout(() => {
      drawer.classList.add("is-open");
      drawerOverlay.classList.add("is-open");
    }, 10);
  }

  function closeMobileDrawer() {
    burgerBtn.setAttribute("aria-expanded", "false");
    burgerBtn.classList.remove("is-active");
    drawer.classList.remove("is-open");
    drawerOverlay.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // Restore scroll

    setTimeout(() => {
      drawer.classList.add("hidden");
      drawerOverlay.classList.add("hidden");
    }, 300); // Match CSS transition duration
  }

  // 3. Mobile Accordion categories
  const accTriggers = document.querySelectorAll(".mobile-acc-trigger");
  accTriggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const content = trigger.nextElementSibling;
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      
      // Close all other accordions first
      accTriggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute("aria-expanded", "false");
          otherTrigger.nextElementSibling.classList.add("hidden");
          otherTrigger.classList.remove("is-active");
        }
      });

      // Toggle current accordion
      if (isExpanded) {
        trigger.setAttribute("aria-expanded", "false");
        content.classList.add("hidden");
        trigger.classList.remove("is-active");
      } else {
        trigger.setAttribute("aria-expanded", "true");
        content.classList.remove("hidden");
        trigger.classList.add("is-active");
      }
    });
  });
}
window.initNavigation = initNavigation; // Expose globally for dynamic renders
