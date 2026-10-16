/**
 * percentage-calculator.js
 * Implements percentage calculations. Runs computations on local input events
 * and updates output cards instantly.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Tabs
  const tabDiscount = document.getElementById("pct-tab-discount");
  const tabChange = document.getElementById("pct-tab-change");
  const tabDiff = document.getElementById("pct-tab-diff");
  const tabReverse = document.getElementById("pct-tab-reverse");

  // Form blocks
  const formDiscount = document.getElementById("pct-form-discount");
  const formChange = document.getElementById("pct-form-change");
  const formDiff = document.getElementById("pct-form-diff");
  const formReverse = document.getElementById("pct-form-reverse");

  // Inputs
  // Discount
  const discPrice = document.getElementById("disc-price");
  const discPercent = document.getElementById("disc-percent");
  // Change
  const changeV1 = document.getElementById("change-v1");
  const changeV2 = document.getElementById("change-v2");
  // Difference
  const diffV1 = document.getElementById("diff-v1");
  const diffV2 = document.getElementById("diff-v2");
  // Reverse
  const revVal = document.getElementById("rev-val");
  const revPercent = document.getElementById("rev-percent");
  const revType = document.getElementById("rev-type");

  // Outputs
  const discValSale = document.getElementById("disc-val-sale");
  const discValSave = document.getElementById("disc-val-save");
  const changeValShift = document.getElementById("change-val-shift");
  const diffValResult = document.getElementById("diff-val-result");
  const revValBase = document.getElementById("rev-val-base");

  // Tab mappings for iteration
  const tabMap = [
    { name: "discount", tab: tabDiscount, form: formDiscount },
    { name: "change", tab: tabChange, form: formChange },
    { name: "diff", tab: tabDiff, form: formDiff },
    { name: "reverse", tab: tabReverse, form: formReverse }
  ];

  // --- EVENTS ---

  tabMap.forEach(item => {
    item.tab.addEventListener("click", () => {
      switchTab(item.name);
    });
  });

  // Bind input recalculation events
  const allInputs = [
    discPrice, discPercent,
    changeV1, changeV2,
    diffV1, diffV2,
    revVal, revPercent, revType
  ];
  allInputs.forEach(input => {
    if (input) {
      input.addEventListener("input", runCalculations);
    }
  });

  // Select box change trigger
  revType.addEventListener("change", runCalculations);

  // --- ACTIONS ---

  function switchTab(tabName) {
    tabMap.forEach(item => {
      if (item.name === tabName) {
        item.tab.classList.add("active");
        item.form.classList.remove("hidden");
      } else {
        item.tab.classList.remove("active");
        item.form.classList.add("hidden");
      }
    });
  }

  function formatCurrency(num) {
    if (isNaN(num) || !isFinite(num)) return "$0.00";
    return "$" + parseFloat(num).toFixed(2);
  }

  function formatPercent(num) {
    if (isNaN(num) || !isFinite(num)) return "0.00%";
    return parseFloat(num).toFixed(2) + "%";
  }

  function runCalculations() {
    // 1. Discount calculations
    const price = parseFloat(discPrice.value);
    const dPercent = parseFloat(discPercent.value);
    if (!isNaN(price) && !isNaN(dPercent) && dPercent >= 0) {
      const save = price * (dPercent / 100);
      const sale = price - save;
      discValSale.textContent = formatCurrency(sale);
      discValSave.textContent = formatCurrency(save);
    } else {
      discValSale.textContent = "$0.00";
      discValSave.textContent = "$0.00";
    }

    // 2. Change (Increase/Decrease) calculations
    const v1 = parseFloat(changeV1.value);
    const v2 = parseFloat(changeV2.value);
    if (!isNaN(v1) && !isNaN(v2) && v1 !== 0) {
      const shift = ((v2 - v1) / v1) * 100;
      const prefix = shift > 0 ? "+" : "";
      changeValShift.textContent = prefix + formatPercent(shift);
      
      // Color-coding shift results for high quality visual aesthetics
      if (shift > 0) {
        changeValShift.style.color = "var(--color-accent-hover)";
      } else if (shift < 0) {
        changeValShift.style.color = "#EF4444";
      } else {
        changeValShift.style.color = "var(--color-text-primary)";
      }
    } else {
      changeValShift.textContent = "0.00%";
      changeValShift.style.color = "var(--color-text-muted)";
    }

    // 3. Difference calculations
    const dv1 = parseFloat(diffV1.value);
    const dv2 = parseFloat(diffV2.value);
    if (!isNaN(dv1) && !isNaN(dv2)) {
      const average = (dv1 + dv2) / 2;
      if (average !== 0) {
        const difference = (Math.abs(dv1 - dv2) / average) * 100;
        diffValResult.textContent = formatPercent(difference);
      } else {
        diffValResult.textContent = "0.00%";
      }
    } else {
      diffValResult.textContent = "0.00%";
    }

    // 4. Reverse percentage calculations
    const rVal = parseFloat(revVal.value);
    const rPercent = parseFloat(revPercent.value);
    const rType = revType.value;
    if (!isNaN(rVal) && !isNaN(rPercent)) {
      let base = 0;
      if (rType === "discount") {
        // Value is after discount (e.g. paid 80% if 20% off)
        const remainder = 1 - (rPercent / 100);
        if (remainder !== 0) {
          base = rVal / remainder;
        }
      } else {
        // Value is after mark up (e.g. paid 120% if 20% markup)
        const total = 1 + (rPercent / 100);
        if (total !== 0) {
          base = rVal / total;
        }
      }
      revValBase.textContent = formatCurrency(base);
    } else {
      revValBase.textContent = "$0.00";
    }
  }

  // Pre-fill fields with demo data on load so users see outputs instantly
  discPrice.value = "100";
  discPercent.value = "20";
  changeV1.value = "50";
  changeV2.value = "75";
  diffV1.value = "40";
  diffV2.value = "60";
  revVal.value = "80";
  revPercent.value = "20";

  // Run on start
  runCalculations();
});
