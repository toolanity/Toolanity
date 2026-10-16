/**
 * footer.js
 * Injects a unified, responsive footer on all pages.
 * Handles relative path resolving and copyright year updates.
 */

function renderFooter() {
  const footerContainer = document.getElementById("site-footer");
  if (!footerContainer) return;
  
  // Enforce dark styling in both light and dark modes
  footerContainer.classList.add("forced-dark");

  // Determine path structure
  const isSubPage = window.location.pathname.includes('/tools/') || window.location.pathname.includes('/tools');
  const basePath = isSubPage ? '../' : './';
  const currentYear = new Date().getFullYear();

  // Filter out a few popular active tools for column 2
  let popularToolsHtml = "";
  if (typeof toolsData !== 'undefined') {
    const activeTools = toolsData.filter(t => t.status === "active").slice(0, 5);
    popularToolsHtml = activeTools.map(tool => `
      <li><a href="/tools/${tool.slug}">${tool.name}</a></li>
    `).join("");
  } else {
    // Fallback if data not loaded
    popularToolsHtml = `
      <li><a href="/tools/word-counter">Word Counter</a></li>
      <li><a href="/tools/password-generator">Password Generator</a></li>
      <li><a href="/tools/qr-code-generator">QR Code Generator</a></li>
      <li><a href="/tools/age-calculator">Age Calculator</a></li>
      <li><a href="/tools/percentage-calculator">Percentage Calculator</a></li>
    `;
  }

  footerContainer.innerHTML = `
    <div class="footer-wrapper">
      <div class="container footer-grid">
        <!-- Column 1: Brand -->
        <div class="footer-col brand-col">
          <a href="/" class="logo" aria-label="Toolanity Home">
            <svg class="logo-graphic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/><path d="M3 12h18"/>
            </svg>
            <span class="logo-text">Tool<span>anity</span></span>
          </a>
          <p class="tagline">Premium, browser-based utilities designed for privacy-first operations. Every conversion, calculation, and document is processed 100% locally in your browser.</p>
          <div class="social-links">
            <a href="#" aria-label="Toolanity Twitter" onclick="return false;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" aria-label="Toolanity GitHub" onclick="return false;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
            <a href="#" aria-label="Toolanity LinkedIn" onclick="return false;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>

        <!-- Column 2: Popular Tools -->
        <div class="footer-col">
          <h4 class="footer-title">Popular Tools</h4>
          <ul class="footer-links">
            ${popularToolsHtml}
          </ul>
        </div>

        <!-- Column 3: Categories -->
        <div class="footer-col">
          <h4 class="footer-title">Categories</h4>
          <ul class="footer-links">
            <li><a href="/#text-tools">Text Tools</a></li>
            <li><a href="/#calculators">Calculators</a></li>
            <li><a href="/#pdf-tools">PDF Tools</a></li>
            <li><a href="/#generators">Generators</a></li>
            <li><a href="/#converters">Converters</a></li>
          </ul>
        </div>

        <!-- Column 4: Company -->
        <div class="footer-col">
          <h4 class="footer-title">Company</h4>
          <ul class="footer-links">
            <li><a href="/about-us">About Us</a></li>
            <li><a href="/contact-us">Contact Us</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/disclaimer">Disclaimer</a></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <div class="container footer-bottom-content">
          <p class="copyright">&copy; ${currentYear} Toolanity. All rights reserved.</p>
          <p class="credits">Made with <span class="heart">&hearts;</span> for creators &amp; developers.</p>
        </div>
      </div>
    </div>
  `;
}

// Automatically execute on load
renderFooter();
window.renderFooter = renderFooter;
