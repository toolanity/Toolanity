/**
 * password-generator.js
 * Handles password and passphrase generation using secure cryptographic randomness,
 * dynamic strength measurement, and clipboard controls.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Tabs selectors
  const tabPassphrase = document.getElementById("tab-passphrase");
  const tabCharacters = document.getElementById("tab-characters");
  const passphraseSettings = document.getElementById("passphrase-settings");
  const characterSettings = document.getElementById("character-settings");

  // Slider inputs
  const passphraseLengthInput = document.getElementById("passphrase-length");
  const passphraseLengthVal = document.getElementById("passphrase-length-val");
  const charLengthInput = document.getElementById("char-length");
  const charLengthVal = document.getElementById("char-length-val");

  // Interactive buttons and inputs
  const generateBtn = document.getElementById("generate-btn");
  const copyBtn = document.getElementById("copy-password-btn");
  const outputArea = document.getElementById("generated-password-output");
  const copyFeedback = document.getElementById("copy-feedback-msg");

  // Strength UI
  const strengthLabel = document.getElementById("strength-label");
  const bars = [
    document.getElementById("bar-1"),
    document.getElementById("bar-2"),
    document.getElementById("bar-3"),
    document.getElementById("bar-4")
  ];

  // Passphrase options
  const toggleFunnyWords = document.getElementById("toggle-funny-words");
  const togglePassphraseCaps = document.getElementById("toggle-passphrase-caps");
  const togglePassphraseNumber = document.getElementById("toggle-passphrase-number");

  // Character options
  const optUppercase = document.getElementById("opt-uppercase");
  const optLowercase = document.getElementById("opt-lowercase");
  const optNumbers = document.getElementById("opt-numbers");
  const optSymbols = document.getElementById("opt-symbols");

  let activeMode = "passphrase"; // 'passphrase' or 'characters'

  // Word Lists (100 standard and 100 funny words)
  const standardWords = [
    "apple", "banana", "river", "mountain", "window", "pencil", "guitar", "forest", "ocean", "street",
    "yellow", "shadow", "summer", "winter", "cloud", "castle", "planet", "bridge", "rocket", "island",
    "anchor", "beacon", "candle", "copper", "desert", "engine", "feather", "garden", "hammer", "jungle",
    "lantern", "marble", "needle", "palace", "quiver", "saddle", "timber", "valley", "whisper", "canyon",
    "harbor", "glacier", "meadow", "pebble", "crystal", "crescent", "horizon", "safari", "summit", "thunder",
    "volcano", "breeze", "cobalt", "velvet", "vintage", "mosaic", "pioneer", "voyage", "compass", "emerald",
    "galaxy", "canyon", "meadow", "harbor", "breeze", "beacon", "citadel", "harvest", "sequoia", "monolith",
    "glimmer", "summit", "pinnacle", "eclipse", "zenith", "aurora", "oasis", "mirage", "cyclone", "monsoon",
    "quartz", "granite", "obsidian", "limestone", "pebble", "copper", "silver", "bronze", "platinum", "titanium",
    "tundra", "savanna", "woodland", "prairie", "orchard", "vineyard", "pasture", "plateau", "lagoon", "geyser"
  ];

  const funnyWords = [
    "monkey", "cactus", "pickle", "waffle", "donut", "taco", "burrito", "mustache", "badger", "penguin",
    "goblin", "cookie", "sloth", "llama", "bubble", "noodle", "squishy", "giggling", "spaghetti", "dinosaur",
    "narwhal", "yeti", "sasquatch", "platypus", "koala", "hedgehog", "raccoon", "opossum", "skunk", "beaver",
    "otter", "walrus", "seal", "octopus", "jellyfish", "starfish", "seahorse", "crab", "lobster", "shrimp",
    "squid", "snail", "slug", "worm", "butterfly", "beetle", "ladybug", "dragonfly", "cricket", "spider",
    "wasp", "gnat", "mosquito", "badger", "chipmunk", "hamster", "chinchilla", "capybara", "wombat", "lemur",
    "meerkat", "baboon", "chimpanzee", "gorilla", "orangutan", "gibbon", "marmoset", "sloth", "armadillo", "anteater",
    "waffle", "pancake", "muffin", "croissant", "bagel", "cupcake", "brownie", "fudge", "truffle", "pudding",
    "macaroni", "noodle", "dumpling", "meatball", "sausage", "bacon", "pickle", "olive", "pepperoni", "mushroom",
    "marshmallow", "lollipop", "jellybean", "gumdrop", "licorice", "caramel", "toffee", "butterscotch", "nougat", "marzipan"
  ];

  // Character sets
  const charSets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,./<>?"
  };

  // --- INITIALIZE EVENT LISTENERS ---
  
  // Tab triggers
  tabPassphrase.addEventListener("click", () => switchMode("passphrase"));
  tabCharacters.addEventListener("click", () => switchMode("characters"));

  // Sliders updates
  passphraseLengthInput.addEventListener("input", (e) => {
    passphraseLengthVal.textContent = e.target.value;
    generatePassword();
  });

  charLengthInput.addEventListener("input", (e) => {
    charLengthVal.textContent = e.target.value;
    generatePassword();
  });

  // Checkboxes update live
  const allControls = [
    toggleFunnyWords, togglePassphraseCaps, togglePassphraseNumber,
    optUppercase, optLowercase, optNumbers, optSymbols
  ];
  allControls.forEach(ctrl => {
    ctrl.addEventListener("change", generatePassword);
  });

  // Radio separators updates
  document.querySelectorAll("input[name='separator']").forEach(radio => {
    radio.addEventListener("change", generatePassword);
  });

  // Generate trigger
  generateBtn.addEventListener("click", generatePassword);

  // Copy trigger
  if (copyBtn) {
    copyBtn.addEventListener("click", copyToClipboard);
  }

  // --- CORE FUNCTIONS ---

  function switchMode(mode) {
    activeMode = mode;
    if (mode === "passphrase") {
      tabPassphrase.classList.add("active");
      tabCharacters.classList.remove("active");
      passphraseSettings.classList.remove("hidden");
      characterSettings.classList.add("hidden");
    } else {
      tabPassphrase.classList.remove("active");
      tabCharacters.classList.add("active");
      passphraseSettings.classList.add("hidden");
      characterSettings.classList.remove("hidden");
    }
    generatePassword();
  }

  // Cryptographically secure random integer generation
  function secureRandomInt(max) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  }

  function generatePassword() {
    let password = "";

    if (activeMode === "passphrase") {
      const numWords = parseInt(passphraseLengthInput.value);
      const isFunny = toggleFunnyWords.checked;
      const isCaps = togglePassphraseCaps.checked;
      const isNumber = togglePassphraseNumber.checked;

      // Select word source
      const wordSource = isFunny ? funnyWords : standardWords;
      const chosenWords = [];

      for (let i = 0; i < numWords; i++) {
        const randomIndex = secureRandomInt(wordSource.length);
        let word = wordSource[randomIndex];
        if (isCaps) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        chosenWords.push(word);
      }

      // Separator selector
      const separatorInput = document.querySelector("input[name='separator']:checked");
      let separator = "-";
      if (separatorInput) {
        if (separatorInput.value === "underscore") separator = "_";
        else if (separatorInput.value === "space") separator = " ";
        else if (separatorInput.value === "none") separator = "";
      }

      password = chosenWords.join(separator);

      if (isNumber) {
        const randomNumber = secureRandomInt(90) + 10; // Pick 10-99
        password += separator + randomNumber;
      }
    } 
    else {
      const length = parseInt(charLengthInput.value);
      let allowedChars = "";

      if (optUppercase.checked) allowedChars += charSets.uppercase;
      if (optLowercase.checked) allowedChars += charSets.lowercase;
      if (optNumbers.checked) allowedChars += charSets.numbers;
      if (optSymbols.checked) allowedChars += charSets.symbols;

      // Fallback in case user unchecked all boxes
      if (allowedChars === "") {
        optLowercase.checked = true;
        allowedChars = charSets.lowercase;
      }

      const tempChars = [];
      for (let i = 0; i < length; i++) {
        const randomIndex = secureRandomInt(allowedChars.length);
        tempChars.push(allowedChars.charAt(randomIndex));
      }
      password = tempChars.join("");
    }

    outputArea.value = password;
    evaluateStrength(password);
  }

  function evaluateStrength(password) {
    let score = 0; // 0 to 4 strength tier

    if (!password) {
      updateStrengthUI(0, "Empty");
      return;
    }

    if (activeMode === "passphrase") {
      // Passphrases get strength by number of words + checks
      const numWords = parseInt(passphraseLengthInput.value);
      if (numWords === 3) score = 2; // Medium
      else if (numWords === 4) score = 3; // Strong
      else if (numWords >= 5) score = 4; // Very Strong

      // Additional strength for caps or numbers
      if (score < 4 && (togglePassphraseCaps.checked || togglePassphraseNumber.checked)) {
        score++;
      }
    } 
    else {
      // Random characters strength check
      const length = password.length;
      
      // Calculate active varieties
      let varieties = 0;
      if (/[A-Z]/.test(password)) varieties++;
      if (/[a-z]/.test(password)) varieties++;
      if (/[0-9]/.test(password)) varieties++;
      if (/[^A-Za-z0-9]/.test(password)) varieties++;

      if (length < 10) {
        score = 1; // Weak
      } else if (length >= 10 && length < 14) {
        score = varieties >= 3 ? 3 : 2; // Strong or Medium
      } else {
        score = varieties >= 3 ? 4 : 3; // Very Strong or Strong
      }
    }

    // Map score to label & colors
    const labels = ["Weak", "Weak", "Medium", "Strong", "Very Strong"];
    updateStrengthUI(score, labels[score]);
  }

  function updateStrengthUI(score, label) {
    strengthLabel.textContent = label;

    // Reset colors
    bars.forEach(bar => {
      bar.style.backgroundColor = "transparent";
    });

    let barColor = "";
    if (score === 1) barColor = "#EF4444"; // Red
    else if (score === 2) barColor = "#F59E0B"; // Orange (Premium gold-ish)
    else if (score === 3) barColor = "#34D399"; // Light Emerald
    else if (score === 4) barColor = "#059669"; // Emerald Accent

    // Fill active bars
    for (let i = 0; i < score; i++) {
      if (bars[i]) {
        bars[i].style.backgroundColor = barColor;
      }
    }
  }

  function copyToClipboard() {
    const passwordText = outputArea.value;
    if (!passwordText) return;

    navigator.clipboard.writeText(passwordText)
      .then(() => {
        copyFeedback.classList.add("visible");
        setTimeout(() => {
          copyFeedback.classList.remove("visible");
        }, 2000);
      })
      .catch(err => {
        console.error("Could not copy password to clipboard: ", err);
      });
  }

  // Initial trigger on load
  generatePassword();
});
