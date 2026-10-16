/**
 * header.js
 * Injects a unified, responsive header and mega menu.
 * Uses tools-data.js to dynamically build search lists and category grids.
 */

function renderHeader() {
  const headerContainer = document.getElementById("site-header");
  if (!headerContainer) return;

  // Determine path structure (checking if this is a subpage in /tools/)
  const isSubPage = window.location.pathname.includes('/tools/') || window.location.pathname.includes('/tools');
  const basePath = isSubPage ? '../' : './';

  // Determine current active page for styling
  const path = window.location.pathname;
  const isAbout = path.includes('about-us');
  const isContact = path.includes('contact-us');
  const isHome = path.endsWith('index') || path.endsWith('/') || (!isAbout && !isContact && !isSubPage);

  // Group tools by category
  const categories = {};
  if (typeof toolsData !== 'undefined') {
    toolsData.forEach(tool => {
      if (!categories[tool.category]) {
        categories[tool.category] = [];
      }
      categories[tool.category].push(tool);
    });
  }

  // Build Mega Menu Columns HTML
  let megaMenuCols = "";
  for (const catName in categories) {
    megaMenuCols += `
      <div class="mega-menu-col">
        <h4 class="mega-menu-title">${catName}</h4>
        <ul class="mega-menu-list">
          ${categories[catName].map(tool => {
            const isActive = tool.status === "active";
            const href = isActive ? `/tools/${tool.slug}` : "#";
            const disabledClass = isActive ? "" : "class='coming-soon'";
            const badge = isActive ? "" : " <span class='badge badge-coming-soon'>Soon</span>";
            return `
              <li>
                <a href="${href}" ${disabledClass} ${!isActive ? 'onclick="return false;"' : ''}>
                  <span class="tool-icon">${tool.icon}</span>
                  <div class="tool-nav-details">
                    <span class="tool-name">${tool.name}${badge}</span>
                  </div>
                </a>
              </li>
            `;
          }).join("")}
        </ul>
      </div>
    `;
  }

  // Build Mobile Menu List HTML (Accordion lists)
  let mobileAccordionSections = "";
  for (const catName in categories) {
    mobileAccordionSections += `
      <div class="mobile-acc-section">
        <button class="mobile-acc-trigger" aria-expanded="false">
          ${catName}
          <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="mobile-acc-content hidden">
          <ul class="mobile-menu-list">
            ${categories[catName].map(tool => {
              const isActive = tool.status === "active";
              const href = isActive ? `/tools/${tool.slug}` : "#";
              const disabledClass = isActive ? "" : "class='coming-soon'";
              const badge = isActive ? "" : " <span class='badge badge-coming-soon'>Soon</span>";
              return `
                <li>
                  <a href="${href}" ${disabledClass} ${!isActive ? 'onclick="return false;"' : ''}>
                    <span class="tool-icon">${tool.icon}</span>
                    <span class="tool-name">${tool.name}${badge}</span>
                  </a>
                </li>
              `;
            }).join("")}
          </ul>
        </div>
      </div>
    `;
  }

  // Inject Header Markup
  headerContainer.innerHTML = `
    <div class="header-nav-wrapper">
      <div class="container header-container">
        <!-- Logo -->
        <a href="/" class="logo" aria-label="Toolanity Home">
          <svg class="logo-graphic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/><path d="M3 12h18"/>
          </svg>
          <span class="logo-text">Tool<span>anity</span></span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="desktop-nav" aria-label="Desktop Main Navigation">
          <a href="/" class="nav-link ${isHome ? 'active-page' : ''}">Home</a>
          <div class="nav-item has-dropdown">
            <button class="nav-link dropdown-trigger" aria-expanded="false" aria-haspopup="true">
              Tools
              <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="mega-menu" aria-hidden="true">
              <div class="container mega-menu-wrapper">
                ${megaMenuCols}
              </div>
            </div>
          </div>
          <a href="/about-us" class="nav-link ${isAbout ? 'active-page' : ''}">About Us</a>
          <a href="/contact-us" class="nav-link ${isContact ? 'active-page' : ''}">Contact</a>
        </nav>

        <!-- Search Box -->
        <div class="header-search">
          <div class="search-input-wrapper">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="header-search-input" placeholder="Search for tools..." aria-label="Search tools">
            <button id="clear-search-btn" class="clear-search-btn hidden" aria-label="Clear search">&times;</button>
          </div>
          <div id="search-results-dropdown" class="search-results-dropdown hidden"></div>
        </div>

        <!-- Right Side Actions -->
        <div class="header-actions">
          <!-- Light/Dark Toggle -->
          <button class="theme-toggle-btn" aria-label="Toggle light or dark theme">
            <!-- Sun (shows in dark mode) -->
            <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            <!-- Moon (shows in light mode) -->
            <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          </button>

          <!-- Mobile Burger Trigger -->
          <button class="mobile-menu-trigger" aria-label="Toggle Mobile Navigation" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer Navigation -->
    <div class="mobile-drawer-overlay hidden" aria-hidden="true"></div>
    <div class="mobile-drawer hidden" aria-hidden="true" role="dialog" aria-label="Mobile Navigation">
      <div class="mobile-drawer-header">
        <div class="logo">
          <svg class="logo-graphic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/><path d="M3 12h18"/>
          </svg>
          <span class="logo-text">Tool<span>anity</span></span>
        </div>
        <button class="close-drawer-btn" aria-label="Close Mobile Navigation">&times;</button>
      </div>
      <div class="mobile-drawer-body">
        <!-- Search inside mobile drawer -->
        <div class="mobile-search">
          <div class="search-input-wrapper">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="mobile-search-input" placeholder="Search for tools..." aria-label="Search tools">
            <button id="clear-mobile-search-btn" class="clear-search-btn hidden" aria-label="Clear search">&times;</button>
          </div>
          <div id="mobile-search-results" class="mobile-search-results-list hidden"></div>
        </div>

        <nav class="mobile-accordion-nav" aria-label="Mobile Tool Categories">
          <div class="mobile-acc-title">Browse Tools</div>
          ${mobileAccordionSections}
        </nav>

        <nav class="mobile-direct-nav" aria-label="General Navigation">
          <a href="/" class="mobile-direct-link ${isHome ? 'active-page' : ''}">Home</a>
          <a href="/about-us" class="mobile-direct-link ${isAbout ? 'active-page' : ''}">About Us</a>
          <a href="/contact-us" class="mobile-direct-link ${isContact ? 'active-page' : ''}">Contact</a>
        </nav>
      </div>
    </div>
  `;

  // Attach search listeners for both desktop and mobile headers
  initSearchListeners(basePath);

  // Initialize theme toggles in header
  if (window.initThemeToggle) {
    window.initThemeToggle();
  }

  // Set up scroll listener for sticky shadows
  const handleScroll = () => {
    const wrapper = document.querySelector(".header-nav-wrapper");
    if (wrapper) {
      if (window.scrollY > 10) {
        wrapper.classList.add("header-scrolled");
      } else {
        wrapper.classList.remove("header-scrolled");
      }
    }
  };
  window.removeEventListener("scroll", handleScroll);
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Run immediately in case user loaded scrolled down
}

// Client-side search filters against toolsData
function initSearchListeners(basePath) {
  const desktopInput = document.getElementById("header-search-input");
  const desktopDropdown = document.getElementById("search-results-dropdown");
  const desktopClear = document.getElementById("clear-search-btn");

  const mobileInput = document.getElementById("mobile-search-input");
  const mobileDropdown = document.getElementById("mobile-search-results");
  const mobileClear = document.getElementById("clear-mobile-search-btn");

  if (desktopInput && desktopDropdown) {
    setupInputSearch(desktopInput, desktopDropdown, desktopClear, basePath);
  }
  if (mobileInput && mobileDropdown) {
    setupInputSearch(mobileInput, mobileDropdown, mobileClear, basePath);
  }
}

function setupInputSearch(input, dropdown, clearBtn, basePath) {
  input.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length > 0) {
      clearBtn.classList.remove("hidden");
    } else {
      clearBtn.classList.add("hidden");
    }

    if (query.length < 1) {
      dropdown.classList.add("hidden");
      dropdown.innerHTML = "";
      return;
    }

    // Filter tools
    if (typeof toolsData === "undefined") return;

    const matches = toolsData.filter(tool => 
      tool.name.toLowerCase().includes(query) || 
      tool.description.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query)
    );

    renderSearchResults(matches, dropdown, basePath);
  });

  // Handle clear button
  clearBtn.addEventListener("click", () => {
    input.value = "";
    clearBtn.classList.add("hidden");
    dropdown.classList.add("hidden");
    dropdown.innerHTML = "";
    input.focus();
  });

  // Close dropdown on click outside
  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add("hidden");
    }
  });

  // Re-open if input gains focus and has query
  input.addEventListener("focus", () => {
    if (input.value.trim().length >= 1) {
      dropdown.classList.remove("hidden");
    }
  });
}

function renderSearchResults(results, container, basePath) {
  if (results.length === 0) {
    container.innerHTML = `<div class="search-no-results">No tools match your search.</div>`;
    container.classList.remove("hidden");
    return;
  }

  container.innerHTML = results.map(tool => {
    const isActive = tool.status === "active";
    const href = isActive ? `/tools/${tool.slug}` : "#";
    const actionAttr = isActive ? "" : 'onclick="return false;"';
    const badge = isActive ? "" : " <span class='badge badge-coming-soon'>Soon</span>";
    const cssClass = isActive ? "search-result-item" : "search-result-item coming-soon";
    
    return `
      <a href="${href}" class="${cssClass}" ${actionAttr}>
        <span class="result-icon">${tool.icon}</span>
        <div class="result-text">
          <div class="result-name">${tool.name}${badge}</div>
          <div class="result-desc">${tool.description}</div>
        </div>
      </a>
    `;
  }).join("");

  container.classList.remove("hidden");
}

// Automatically execute on load
renderHeader();
window.renderHeader = renderHeader;
