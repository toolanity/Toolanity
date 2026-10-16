/**
 * case-converter.js
 * Toolanity - Multi-Mode Text & Programmer Case Converter
 * 100% client-side live conversion in memory.
 */

document.addEventListener("DOMContentLoaded", () => {
  const textInput = document.getElementById("case-input");
  const textOutput = document.getElementById("case-output");
  const btnCopy = document.getElementById("btn-copy-case");
  const copyFeedback = document.getElementById("copy-case-feedback");
  const btnClear = document.getElementById("btn-clear-case");
  const btnSample = document.getElementById("btn-sample-case");

  // Stats elements
  const statWords = document.getElementById("stat-words");
  const statChars = document.getElementById("stat-chars");
  const statLines = document.getElementById("stat-lines");

  // Case mode buttons
  const modeButtons = document.querySelectorAll(".case-mode-btn");
  let currentMode = "sentence"; // Default mode

  const sampleText = "The quick brown fox jumps over the lazy dog. Welcome to Toolanity's free online convert case utility! It handles developer camelCase, snake_case, and standard headline Title Case seamlessly.";

  // Words that should not be capitalized in standard Title Case (unless first or last word of title/sub-clause)
  const minorWords = new Set([
    "a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "from",
    "by", "with", "in", "of", "as", "via", "vs", "versus"
  ]);

  // Conversion algorithms
  function toSentenceCase(str) {
    if (!str) return "";
    // Lowercase everything first, then capitalize first word and words following sentence terminators (. ! ?)
    const lower = str.toLowerCase();
    return lower.replace(/(^\s*|[.!?]\s+)([a-z\u00E0-\u00FC])/g, (match, prefix, char) => {
      return prefix + char.toUpperCase();
    });
  }

  function toTitleCase(str) {
    if (!str) return "";
    return str.toLowerCase().split(/\s+/).map((word, index, arr) => {
      if (!word) return "";
      const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "");
      const isFirstOrLast = index === 0 || index === arr.length - 1;
      
      if (!isFirstOrLast && minorWords.has(cleanWord.toLowerCase())) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(" ");
  }

  function toWords(str) {
    // Split on spaces, underscores, dashes, or camelCase transitions
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
      .replace(/[_\-]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0);
  }

  function toCamelCase(str) {
    const words = toWords(str);
    if (words.length === 0) return "";
    return words.map((w, i) => {
      const lower = w.toLowerCase();
      if (i === 0) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }).join("");
  }

  function toPascalCase(str) {
    const words = toWords(str);
    if (words.length === 0) return "";
    return words.map(w => {
      const lower = w.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }).join("");
  }

  function toSnakeCase(str) {
    const words = toWords(str);
    if (words.length === 0) return "";
    return words.map(w => w.toLowerCase()).join("_");
  }

  function toConstantCase(str) {
    const words = toWords(str);
    if (words.length === 0) return "";
    return words.map(w => w.toUpperCase()).join("_");
  }

  function toKebabCase(str) {
    const words = toWords(str);
    if (words.length === 0) return "";
    return words.map(w => w.toLowerCase()).join("-");
  }

  function toAlternatingCase(str) {
    if (!str) return "";
    let capitalize = false;
    return str.split("").map(char => {
      if (/[a-zA-Z]/.test(char)) {
        const res = capitalize ? char.toUpperCase() : char.toLowerCase();
        capitalize = !capitalize;
        return res;
      }
      return char;
    }).join("");
  }

  function convertText(text, mode) {
    if (!text) return "";
    switch (mode) {
      case "upper":
        return text.toUpperCase();
      case "lower":
        return text.toLowerCase();
      case "title":
        return toTitleCase(text);
      case "sentence":
        return toSentenceCase(text);
      case "camel":
        return toCamelCase(text);
      case "pascal":
        return toPascalCase(text);
      case "snake":
        return toSnakeCase(text);
      case "constant":
        return toConstantCase(text);
      case "kebab":
        return toKebabCase(text);
      case "alternating":
        return toAlternatingCase(text);
      default:
        return text;
    }
  }

  function updateOutput() {
    const input = textInput ? textInput.value : "";
    const converted = convertText(input, currentMode);
    if (textOutput) textOutput.value = converted;

    // Update stats based on input
    const trimmed = input.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const chars = input.length;
    const lines = input ? input.split("\n").length : 0;

    if (statWords) statWords.textContent = words.toLocaleString();
    if (statChars) statChars.textContent = chars.toLocaleString();
    if (statLines) statLines.textContent = lines.toLocaleString();
  }

  // Bind mode buttons
  modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      modeButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentMode = btn.getAttribute("data-mode");
      updateOutput();
    });
  });

  if (textInput) {
    textInput.addEventListener("input", updateOutput);
  }

  if (btnClear) {
    btnClear.addEventListener("click", () => {
      if (textInput) textInput.value = "";
      updateOutput();
      if (textInput) textInput.focus();
    });
  }

  if (btnSample) {
    btnSample.addEventListener("click", () => {
      if (textInput) textInput.value = sampleText;
      updateOutput();
    });
  }

  if (btnCopy && textOutput) {
    btnCopy.addEventListener("click", () => {
      if (!textOutput.value) return;
      navigator.clipboard.writeText(textOutput.value).then(() => {
        if (copyFeedback) {
          copyFeedback.classList.remove("hidden");
          setTimeout(() => copyFeedback.classList.add("hidden"), 2000);
        }
      });
    });
  }

  // Initial calculation
  updateOutput();
});
