/**
 * color-picker-from-image.js
 * Toolanity - Interactive Image Color Picker, Eyedropper & Palette Generator
 * 100% client-side HTML5 canvas processing in memory.
 */

document.addEventListener("DOMContentLoaded", () => {
  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("image-file-input");
  const btnUpload = document.getElementById("btn-upload-image");
  const btnSample = document.getElementById("btn-sample-image");
  const canvas = document.getElementById("image-canvas");
  const ctx = canvas ? canvas.getContext("2d", { willReadFrequently: true }) : null;

  const canvasWrapper = document.getElementById("canvas-wrapper");
  const magnifier = document.getElementById("color-magnifier");
  const magnifierCanvas = document.getElementById("magnifier-canvas");
  const magCtx = magnifierCanvas ? magnifierCanvas.getContext("2d") : null;

  // Selected Color Display Elements
  const previewSwatch = document.getElementById("selected-color-swatch");
  const hexVal = document.getElementById("val-hex");
  const rgbVal = document.getElementById("val-rgb");
  const hslVal = document.getElementById("val-hsl");
  const selectedDetails = document.getElementById("selected-details");

  const btnCopyHex = document.getElementById("btn-copy-hex");
  const btnCopyRgb = document.getElementById("btn-copy-rgb");
  const btnCopyHsl = document.getElementById("btn-copy-hsl");

  const paletteContainer = document.getElementById("palette-container");

  let currentImage = null;
  let naturalWidth = 0;
  let naturalHeight = 0;

  // Color conversion utilities
  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("").toUpperCase();
  }

  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  function setSelectedColor(r, g, b) {
    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);

    if (previewSwatch) {
      previewSwatch.style.backgroundColor = hex;
    }
    if (hexVal) hexVal.textContent = hex;
    if (rgbVal) rgbVal.textContent = `rgb(${r}, ${g}, ${b})`;
    if (hslVal) hslVal.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

    if (selectedDetails) {
      selectedDetails.classList.remove("hidden");
    }
  }

  // Generate dominant color palette via grid sampling
  function extractPalette(img) {
    if (!paletteContainer) return;
    paletteContainer.innerHTML = "";

    // Downscale to a small 50x50 canvas for fast frequency sampling
    const offCanvas = document.createElement("canvas");
    offCanvas.width = 50;
    offCanvas.height = 50;
    const offCtx = offCanvas.getContext("2d");
    offCtx.drawImage(img, 0, 0, 50, 50);

    const imgData = offCtx.getImageData(0, 0, 50, 50).data;
    const colorCounts = {};

    for (let i = 0; i < imgData.length; i += 4) {
      const a = imgData[i + 3];
      if (a < 128) continue; // Skip transparency

      // Quantize to reduce near-identical shades (binning to multiples of 24)
      const r = Math.round(imgData[i] / 24) * 24;
      const g = Math.round(imgData[i + 1] / 24) * 24;
      const b = Math.round(imgData[i + 2] / 24) * 24;

      const key = `${r},${g},${b}`;
      colorCounts[key] = (colorCounts[key] || 0) + 1;
    }

    // Sort by popularity and select distinct top colors
    const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
    const palette = [];

    for (const [key] of sorted) {
      const [r, g, b] = key.split(",").map(Number);
      // Check difference against already chosen colors
      const isDistinct = palette.every(c => {
        const dist = Math.hypot(c.r - r, c.g - g, c.b - b);
        return dist > 45; // Minimum color distance
      });

      if (isDistinct) {
        palette.push({ r, g, b, hex: rgbToHex(r, g, b) });
      }

      if (palette.length >= 8) break;
    }

    // If palette is small, fallback with defaults
    if (palette.length === 0) {
      palette.push({ r: 5, g: 150, b: 105, hex: "#059669" });
    }

    // Render palette items
    palette.forEach(color => {
      const card = document.createElement("div");
      card.className = "palette-card";
      card.style.cursor = "pointer";
      card.style.textAlign = "center";
      card.style.display = "flex";
      card.style.flexDirection = "column";
      card.style.alignItems = "center";
      card.style.gap = "0.35rem";

      const swatch = document.createElement("div");
      swatch.style.width = "48px";
      swatch.style.height = "48px";
      swatch.style.borderRadius = "var(--radius-md)";
      swatch.style.backgroundColor = color.hex;
      swatch.style.border = "2px solid var(--color-border)";
      swatch.style.boxShadow = "var(--shadow-sm)";
      swatch.style.transition = "transform 0.15s ease";

      const label = document.createElement("span");
      label.style.fontFamily = "monospace";
      label.style.fontSize = "0.75rem";
      label.style.fontWeight = "600";
      label.style.color = "var(--color-text-primary)";
      label.textContent = color.hex;

      card.appendChild(swatch);
      card.appendChild(label);

      card.addEventListener("mouseenter", () => {
        swatch.style.transform = "scale(1.1)";
      });
      card.addEventListener("mouseleave", () => {
        swatch.style.transform = "scale(1)";
      });

      card.addEventListener("click", () => {
        setSelectedColor(color.r, color.g, color.b);
        navigator.clipboard.writeText(color.hex);
        label.textContent = "Copied!";
        setTimeout(() => {
          label.textContent = color.hex;
        }, 1500);
      });

      paletteContainer.appendChild(card);
    });
  }

  // Load and render image to canvas
  function loadImage(src) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      currentImage = img;
      naturalWidth = img.naturalWidth || img.width;
      naturalHeight = img.naturalHeight || img.height;

      // Fit into canvas wrapper max width
      const maxWidth = canvasWrapper.clientWidth || 650;
      const scale = Math.min(1, maxWidth / naturalWidth);
      const targetW = Math.round(naturalWidth * scale);
      const targetH = Math.round(naturalHeight * scale);

      canvas.width = targetW;
      canvas.height = targetH;
      ctx.drawImage(img, 0, 0, targetW, targetH);

      canvasWrapper.classList.remove("hidden");
      if (dropZone) dropZone.classList.add("hidden");

      // Extract palette
      extractPalette(img);

      // Default sample center pixel
      const centerPixel = ctx.getImageData(Math.floor(targetW / 2), Math.floor(targetH / 2), 1, 1).data;
      setSelectedColor(centerPixel[0], centerPixel[1], centerPixel[2]);
    };
    img.src = src;
  }

  // Sample graphic generation (colorful geometric landscape)
  function createSampleImage() {
    const sampleCanvas = document.createElement("canvas");
    sampleCanvas.width = 700;
    sampleCanvas.height = 450;
    const sCtx = sampleCanvas.getContext("2d");

    // Sky gradient
    const sky = sCtx.createLinearGradient(0, 0, 0, 300);
    sky.addColorStop(0, "#0f172a");
    sky.addColorStop(0.5, "#1e3a8a");
    sky.addColorStop(1, "#3b82f6");
    sCtx.fillStyle = sky;
    sCtx.fillRect(0, 0, 700, 450);

    // Glowing Sun
    sCtx.beginPath();
    sCtx.arc(350, 180, 70, 0, Math.PI * 2);
    sCtx.fillStyle = "#fbbf24";
    sCtx.fill();

    // Mountain 1 (Purple)
    sCtx.beginPath();
    sCtx.moveTo(0, 400);
    sCtx.lineTo(220, 160);
    sCtx.lineTo(440, 400);
    sCtx.closePath();
    sCtx.fillStyle = "#6366f1";
    sCtx.fill();

    // Mountain 2 (Teal / Emerald)
    sCtx.beginPath();
    sCtx.moveTo(260, 400);
    sCtx.lineTo(500, 190);
    sCtx.lineTo(700, 400);
    sCtx.closePath();
    sCtx.fillStyle = "#059669";
    sCtx.fill();

    // Foreground hills
    sCtx.beginPath();
    sCtx.moveTo(0, 380);
    sCtx.quadraticCurveTo(350, 310, 700, 390);
    sCtx.lineTo(700, 450);
    sCtx.lineTo(0, 450);
    sCtx.closePath();
    sCtx.fillStyle = "#10b981";
    sCtx.fill();

    return sampleCanvas.toDataURL("image/png");
  }

  // --- Eyedropper Magnifier & Pixel Picking ---
  function getPixelColorAt(e) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return null;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    return {
      x,
      y,
      r: pixel[0],
      g: pixel[1],
      b: pixel[2],
      a: pixel[3]
    };
  }

  if (canvas && magnifier && magnifierCanvas) {
    canvas.addEventListener("mousemove", (e) => {
      const pixel = getPixelColorAt(e);
      if (!pixel) {
        magnifier.classList.add("hidden");
        return;
      }

      magnifier.classList.remove("hidden");
      const wrapperRect = canvasWrapper.getBoundingClientRect();
      const mouseX = e.clientX - wrapperRect.left;
      const mouseY = e.clientY - wrapperRect.top;

      // Position magnifier slightly offset from cursor
      magnifier.style.left = `${mouseX + 16}px`;
      magnifier.style.top = `${mouseY + 16}px`;

      // Draw zoomed 9x9 pixel patch onto magnifier canvas
      const zoom = 10;
      const patchSize = 9;
      magnifierCanvas.width = patchSize * zoom;
      magnifierCanvas.height = patchSize * zoom;
      magCtx.imageSmoothingEnabled = false;

      const sx = Math.max(0, pixel.x - Math.floor(patchSize / 2));
      const sy = Math.max(0, pixel.y - Math.floor(patchSize / 2));
      magCtx.drawImage(canvas, sx, sy, patchSize, patchSize, 0, 0, patchSize * zoom, patchSize * zoom);

      // Draw center crosshair target
      const center = Math.floor(patchSize / 2) * zoom;
      magCtx.strokeStyle = "#ffffff";
      magCtx.lineWidth = 1.5;
      magCtx.strokeRect(center, center, zoom, zoom);
      magCtx.strokeStyle = "#000000";
      magCtx.lineWidth = 0.75;
      magCtx.strokeRect(center - 1, center - 1, zoom + 2, zoom + 2);
    });

    canvas.addEventListener("mouseleave", () => {
      magnifier.classList.add("hidden");
    });

    canvas.addEventListener("click", (e) => {
      const pixel = getPixelColorAt(e);
      if (pixel) {
        setSelectedColor(pixel.r, pixel.g, pixel.b);
      }
    });

    // Touch support for mobile devices
    canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const pixel = getPixelColorAt(touch);
        if (pixel) {
          setSelectedColor(pixel.r, pixel.g, pixel.b);
        }
      }
    }, { passive: true });
  }

  // --- Copy Handlers ---
  function setupCopyButton(btn, textGetter) {
    if (!btn) return;
    btn.addEventListener("click", () => {
      const val = textGetter();
      if (!val) return;
      navigator.clipboard.writeText(val).then(() => {
        const originalText = btn.textContent;
        btn.textContent = "Copied!";
        btn.classList.add("btn-accent");
        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove("btn-accent");
        }, 1500);
      });
    });
  }

  setupCopyButton(btnCopyHex, () => hexVal ? hexVal.textContent : "");
  setupCopyButton(btnCopyRgb, () => rgbVal ? rgbVal.textContent : "");
  setupCopyButton(btnCopyHsl, () => hslVal ? hslVal.textContent : "");

  // --- File Upload / Drag & Drop / Clipboard Handlers ---
  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      loadImage(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    });
  }

  if (btnUpload && fileInput) {
    btnUpload.addEventListener("click", () => fileInput.click());
  }

  if (btnSample) {
    btnSample.addEventListener("click", () => {
      loadImage(createSampleImage());
    });
  }

  if (dropZone) {
    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.style.borderColor = "var(--color-accent)";
      dropZone.style.backgroundColor = "rgba(5, 150, 105, 0.08)";
    });

    dropZone.addEventListener("dragleave", (e) => {
      e.preventDefault();
      dropZone.style.borderColor = "var(--color-border)";
      dropZone.style.backgroundColor = "transparent";
    });

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.style.borderColor = "var(--color-border)";
      dropZone.style.backgroundColor = "transparent";
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    });
  }

  // Paste image from clipboard
  window.addEventListener("paste", (e) => {
    if (e.clipboardData && e.clipboardData.items) {
      for (let i = 0; i < e.clipboardData.items.length; i++) {
        const item = e.clipboardData.items[i];
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          handleFile(file);
          break;
        }
      }
    }
  });

  // Automatically load sample image on start so the tool is instantly interactive
  loadImage(createSampleImage());
});
