/**
 * json-formatter.js
 * Toolanity - JSON Formatter, Validator, Minifier, Tree Viewer & CSV-to-JSON Converter
 * 100% client-side execution in memory.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Tabs
  const tabFormat = document.getElementById("tab-format");
  const tabCsv = document.getElementById("tab-csv");
  const panelFormat = document.getElementById("panel-format");
  const panelCsv = document.getElementById("panel-csv");

  // Format tab controls
  const jsonInput = document.getElementById("json-input");
  const jsonOutput = document.getElementById("json-output");
  const treeContainer = document.getElementById("json-tree-container");
  const viewCodeBtn = document.getElementById("view-code-btn");
  const viewTreeBtn = document.getElementById("view-tree-btn");
  const btnBeautify = document.getElementById("btn-beautify");
  const btnMinify = document.getElementById("btn-minify");
  const btnClear = document.getElementById("btn-clear");
  const btnSample = document.getElementById("btn-sample");
  const btnCopy = document.getElementById("btn-copy");
  const copyFeedback = document.getElementById("copy-feedback");
  const indentSelect = document.getElementById("indent-select");
  const statusBadge = document.getElementById("json-status-badge");
  const errorAlert = document.getElementById("json-error-alert");
  const errorMessage = document.getElementById("json-error-message");
  const statSize = document.getElementById("stat-size");
  const statLines = document.getElementById("stat-lines");

  // CSV tab controls
  const csvInput = document.getElementById("csv-input");
  const csvOutput = document.getElementById("csv-output");
  const csvDelimiter = document.getElementById("csv-delimiter");
  const csvHeadersCheck = document.getElementById("csv-headers-check");
  const btnConvertCsv = document.getElementById("btn-convert-csv");
  const btnClearCsv = document.getElementById("btn-clear-csv");
  const btnSampleCsv = document.getElementById("btn-sample-csv");
  const btnCopyCsv = document.getElementById("btn-copy-csv");
  const copyCsvFeedback = document.getElementById("copy-csv-feedback");

  let currentView = "code"; // "code" or "tree"
  let parsedJsonCache = null;

  // --- Sample JSON ---
  const sampleJsonObj = {
    site: "Toolanity",
    type: "Browser Utility Suite",
    privacy: "100% Client-Side",
    features: [
      { id: 1, name: "JSON Formatter", active: true },
      { id: 2, name: "Case Converter", active: true },
      { id: 3, name: "Color Picker", active: true },
      { id: 4, name: "BMI Calculator", active: true },
      { id: 5, name: "Unit Converter", active: true }
    ],
    metadata: {
      version: "2.0.0",
      totalTools: 10,
      openSourceLibs: ["QRious"],
      performance: {
        latencyMs: 0,
        serverUploads: false
      }
    }
  };

  const sampleCsvText = `id,name,role,department,salary
101,Sarah Connor,Security Lead,Operations,95000
102,John Doe,Senior Architect,Engineering,120000
103,Jane Miller,Product Designer,UX Studio,88000
104,Alex Chen,Data Analyst,Business Intelligence,92000`;

  // --- Tab Switching ---
  if (tabFormat && tabCsv) {
    tabFormat.addEventListener("click", () => {
      tabFormat.classList.add("active");
      tabCsv.classList.remove("active");
      panelFormat.classList.remove("hidden");
      panelCsv.classList.add("hidden");
    });

    tabCsv.addEventListener("click", () => {
      tabCsv.classList.add("active");
      tabFormat.classList.remove("active");
      panelCsv.classList.remove("hidden");
      panelFormat.classList.add("hidden");
    });
  }

  // --- View Mode Toggle (Code vs Tree) ---
  if (viewCodeBtn && viewTreeBtn) {
    viewCodeBtn.addEventListener("click", () => {
      currentView = "code";
      viewCodeBtn.classList.add("btn-primary");
      viewCodeBtn.classList.remove("btn-secondary");
      viewTreeBtn.classList.add("btn-secondary");
      viewTreeBtn.classList.remove("btn-primary");
      jsonOutput.classList.remove("hidden");
      treeContainer.classList.add("hidden");
    });

    viewTreeBtn.addEventListener("click", () => {
      currentView = "tree";
      viewTreeBtn.classList.add("btn-primary");
      viewTreeBtn.classList.remove("btn-secondary");
      viewCodeBtn.classList.add("btn-secondary");
      viewCodeBtn.classList.remove("btn-primary");
      jsonOutput.classList.add("hidden");
      treeContainer.classList.remove("hidden");
      renderTree();
    });
  }

  // --- Parsing and Formatting Logic ---
  function getIndent() {
    const val = indentSelect ? indentSelect.value : "2";
    if (val === "tab") return "\t";
    return parseInt(val, 10) || 2;
  }

  function formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    if (bytes < 1024) return bytes + " B";
    return (bytes / 1024).toFixed(1) + " KB";
  }

  function validateAndFormat(minify = false) {
    const raw = jsonInput.value.trim();
    if (!raw) {
      if (jsonOutput) jsonOutput.value = "";
      if (treeContainer) treeContainer.innerHTML = '<div style="color:var(--color-text-muted);font-style:italic;">Enter valid JSON to view interactive tree...</div>';
      if (statusBadge) {
        statusBadge.textContent = "Waiting for input";
        statusBadge.className = "badge";
      }
      if (errorAlert) errorAlert.classList.add("hidden");
      if (statSize) statSize.textContent = "0 B";
      if (statLines) statLines.textContent = "0";
      parsedJsonCache = null;
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      parsedJsonCache = parsed;

      // Status
      if (statusBadge) {
        statusBadge.textContent = "Valid JSON";
        statusBadge.className = "badge badge-premium";
      }
      if (errorAlert) errorAlert.classList.add("hidden");

      let formatted = "";
      if (minify) {
        formatted = JSON.stringify(parsed);
      } else {
        formatted = JSON.stringify(parsed, null, getIndent());
      }

      if (jsonOutput) jsonOutput.value = formatted;

      // Stats
      const bytes = new Blob([formatted]).size;
      const lines = formatted.split("\n").length;
      if (statSize) statSize.textContent = formatBytes(bytes);
      if (statLines) statLines.textContent = lines.toString();

      if (currentView === "tree") {
        renderTree();
      }
    } catch (err) {
      parsedJsonCache = null;
      if (statusBadge) {
        statusBadge.textContent = "Invalid JSON";
        statusBadge.className = "badge";
        statusBadge.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
        statusBadge.style.color = "#ef4444";
        statusBadge.style.borderColor = "#ef4444";
      }

      // Extract line and column numbers from error if available
      let detailedMsg = err.message;
      const posMatch = detailedMsg.match(/at position (\d+)/i);
      if (posMatch) {
        const pos = parseInt(posMatch[1], 10);
        const sub = raw.substring(0, pos);
        const line = sub.split("\n").length;
        const col = pos - sub.lastIndexOf("\n");
        detailedMsg += ` (Line ${line}, Column ${col})`;
      }

      if (errorAlert && errorMessage) {
        errorMessage.textContent = detailedMsg;
        errorAlert.classList.remove("hidden");
      }

      if (jsonOutput) jsonOutput.value = "";
      if (treeContainer) {
        treeContainer.innerHTML = `<div style="color:#ef4444;font-size:0.9rem;">⚠️ Cannot render tree: ${detailedMsg}</div>`;
      }
    }
  }

  // --- Interactive Tree View Builder ---
  function renderTree() {
    if (!treeContainer) return;
    if (!parsedJsonCache) {
      treeContainer.innerHTML = '<div style="color:var(--color-text-muted);font-style:italic;">Enter valid JSON to view interactive tree...</div>';
      return;
    }

    treeContainer.innerHTML = "";
    const rootEl = createTreeNode("root", parsedJsonCache, true);
    treeContainer.appendChild(rootEl);
  }

  function createTreeNode(key, value, isRoot = false) {
    const item = document.createElement("div");
    item.className = "tree-node";
    item.style.paddingLeft = isRoot ? "0" : "1.25rem";
    item.style.fontFamily = "monospace";
    item.style.fontSize = "0.9rem";
    item.style.lineHeight = "1.5";

    const isObject = value !== null && typeof value === "object" && !Array.isArray(value);
    const isArray = Array.isArray(value);

    if (isObject || isArray) {
      const toggle = document.createElement("span");
      toggle.className = "tree-toggle";
      toggle.style.cursor = "pointer";
      toggle.style.userSelect = "none";
      toggle.style.fontWeight = "bold";
      toggle.style.color = "var(--color-accent)";
      toggle.style.marginRight = "0.35rem";
      toggle.textContent = "▼ ";

      const keySpan = document.createElement("span");
      keySpan.style.color = "var(--color-text-primary)";
      keySpan.style.fontWeight = "600";
      keySpan.textContent = isRoot ? (isArray ? `Array [${value.length}]` : `Object {${Object.keys(value).length}}`) : `${key}: ${isArray ? `[${value.length}]` : `{${Object.keys(value).length}}`}`;

      const childrenContainer = document.createElement("div");
      childrenContainer.className = "tree-children";

      const entries = isArray ? value.entries() : Object.entries(value);
      for (const [k, v] of entries) {
        childrenContainer.appendChild(createTreeNode(k, v));
      }

      toggle.addEventListener("click", () => {
        if (childrenContainer.style.display === "none") {
          childrenContainer.style.display = "block";
          toggle.textContent = "▼ ";
        } else {
          childrenContainer.style.display = "none";
          toggle.textContent = "▶ ";
        }
      });

      item.appendChild(toggle);
      item.appendChild(keySpan);
      item.appendChild(childrenContainer);
    } else {
      const line = document.createElement("span");
      let valColor = "#10b981"; // string
      let valDisplay = JSON.stringify(value);

      if (typeof value === "number") {
        valColor = "#3b82f6";
      } else if (typeof value === "boolean") {
        valColor = "#f59e0b";
      } else if (value === null) {
        valColor = "#9ca3af";
        valDisplay = "null";
      }

      line.innerHTML = `<span style="color:var(--color-text-muted);font-weight:600;">${key}</span>: <span style="color:${valColor};">${valDisplay}</span>`;
      item.appendChild(line);
    }

    return item;
  }

  // --- CSV to JSON Converter Logic ---
  function parseCsvLine(line, delimiter) {
    const pattern = new RegExp(
      (
        "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
        '(?:"([^"]*(?:""[^"]*)*)"|' +
        '([^"\\' + delimiter + "\\r\\n]*))"
      ),
      "gi"
    );

    const result = [];
    let match = null;

    while ((match = pattern.exec(line))) {
      const matchedDelimiter = match[1];
      if (matchedDelimiter.length && matchedDelimiter !== delimiter) {
        // newline boundary
      }

      let matchedValue = "";
      if (match[2]) {
        matchedValue = match[2].replace(new RegExp('""', "g"), '"');
      } else if (match[3]) {
        matchedValue = match[3];
      }

      result.push(matchedValue.trim());
    }

    return result;
  }

  function convertCsvToJson() {
    const raw = csvInput.value.trim();
    if (!raw) {
      csvOutput.value = "";
      return;
    }

    let delim = csvDelimiter ? csvDelimiter.value : ",";
    if (delim === "\\t") delim = "\t";

    const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) {
      csvOutput.value = "[]";
      return;
    }

    const hasHeaders = csvHeadersCheck ? csvHeadersCheck.checked : true;

    if (hasHeaders) {
      const headers = parseCsvLine(lines[0], delim);
      const jsonArr = [];

      for (let i = 1; i < lines.length; i++) {
        const row = parseCsvLine(lines[i], delim);
        const obj = {};
        headers.forEach((h, idx) => {
          let val = row[idx] !== undefined ? row[idx] : "";
          // Check for auto-numeric conversion
          if (val !== "" && !isNaN(val) && !isNaN(parseFloat(val))) {
            val = Number(val);
          } else if (val.toLowerCase() === "true") {
            val = true;
          } else if (val.toLowerCase() === "false") {
            val = false;
          }
          obj[h || `column_${idx + 1}`] = val;
        });
        jsonArr.push(obj);
      }

      csvOutput.value = JSON.stringify(jsonArr, null, 2);
    } else {
      const rows = lines.map(line => parseCsvLine(line, delim));
      csvOutput.value = JSON.stringify(rows, null, 2);
    }
  }

  // --- Event Listeners ---
  if (jsonInput) {
    jsonInput.addEventListener("input", () => validateAndFormat(false));
  }

  if (indentSelect) {
    indentSelect.addEventListener("change", () => validateAndFormat(false));
  }

  if (btnBeautify) {
    btnBeautify.addEventListener("click", () => validateAndFormat(false));
  }

  if (btnMinify) {
    btnMinify.addEventListener("click", () => validateAndFormat(true));
  }

  if (btnClear) {
    btnClear.addEventListener("click", () => {
      jsonInput.value = "";
      validateAndFormat();
      jsonInput.focus();
    });
  }

  if (btnSample) {
    btnSample.addEventListener("click", () => {
      jsonInput.value = JSON.stringify(sampleJsonObj);
      validateAndFormat(false);
    });
  }

  if (btnCopy && jsonOutput) {
    btnCopy.addEventListener("click", () => {
      if (!jsonOutput.value) return;
      navigator.clipboard.writeText(jsonOutput.value).then(() => {
        if (copyFeedback) {
          copyFeedback.classList.remove("hidden");
          setTimeout(() => copyFeedback.classList.add("hidden"), 2000);
        }
      });
    });
  }

  if (btnConvertCsv) {
    btnConvertCsv.addEventListener("click", convertCsvToJson);
  }

  if (btnClearCsv) {
    btnClearCsv.addEventListener("click", () => {
      csvInput.value = "";
      csvOutput.value = "";
      csvInput.focus();
    });
  }

  if (btnSampleCsv) {
    btnSampleCsv.addEventListener("click", () => {
      csvInput.value = sampleCsvText;
      convertCsvToJson();
    });
  }

  if (btnCopyCsv && csvOutput) {
    btnCopyCsv.addEventListener("click", () => {
      if (!csvOutput.value) return;
      navigator.clipboard.writeText(csvOutput.value).then(() => {
        if (copyCsvFeedback) {
          copyCsvFeedback.classList.remove("hidden");
          setTimeout(() => copyCsvFeedback.classList.add("hidden"), 2000);
        }
      });
    });
  }
});
