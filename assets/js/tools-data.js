/**
 * Single source of truth for all tools on Toolanity.
 * Active tools have status: "active", and coming-soon tools have status: "coming-soon".
 */
const toolsData = [
  // --- TEXT TOOLS ---
  {
    name: "Word Counter",
    slug: "word-counter",
    category: "Text Tools",
    description: "Count words, characters, sentences, and paragraphs, and calculate reading time.",
    status: "active",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/></svg>`
  },
  {
    name: "Case Converter",
    slug: "case-converter",
    category: "Text Tools",
    description: "Convert text to UPPERCASE, lowercase, Title Case, sentence case, camelCase, snake_case, and PascalCase.",
    status: "active",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 16 4-10 4 10"/><path d="M4.5 12.5h5"/><path d="M15 16v-6c0-1.1.9-2 2-2s2 .9 2 2v6"/><path d="M15 12h4"/></svg>`
  },
  {
    name: "Chinese Character Counter",
    slug: "chinese-counter",
    category: "Text Tools",
    description: "Count Chinese characters, letters, numbers, punctuation, and full words.",
    status: "coming-soon",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M5 12h14"/><path d="m4 6 16 12"/></svg>`
  },
  {
    name: "Lorem Ipsum Generator",
    slug: "lorem-ipsum",
    category: "Text Tools",
    description: "Generate clean dummy text (Lorem Ipsum) in paragraphs, words, or lists.",
    status: "coming-soon",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
  },
  {
    name: "Base64 Encode/Decode",
    slug: "base64-coder",
    category: "Text Tools",
    description: "Encode text into Base64 format or decode Base64 strings back to plain text.",
    status: "coming-soon",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="8" x="2" y="2" rx="2"/><rect width="8" height="8" x="14" y="14" rx="2"/><path d="M14 6h2a2 2 0 0 1 2 2v2"/><path d="M10 18H8a2 2 0 0 1-2-2v-2"/></svg>`
  },

  // --- CALCULATORS ---
  {
    name: "Age Calculator",
    slug: "age-calculator",
    category: "Calculators",
    description: "Calculate your chronological age, age difference between two people, or baby's corrected age.",
    status: "active",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>`
  },
  {
    name: "Percentage Calculator",
    slug: "percentage-calculator",
    category: "Calculators",
    description: "Calculate percentage off discounts, percent increase/decrease, differences, and reverse values.",
    status: "active",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`
  },
  {
    name: "BMI Calculator",
    slug: "bmi-calculator",
    category: "Calculators",
    description: "Calculate standard BMI, reverse target weight, amputee-adjusted BMI, and pet dog BMI.",
    status: "active",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`
  },
  {
    name: "GPA Calculator",
    slug: "gpa-calculator",
    category: "Calculators",
    description: "Calculate your semester or cumulative Grade Point Average (GPA) instantly.",
    status: "coming-soon",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>`
  },
  {
    name: "Unit Converter",
    slug: "unit-converter",
    category: "Calculators",
    description: "Convert units of length, weight, temperature, pressure, torque, voltage, and flow rate.",
    status: "active",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 4 4-4"/><path d="M12 3v18"/><path d="m16 21-4-4-4 4"/></svg>`
  },

  // --- PDF TOOLS ---
  {
    name: "Merge PDF",
    slug: "merge-pdf",
    category: "PDF Tools",
    description: "Combine multiple PDF files into a single, organized document in seconds.",
    status: "coming-soon",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M9 15h6"/><path d="M12 12v6"/></svg>`
  },
  {
    name: "Split PDF",
    slug: "split-pdf",
    category: "PDF Tools",
    description: "Extract specific pages from a PDF file or split each page into standalone PDFs.",
    status: "coming-soon",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 14h8"/></svg>`
  },
  {
    name: "Compress PDF",
    slug: "compress-pdf",
    category: "PDF Tools",
    description: "Reduce the file size of your PDF documents while preserving text and image quality.",
    status: "coming-soon",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m14 12-2 2-2-2"/><path d="m10 16 2-2 2 2"/></svg>`
  },
  {
    name: "PDF to JPG",
    slug: "pdf-to-jpg",
    category: "PDF Tools",
    description: "Convert each page of a PDF document into a high-quality JPG image.",
    status: "coming-soon",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><rect width="8" height="6" x="8" y="12" rx="1"/><circle cx="10.5" cy="14.5" r=".5"/><path d="m16 18-2-2-1.5 1.5"/></svg>`
  },
  {
    name: "JPG to PDF",
    slug: "jpg-to-pdf",
    category: "PDF Tools",
    description: "Combine JPG, PNG, and WebP images into a single, neat PDF document.",
    status: "coming-soon",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`
  },
  {
    name: "Password-Protect PDF",
    slug: "protect-pdf",
    category: "PDF Tools",
    description: "Encrypt and secure your sensitive PDF files with a strong password.",
    status: "coming-soon",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
  },

  // --- GENERATORS ---
  {
    name: "Password Generator",
    slug: "password-generator",
    category: "Generators",
    description: "Generate highly secure random character passwords or memorable word passphrases.",
    status: "active",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L21 8l-3-3Z"/></svg>`
  },
  {
    name: "QR Code Generator",
    slug: "qr-code-generator",
    category: "Generators",
    description: "Generate QR codes for URLs, text, vCard contact info, email addresses, and WiFi credentials.",
    status: "active",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v-1a2 2 0 0 0-2-2h-3"/><path d="M11 7h2"/><path d="M7 11v2"/><path d="M11 11h2"/><path d="M11 15h2"/><path d="M15 11h2"/><path d="M15 15h2"/></svg>`
  },
  {
    name: "Random Number/Dice Roller",
    slug: "random-generator",
    category: "Generators",
    description: "Generate true random numbers in a custom range or roll customized dice.",
    status: "coming-soon",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 9h.01"/><path d="M15 9h.01"/><path d="M9 15h.01"/><path d="M15 15h.01"/><path d="M12 12h.01"/></svg>`
  },

  // --- CONVERTERS ---
  {
    name: "Binary/Hex/Decimal Converter",
    slug: "binary-converter",
    category: "Converters",
    description: "Convert numbers between Binary, Decimal, Hexadecimal, and Octal formats instantly.",
    status: "coming-soon",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="M14.5 4h-5L7 20h5Z"/></svg>`
  },
  {
    name: "JSON Formatter / Validator",
    slug: "json-formatter",
    category: "Converters",
    description: "Format, beautify, validate, and minify JSON with line syntax error detection, and convert CSV to JSON.",
    status: "active",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m0 8v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3m0-8V5a2 2 0 0 0-2-2h-3"/><polyline points="10 9 7 12 10 15"/><polyline points="14 9 17 12 14 15"/></svg>`
  },
  {
    name: "Color Picker from Image",
    slug: "color-picker-from-image",
    category: "Converters",
    description: "Extract color codes (HEX, RGB, HSL) from any uploaded image pixel and generate dominant color palettes.",
    status: "active",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 22 1-1h3l9-9"/><path d="M9.5 9.5 12 7l5 5-2.5 2.5"/><path d="m14 5 3-3 5 5-3 3Z"/></svg>`
  }
];

// Group definitions for mapping/rendering
const toolsCategories = [
  "Text Tools",
  "Calculators",
  "PDF Tools",
  "Generators",
  "Converters"
];

// Helper functions for client-side search and menu usage
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = { toolsData, toolsCategories };
}
