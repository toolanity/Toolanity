/**
 * bmi-calculator.js
 * Toolanity - Standard BMI, Reverse BMI, Amputee-Adjusted BMI & Dog BMI Calculator
 * 100% client-side calculation in memory. Informational only.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Mode Tabs
  const tabStandard = document.getElementById("tab-standard");
  const tabReverse = document.getElementById("tab-reverse");
  const tabAmputee = document.getElementById("tab-amputee");
  const tabPet = document.getElementById("tab-pet");

  const panelStandard = document.getElementById("panel-standard");
  const panelReverse = document.getElementById("panel-reverse");
  const panelAmputee = document.getElementById("panel-amputee");
  const panelPet = document.getElementById("panel-pet");

  // Tab switching
  const tabs = [
    { btn: tabStandard, panel: panelStandard },
    { btn: tabReverse, panel: panelReverse },
    { btn: tabAmputee, panel: panelAmputee },
    { btn: tabPet, panel: panelPet }
  ];

  tabs.forEach(t => {
    if (t.btn && t.panel) {
      t.btn.addEventListener("click", () => {
        tabs.forEach(x => {
          x.btn.classList.remove("active");
          x.panel.classList.add("hidden");
        });
        t.btn.classList.add("active");
        t.panel.classList.remove("hidden");
      });
    }
  });

  // ==========================================
  // TAB 1: STANDARD BMI
  // ==========================================
  const stdUnitMetric = document.getElementById("std-unit-metric");
  const stdUnitImperial = document.getElementById("std-unit-imperial");
  const stdHeightMetricGroup = document.getElementById("std-height-metric-group");
  const stdHeightImperialGroup = document.getElementById("std-height-imperial-group");
  const stdWeightLabel = document.getElementById("std-weight-label");

  const stdHeightCm = document.getElementById("std-height-cm");
  const stdHeightFt = document.getElementById("std-height-ft");
  const stdHeightIn = document.getElementById("std-height-in");
  const stdWeight = document.getElementById("std-weight");

  const stdBmiVal = document.getElementById("std-bmi-val");
  const stdCategoryBadge = document.getElementById("std-category-badge");
  const stdHealthyRange = document.getElementById("std-healthy-range");
  const stdLeanMassVal = document.getElementById("std-lean-mass-val");

  function getStandardHeightMeters() {
    if (stdUnitMetric.checked) {
      const cm = parseFloat(stdHeightCm.value) || 0;
      return cm / 100;
    } else {
      const ft = parseFloat(stdHeightFt.value) || 0;
      const inch = parseFloat(stdHeightIn.value) || 0;
      const totalInches = ft * 12 + inch;
      return totalInches * 0.0254;
    }
  }

  function getStandardWeightKg() {
    const raw = parseFloat(stdWeight.value) || 0;
    if (stdUnitMetric.checked) {
      return raw;
    } else {
      return raw * 0.45359237;
    }
  }

  function getBmiCategory(bmi) {
    if (bmi < 18.5) return { name: "Underweight", color: "#3b82f6" };
    if (bmi < 25.0) return { name: "Normal weight", color: "#10b981" };
    if (bmi < 30.0) return { name: "Overweight", color: "#f59e0b" };
    if (bmi < 35.0) return { name: "Obese (Class I)", color: "#f97316" };
    if (bmi < 40.0) return { name: "Obese (Class II)", color: "#ef4444" };
    return { name: "Obese (Class III)", color: "#b91c1c" };
  }

  function calculateStandardBmi() {
    const heightM = getStandardHeightMeters();
    const weightKg = getStandardWeightKg();

    if (heightM <= 0 || weightKg <= 0) {
      if (stdBmiVal) stdBmiVal.textContent = "--";
      if (stdCategoryBadge) {
        stdCategoryBadge.textContent = "Enter measurements";
        stdCategoryBadge.style.backgroundColor = "rgba(100, 116, 139, 0.15)";
        stdCategoryBadge.style.color = "var(--color-text-muted)";
      }
      if (stdHealthyRange) stdHealthyRange.textContent = "--";
      if (stdLeanMassVal) stdLeanMassVal.textContent = "--";
      return;
    }

    const bmi = weightKg / (heightM * heightM);
    const cat = getBmiCategory(bmi);

    if (stdBmiVal) stdBmiVal.textContent = bmi.toFixed(1);
    if (stdCategoryBadge) {
      stdCategoryBadge.textContent = cat.name;
      stdCategoryBadge.style.backgroundColor = cat.color + "22";
      stdCategoryBadge.style.color = cat.color;
      stdCategoryBadge.style.borderColor = cat.color;
    }

    // Healthy weight range (BMI 18.5 to 24.9)
    const minKg = 18.5 * heightM * heightM;
    const maxKg = 24.9 * heightM * heightM;

    if (stdUnitMetric.checked) {
      if (stdHealthyRange) stdHealthyRange.textContent = `${minKg.toFixed(1)} kg - ${maxKg.toFixed(1)} kg`;
    } else {
      const minLb = minKg / 0.45359237;
      const maxLb = maxKg / 0.45359237;
      if (stdHealthyRange) stdHealthyRange.textContent = `${minLb.toFixed(1)} lbs - ${maxLb.toFixed(1)} lbs`;
    }

    // Lean Body Mass estimation (Boer formula average estimate)
    // Boer Men: 0.407*W + 0.267*H - 19.2
    // Boer Women: 0.252*W + 0.473*H - 48.3
    // Combined balanced average:
    const heightCm = heightM * 100;
    const lbmKg = 0.33 * weightKg + 0.37 * heightCm - 33.7;
    const cleanLbm = Math.max(0, Math.min(weightKg * 0.95, lbmKg));

    if (stdLeanMassVal) {
      if (stdUnitMetric.checked) {
        stdLeanMassVal.textContent = `~${cleanLbm.toFixed(1)} kg (${((cleanLbm / weightKg) * 100).toFixed(0)}% LBM)`;
      } else {
        const lbmLb = cleanLbm / 0.45359237;
        const totalLb = weightKg / 0.45359237;
        stdLeanMassVal.textContent = `~${lbmLb.toFixed(1)} lbs (${((cleanLbm / weightKg) * 100).toFixed(0)}% LBM)`;
      }
    }
  }

  function handleStandardUnitToggle() {
    if (stdUnitMetric.checked) {
      stdHeightMetricGroup.classList.remove("hidden");
      stdHeightImperialGroup.classList.add("hidden");
      stdWeightLabel.textContent = "Weight (kg):";
      stdWeight.placeholder = "e.g. 70";
    } else {
      stdHeightMetricGroup.classList.add("hidden");
      stdHeightImperialGroup.classList.remove("hidden");
      stdWeightLabel.textContent = "Weight (lbs):";
      stdWeight.placeholder = "e.g. 154";
    }
    calculateStandardBmi();
  }

  if (stdUnitMetric && stdUnitImperial) {
    stdUnitMetric.addEventListener("change", handleStandardUnitToggle);
    stdUnitImperial.addEventListener("change", handleStandardUnitToggle);
  }

  [stdHeightCm, stdHeightFt, stdHeightIn, stdWeight].forEach(input => {
    if (input) input.addEventListener("input", calculateStandardBmi);
  });

  // ==========================================
  // TAB 2: REVERSE / BACKWARDS BMI
  // ==========================================
  const revUnitMetric = document.getElementById("rev-unit-metric");
  const revUnitImperial = document.getElementById("rev-unit-imperial");
  const revHeightMetricGroup = document.getElementById("rev-height-metric-group");
  const revHeightImperialGroup = document.getElementById("rev-height-imperial-group");

  const revTargetBmi = document.getElementById("rev-target-bmi");
  const revHeightCm = document.getElementById("rev-height-cm");
  const revHeightFt = document.getElementById("rev-height-ft");
  const revHeightIn = document.getElementById("rev-height-in");
  const revCurrentWeight = document.getElementById("rev-current-weight");
  const revCurrentWeightLabel = document.getElementById("rev-current-weight-label");

  const revTargetWeightVal = document.getElementById("rev-target-weight-val");
  const revDiffVal = document.getElementById("rev-diff-val");
  const revHealthyRangeVal = document.getElementById("rev-healthy-range-val");

  function getReverseHeightMeters() {
    if (revUnitMetric.checked) {
      const cm = parseFloat(revHeightCm.value) || 0;
      return cm / 100;
    } else {
      const ft = parseFloat(revHeightFt.value) || 0;
      const inch = parseFloat(revHeightIn.value) || 0;
      return (ft * 12 + inch) * 0.0254;
    }
  }

  function calculateReverseBmi() {
    const targetBmi = parseFloat(revTargetBmi.value) || 0;
    const heightM = getReverseHeightMeters();
    const currWeight = parseFloat(revCurrentWeight.value) || 0;

    if (targetBmi <= 0 || heightM <= 0) {
      if (revTargetWeightVal) revTargetWeightVal.textContent = "--";
      if (revDiffVal) revDiffVal.textContent = "--";
      if (revHealthyRangeVal) revHealthyRangeVal.textContent = "--";
      return;
    }

    // Target Weight = Target BMI * Height^2 (in kg)
    const targetKg = targetBmi * heightM * heightM;
    const minKg = 18.5 * heightM * heightM;
    const maxKg = 24.9 * heightM * heightM;

    if (revUnitMetric.checked) {
      if (revTargetWeightVal) revTargetWeightVal.textContent = `${targetKg.toFixed(1)} kg`;
      if (revHealthyRangeVal) revHealthyRangeVal.textContent = `${minKg.toFixed(1)} kg - ${maxKg.toFixed(1)} kg`;

      if (currWeight > 0) {
        const diff = targetKg - currWeight;
        const sign = diff > 0 ? "+" : "";
        if (revDiffVal) revDiffVal.textContent = `${sign}${diff.toFixed(1)} kg needed`;
      } else {
        if (revDiffVal) revDiffVal.textContent = "Enter current weight to see difference";
      }
    } else {
      const targetLb = targetKg / 0.45359237;
      const minLb = minKg / 0.45359237;
      const maxLb = maxKg / 0.45359237;

      if (revTargetWeightVal) revTargetWeightVal.textContent = `${targetLb.toFixed(1)} lbs`;
      if (revHealthyRangeVal) revHealthyRangeVal.textContent = `${minLb.toFixed(1)} lbs - ${maxLb.toFixed(1)} lbs`;

      if (currWeight > 0) {
        const diff = targetLb - currWeight;
        const sign = diff > 0 ? "+" : "";
        if (revDiffVal) revDiffVal.textContent = `${sign}${diff.toFixed(1)} lbs needed`;
      } else {
        if (revDiffVal) revDiffVal.textContent = "Enter current weight to see difference";
      }
    }
  }

  function handleReverseUnitToggle() {
    if (revUnitMetric.checked) {
      revHeightMetricGroup.classList.remove("hidden");
      revHeightImperialGroup.classList.add("hidden");
      revCurrentWeightLabel.textContent = "Current Weight (Optional, kg):";
      revCurrentWeight.placeholder = "e.g. 80";
    } else {
      revHeightMetricGroup.classList.add("hidden");
      revHeightImperialGroup.classList.remove("hidden");
      revCurrentWeightLabel.textContent = "Current Weight (Optional, lbs):";
      revCurrentWeight.placeholder = "e.g. 176";
    }
    calculateReverseBmi();
  }

  if (revUnitMetric && revUnitImperial) {
    revUnitMetric.addEventListener("change", handleReverseUnitToggle);
    revUnitImperial.addEventListener("change", handleReverseUnitToggle);
  }

  [revTargetBmi, revHeightCm, revHeightFt, revHeightIn, revCurrentWeight].forEach(input => {
    if (input) input.addEventListener("input", calculateReverseBmi);
  });

  // ==========================================
  // TAB 3: AMPUTEE-ADJUSTED BMI
  // ==========================================
  const ampHeight = document.getElementById("amp-height");
  const ampWeight = document.getElementById("amp-weight");
  const ampCheckboxes = document.querySelectorAll(".amp-limb-check");

  const ampAdjustedBmi = document.getElementById("amp-adjusted-bmi");
  const ampUnadjustedBmi = document.getElementById("amp-unadjusted-bmi");
  const ampEstimatedWeight = document.getElementById("amp-estimated-weight");
  const ampBadge = document.getElementById("amp-category-badge");

  function calculateAmputeeBmi() {
    const heightCm = parseFloat(ampHeight.value) || 0;
    const actualKg = parseFloat(ampWeight.value) || 0;

    if (heightCm <= 0 || actualKg <= 0) {
      if (ampAdjustedBmi) ampAdjustedBmi.textContent = "--";
      if (ampUnadjustedBmi) ampUnadjustedBmi.textContent = "--";
      if (ampEstimatedWeight) ampEstimatedWeight.textContent = "--";
      if (ampBadge) {
        ampBadge.textContent = "Enter measurements";
        ampBadge.style.backgroundColor = "transparent";
      }
      return;
    }

    const heightM = heightCm / 100;
    let totalLimbFraction = 0;

    ampCheckboxes.forEach(cb => {
      if (cb.checked) {
        totalLimbFraction += parseFloat(cb.getAttribute("data-pct")) || 0;
      }
    });

    // Guardrail against impossible percentage sum (e.g. > 90%)
    totalLimbFraction = Math.min(0.85, totalLimbFraction);

    // Estimated full-body weight = Actual Weight / (1 - totalLimbFraction)
    const estimatedFullWeight = actualKg / (1 - totalLimbFraction);

    // Adjusted BMI = Estimated Full Weight / (Height^2)
    const adjBmi = estimatedFullWeight / (heightM * heightM);
    const unadjBmi = actualKg / (heightM * heightM);
    const cat = getBmiCategory(adjBmi);

    if (ampAdjustedBmi) ampAdjustedBmi.textContent = adjBmi.toFixed(1);
    if (ampUnadjustedBmi) ampUnadjustedBmi.textContent = unadjBmi.toFixed(1);
    if (ampEstimatedWeight) ampEstimatedWeight.textContent = `${estimatedFullWeight.toFixed(1)} kg (${(totalLimbFraction * 100).toFixed(1)}% limb reduction)`;

    if (ampBadge) {
      ampBadge.textContent = cat.name;
      ampBadge.style.backgroundColor = cat.color + "22";
      ampBadge.style.color = cat.color;
      ampBadge.style.borderColor = cat.color;
    }
  }

  [ampHeight, ampWeight].forEach(el => {
    if (el) el.addEventListener("input", calculateAmputeeBmi);
  });
  ampCheckboxes.forEach(cb => {
    cb.addEventListener("change", calculateAmputeeBmi);
  });

  // ==========================================
  // TAB 4: PET / DOG BMI & CONDITION
  // ==========================================
  const dogSize = document.getElementById("dog-size");
  const dogWeight = document.getElementById("dog-weight");
  const dogRib = document.getElementById("dog-rib-feel");

  const dogBmiScore = document.getElementById("dog-bmi-score");
  const dogCategory = document.getElementById("dog-category");
  const dogRecommendation = document.getElementById("dog-recommendation");

  function calculateDogBmi() {
    const size = dogSize ? dogSize.value : "medium";
    const weight = parseFloat(dogWeight.value) || 0;
    const feel = dogRib ? dogRib.value : "ideal";

    if (weight <= 0) {
      if (dogBmiScore) dogBmiScore.textContent = "--";
      if (dogCategory) dogCategory.textContent = "Enter dog weight";
      if (dogRecommendation) dogRecommendation.textContent = "Select breed size and rib feel for assessment.";
      return;
    }

    // Approximate healthy weight ranges by category
    const ranges = {
      toy: { min: 2, max: 5, label: "Toy (< 5 kg)" },
      small: { min: 5, max: 11, label: "Small (5 - 11 kg)" },
      medium: { min: 11, max: 25, label: "Medium (11 - 25 kg)" },
      large: { min: 25, max: 42, label: "Large (25 - 42 kg)" },
      giant: { min: 42, max: 70, label: "Giant (42+ kg)" }
    };

    const target = ranges[size] || ranges.medium;
    let bcsScore = 5; // Ideal on 1-9 Purina scale
    let statusText = "Ideal Body Condition";
    let statusColor = "#10b981";
    let advise = `Target weight for ${target.label} dogs is typically ${target.min} to ${target.max} kg. Your dog appears within a healthy physiological range.`;

    if (feel === "too-thin") {
      bcsScore = 3;
      statusText = "Under ideal weight (BCS 3/9)";
      statusColor = "#3b82f6";
      advise = "Ribs and spine are easily visible with minimal fat covering. Consider consulting your vet to assess calorie intake and rule out parasites.";
    } else if (feel === "overweight") {
      bcsScore = 7;
      statusText = "Over ideal weight (BCS 7/9)";
      statusColor = "#f59e0b";
      advise = "Ribs are difficult to feel under heavy fat padding, and waistline is diminished. Controlled portions and active walks are recommended.";
    } else if (feel === "obese") {
      bcsScore = 9;
      statusText = "Significantly overweight (BCS 9/9)";
      statusColor = "#ef4444";
      advise = "Heavy fat deposits over spine and base of tail. Excess weight strains canine joints and cardiovascular health. Consult your veterinarian for a structured weight management diet.";
    }

    if (dogBmiScore) dogBmiScore.textContent = `${bcsScore} / 9`;
    if (dogCategory) {
      dogCategory.textContent = statusText;
      dogCategory.style.color = statusColor;
    }
    if (dogRecommendation) dogRecommendation.textContent = advise;
  }

  [dogSize, dogWeight, dogRib].forEach(el => {
    if (el) el.addEventListener("change", calculateDogBmi);
    if (el) el.addEventListener("input", calculateDogBmi);
  });

  // Run initial calculations
  calculateStandardBmi();
  calculateReverseBmi();
  calculateAmputeeBmi();
  calculateDogBmi();
});
