/**
 * age-calculator.js
 * Implements age math including Gregorian calendars shifts, leap year dates,
 * timeline calculations, and premature birth corrected ages.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Tabs
  const tabChrono = document.getElementById("age-tab-chrono");
  const tabDiff = document.getElementById("age-tab-diff");
  const tabBaby = document.getElementById("age-tab-baby");

  // Forms
  const formChrono = document.getElementById("age-form-chrono");
  const formDiff = document.getElementById("age-form-diff");
  const formBaby = document.getElementById("age-form-baby");

  // Details Results Panels
  const detailsChrono = document.getElementById("details-chrono");
  const detailsDiff = document.getElementById("details-diff");
  const detailsBaby = document.getElementById("details-baby");

  // Inputs
  const chronoDob = document.getElementById("chrono-dob");
  const chronoAsOf = document.getElementById("chrono-asof");
  const diffDob1 = document.getElementById("diff-dob1");
  const diffDob2 = document.getElementById("diff-dob2");
  const babyDob = document.getElementById("baby-dob");
  const babyDue = document.getElementById("baby-due");

  // Buttons and Output Texts
  const calculateBtn = document.getElementById("calculate-age-btn");
  const primaryResult = document.getElementById("age-result-primary");

  // Chrono Outputs
  const valYears = document.getElementById("val-years");
  const valMonths = document.getElementById("val-months");
  const valDays = document.getElementById("val-days");
  const valCountdown = document.getElementById("val-countdown");
  const factMonths = document.getElementById("fact-months");
  const factWeeks = document.getElementById("fact-weeks");
  const factDays = document.getElementById("fact-days");
  const factHours = document.getElementById("fact-hours");

  // Difference Outputs
  const diffP1Summary = document.getElementById("diff-p1-summary");
  const diffP2Summary = document.getElementById("diff-p2-summary");
  const diffGapSummary = document.getElementById("diff-gap-summary");

  // Baby Outputs
  const babyChronoVal = document.getElementById("baby-chrono-val");
  const babyPrematureVal = document.getElementById("baby-premature-val");
  const babyCorrectedVal = document.getElementById("baby-corrected-val");

  let activeMode = "chrono"; // chrono, diff, baby

  // Set default dates
  const todayStr = getTodayString();
  chronoAsOf.value = todayStr;
  chronoDob.value = "1995-06-15"; // Sample date
  diffDob1.value = "1990-03-10";
  diffDob2.value = "1994-08-25";
  
  // Set default premature DOB (e.g. 2 months ago) and Due Date (e.g. 1.5 months ago)
  const defaultBabyDob = new Date();
  defaultBabyDob.setMonth(defaultBabyDob.getMonth() - 2);
  const defaultBabyDue = new Date(defaultBabyDob);
  defaultBabyDue.setDate(defaultBabyDue.getDate() + 35); // born 5 weeks early
  babyDob.value = formatDate(defaultBabyDob);
  babyDue.value = formatDate(defaultBabyDue);

  // --- EVENTS ---

  tabChrono.addEventListener("click", () => switchMode("chrono"));
  tabDiff.addEventListener("click", () => switchMode("diff"));
  tabBaby.addEventListener("click", () => switchMode("baby"));

  calculateBtn.addEventListener("click", performCalculations);

  // --- ACTIONS ---

  function switchMode(mode) {
    activeMode = mode;
    
    // Toggle active tab buttons
    [tabChrono, tabDiff, tabBaby].forEach(tab => tab.classList.remove("active"));
    [formChrono, formDiff, formBaby].forEach(form => form.classList.add("hidden"));
    [detailsChrono, detailsDiff, detailsBaby].forEach(det => det.classList.add("hidden"));

    primaryResult.textContent = "Click Calculate to display results.";

    if (mode === "chrono") {
      tabChrono.classList.add("active");
      formChrono.classList.remove("hidden");
    } else if (mode === "diff") {
      tabDiff.classList.add("active");
      formDiff.classList.remove("hidden");
    } else if (mode === "baby") {
      tabBaby.classList.add("active");
      formBaby.classList.remove("hidden");
    }
  }

  function getTodayString() {
    const d = new Date();
    return formatDate(d);
  }

  function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  // Core chronological difference calculator (accurate calendar months borrowing)
  function calculateDifference(startDate, endDate) {
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    if (days < 0) {
      // Find the last day of the previous month
      const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }

    if (months < 0) {
      months += 12;
      years--;
    }

    return { years, months, days };
  }

  function getNextBirthdayDays(dob, asOf) {
    const nextBday = new Date(asOf.getFullYear(), dob.getMonth(), dob.getDate());
    
    // If birthday has passed this year, set to next year
    if (nextBday < asOf) {
      nextBday.setFullYear(asOf.getFullYear() + 1);
    }
    
    const diffTime = nextBday - asOf;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // If today is their birthday, days countdown is 0
    return diffDays === 365 || diffDays === 366 ? 0 : diffDays;
  }

  function formatTimePeriod(weeks, days) {
    let wText = weeks === 1 ? "week" : "weeks";
    let dText = days === 1 ? "day" : "days";
    return `${weeks} ${wText}, ${days} ${dText}`;
  }

  function performCalculations() {
    if (activeMode === "chrono") {
      const dobVal = chronoDob.value;
      const asOfVal = chronoAsOf.value;

      if (!dobVal || !asOfVal) {
        primaryResult.textContent = "Please fill in both date inputs.";
        return;
      }

      const dob = new Date(dobVal);
      const asOf = new Date(asOfVal);

      if (dob > asOf) {
        primaryResult.textContent = "Error: Date of Birth cannot be after the 'Age as of' date.";
        return;
      }

      const diff = calculateDifference(dob, asOf);
      
      // Countdown
      const daysToBday = getNextBirthdayDays(dob, asOf);
      let bdayStr = "";
      if (daysToBday === 0) {
        bdayStr = "🎉 Happy Birthday!";
      } else {
        bdayStr = `${daysToBday} days`;
      }

      // Timeline Facts
      const totalMs = asOf - dob;
      const totalDaysVal = Math.floor(totalMs / (1000 * 60 * 60 * 24));
      const totalWeeksVal = Math.floor(totalDaysVal / 7);
      const totalMonthsVal = (diff.years * 12) + diff.months;
      const totalHoursVal = totalDaysVal * 24;

      // Populate UI Chrono
      primaryResult.innerHTML = `You are <span style="color: var(--color-accent-hover);">${diff.years} years</span>, ${diff.months} months, and ${diff.days} days old`;
      valYears.textContent = diff.years;
      valMonths.textContent = diff.months;
      valDays.textContent = diff.days;
      valCountdown.textContent = bdayStr;

      factMonths.textContent = totalMonthsVal.toLocaleString();
      factWeeks.textContent = totalWeeksVal.toLocaleString();
      factDays.textContent = totalDaysVal.toLocaleString();
      factHours.textContent = totalHoursVal.toLocaleString();

      detailsChrono.classList.remove("hidden");
      detailsDiff.classList.add("hidden");
      detailsBaby.classList.add("hidden");
    } 
    else if (activeMode === "diff") {
      const p1Val = diffDob1.value;
      const p2Val = diffDob2.value;

      if (!p1Val || !p2Val) {
        primaryResult.textContent = "Please fill in both birthdates.";
        return;
      }

      const d1 = new Date(p1Val);
      const d2 = new Date(p2Val);
      const today = new Date();

      const diff1 = calculateDifference(d1, today);
      const diff2 = calculateDifference(d2, today);

      let older, younger, gap;
      let label = "";

      if (d1.getTime() === d2.getTime()) {
        primaryResult.textContent = "Both individuals are exactly the same age!";
        diffP1Summary.innerHTML = `Person 1: <strong>${diff1.years} years old</strong>`;
        diffP2Summary.innerHTML = `Person 2: <strong>${diff2.years} years old</strong>`;
        diffGapSummary.textContent = "Age difference is 0 days.";
      } else {
        if (d1 < d2) {
          older = "Person 1";
          younger = "Person 2";
          gap = calculateDifference(d1, d2);
        } else {
          older = "Person 2";
          younger = "Person 1";
          gap = calculateDifference(d2, d1);
        }

        primaryResult.innerHTML = `${older} is older than ${younger}`;
        diffP1Summary.innerHTML = `Person 1 (Birthdate: ${p1Val}): <strong>${diff1.years}y, ${diff1.months}m, ${diff1.days}d</strong>`;
        diffP2Summary.innerHTML = `Person 2 (Birthdate: ${p2Val}): <strong>${diff2.years}y, ${diff2.months}m, ${diff2.days}d</strong>`;
        
        diffGapSummary.innerHTML = `Age Gap: <span style="color: var(--color-accent-hover); font-size: 1.1rem;">${gap.years} years, ${gap.months} months, and ${gap.days} days</span>`;
      }

      detailsChrono.classList.add("hidden");
      detailsDiff.classList.remove("hidden");
      detailsBaby.classList.add("hidden");
    } 
    else if (activeMode === "baby") {
      const dobVal = babyDob.value;
      const dueVal = babyDue.value;

      if (!dobVal || !dueVal) {
        primaryResult.textContent = "Please fill in both Date of Birth and Expected Due Date.";
        return;
      }

      const dob = new Date(dobVal);
      const due = new Date(dueVal);
      const today = new Date();

      if (dob > today) {
        primaryResult.textContent = "Error: Date of Birth cannot be in the future.";
        return;
      }

      // Chronological age in days and weeks
      const chronoMs = today - dob;
      const chronoDays = Math.floor(chronoMs / (1000 * 60 * 60 * 24));
      const chronoWeeks = Math.floor(chronoDays / 7);
      const chronoRemainingDays = chronoDays % 7;

      // Premature delta (expected due date - actual birth date)
      const prematureMs = due - dob;
      const prematureDays = Math.floor(prematureMs / (1000 * 60 * 60 * 24));
      const prematureWeeks = Math.floor(prematureDays / 7);
      const prematureRemainingDays = prematureDays % 7;

      // Corrected Age (current date - expected due date)
      const correctedMs = today - due;
      let correctedStr = "";

      if (correctedMs < 0) {
        // Baby has not reached full expected term date yet
        correctedStr = "Not yet reached expected full-term date";
      } else {
        const correctedDays = Math.floor(correctedMs / (1000 * 60 * 60 * 24));
        const correctedWeeks = Math.floor(correctedDays / 7);
        const correctedRemainingDays = correctedDays % 7;
        correctedStr = formatTimePeriod(correctedWeeks, correctedRemainingDays);
      }

      // Determine text summaries
      babyChronoVal.textContent = formatTimePeriod(chronoWeeks, chronoRemainingDays) + ` (${chronoDays} total days)`;
      
      if (prematureDays <= 0) {
        babyPrematureVal.textContent = "0 weeks (Full term or post-term birth)";
        babyCorrectedVal.textContent = formatTimePeriod(chronoWeeks, chronoRemainingDays) + " (Same as Chronological)";
        primaryResult.innerHTML = `Corrected Age matches Chronological Age`;
      } else {
        babyPrematureVal.textContent = formatTimePeriod(prematureWeeks, prematureRemainingDays) + ` early`;
        babyCorrectedVal.textContent = correctedStr;
        primaryResult.innerHTML = `Corrected Developmental Age: <span style="color: var(--color-accent-hover);">${correctedStr}</span>`;
      }

      detailsChrono.classList.add("hidden");
      detailsDiff.classList.add("hidden");
      detailsBaby.classList.remove("hidden");
    }
  }

  // Calculate automatically on start
  performCalculations();
});
