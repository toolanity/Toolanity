/**
 * unit-converter.js
 * Toolanity - Multi-Category Engineering, Everyday & Travel Unit Converter
 * 100% client-side instant conversion in memory.
 */

document.addEventListener("DOMContentLoaded", () => {
  const categorySelect = document.getElementById("converter-category-select");
  const fromValueInput = document.getElementById("from-value-input");
  const fromUnitSelect = document.getElementById("from-unit-select");
  const toValueInput = document.getElementById("to-value-input");
  const toUnitSelect = document.getElementById("to-unit-select");
  const btnSwap = document.getElementById("btn-swap-units");
  const formulaDisplay = document.getElementById("conversion-formula");
  const quickTable = document.getElementById("quick-reference-table");
  const presetContainer = document.getElementById("presets-container");

  // Conversion definitions (all units convert to and from a base unit)
  const unitCategories = {
    length: {
      name: "Length & Distance",
      base: "meter",
      units: {
        meter: { name: "Meters (m)", factor: 1 },
        kilometer: { name: "Kilometers (km)", factor: 1000 },
        centimeter: { name: "Centimeters (cm)", factor: 0.01 },
        millimeter: { name: "Millimeters (mm)", factor: 0.001 },
        inch: { name: "Inches (in)", factor: 0.0254 },
        foot: { name: "Feet (ft)", factor: 0.3048 },
        yard: { name: "Yards (yd)", factor: 0.9144 },
        mile: { name: "Miles (mi)", factor: 1609.344 },
        nautical_mile: { name: "Nautical Miles (NM)", factor: 1852 }
      },
      defaultFrom: "meter",
      defaultTo: "foot",
      presets: [
        { label: "1 km to Miles", from: "kilometer", to: "mile", val: 1 },
        { label: "1 Mile to km", from: "mile", to: "kilometer", val: 1 },
        { label: "6 Feet to cm", from: "foot", to: "centimeter", val: 6 }
      ]
    },
    weight: {
      name: "Weight & Mass",
      base: "kilogram",
      units: {
        kilogram: { name: "Kilograms (kg)", factor: 1 },
        gram: { name: "Grams (g)", factor: 0.001 },
        milligram: { name: "Milligrams (mg)", factor: 0.000001 },
        pound: { name: "Pounds (lbs)", factor: 0.45359237 },
        ounce: { name: "Ounces (oz)", factor: 0.028349523125 },
        metric_ton: { name: "Metric Tons (t)", factor: 1000 },
        stone: { name: "Stone (st)", factor: 6.35029318 }
      },
      defaultFrom: "kilogram",
      defaultTo: "pound",
      presets: [
        { label: "1 kg to lbs", from: "kilogram", to: "pound", val: 1 },
        { label: "1 lb to kg", from: "pound", to: "kilogram", val: 1 },
        { label: "100 g to oz", from: "gram", to: "ounce", val: 100 }
      ]
    },
    temperature: {
      name: "Temperature",
      custom: true, // Non-linear offset
      units: {
        celsius: { name: "Celsius (°C)" },
        fahrenheit: { name: "Fahrenheit (°F)" },
        kelvin: { name: "Kelvin (K)" }
      },
      defaultFrom: "celsius",
      defaultTo: "fahrenheit",
      convert: (val, from, to) => {
        let c = val;
        if (from === "fahrenheit") c = (val - 32) * (5 / 9);
        else if (from === "kelvin") c = val - 273.15;

        if (to === "celsius") return c;
        if (to === "fahrenheit") return c * (9 / 5) + 32;
        if (to === "kelvin") return c + 273.15;
        return c;
      },
      formula: (from, to) => {
        if (from === "celsius" && to === "fahrenheit") return "°F = (°C × 9/5) + 32";
        if (from === "fahrenheit" && to === "celsius") return "°C = (°F − 32) × 5/9";
        if (from === "celsius" && to === "kelvin") return "K = °C + 273.15";
        return `${from} to ${to}`;
      },
      presets: [
        { label: "0°C (Freezing)", from: "celsius", to: "fahrenheit", val: 0 },
        { label: "20°C (Room Temp)", from: "celsius", to: "fahrenheit", val: 20 },
        { label: "100°C (Boiling)", from: "celsius", to: "fahrenheit", val: 100 },
        { label: "98.6°F (Body Temp)", from: "fahrenheit", to: "celsius", val: 98.6 }
      ]
    },
    pressure: {
      name: "Pressure (Tyre & Industrial)",
      base: "pascal",
      units: {
        psi: { name: "Pounds per sq inch (psi)", factor: 6894.757 },
        bar: { name: "Bar (bar)", factor: 100000 },
        kpa: { name: "Kilopascals (kPa)", factor: 1000 },
        mpa: { name: "Megapascals (MPa)", factor: 1000000 },
        atm: { name: "Standard Atmospheres (atm)", factor: 101325 },
        mmhg: { name: "Millimeters of Mercury (mmHg)", factor: 133.322 },
        inhg: { name: "Inches of Mercury (inHg)", factor: 3386.389 }
      },
      defaultFrom: "psi",
      defaultTo: "bar",
      presets: [
        { label: "32 psi (Typical Tyre)", from: "psi", to: "bar", val: 32 },
        { label: "35 psi (Tyre)", from: "psi", to: "bar", val: 35 },
        { label: "2.2 bar to psi", from: "bar", to: "psi", val: 2.2 },
        { label: "1 atm to kPa", from: "atm", to: "kpa", val: 1 }
      ]
    },
    torque: {
      name: "Torque (Mechanical & Auto)",
      base: "newton_meter",
      units: {
        newton_meter: { name: "Newton-meters (N·m)", factor: 1 },
        foot_pound: { name: "Foot-pounds (ft-lb)", factor: 1.355818 },
        inch_pound: { name: "Inch-pounds (in-lb)", factor: 0.1129848 },
        kgf_meter: { name: "Kilogram-force meters (kgf·m)", factor: 9.80665 }
      },
      defaultFrom: "newton_meter",
      defaultTo: "foot_pound",
      presets: [
        { label: "100 N·m to ft-lb", from: "newton_meter", to: "foot_pound", val: 100 },
        { label: "50 ft-lb to N·m", from: "foot_pound", to: "newton_meter", val: 50 },
        { label: "250 in-lb to ft-lb", from: "inch_pound", to: "foot_pound", val: 250 }
      ]
    },
    voltage: {
      name: "Voltage & UK Travel",
      base: "volt",
      units: {
        volt: { name: "Volts (V)", factor: 1 },
        millivolt: { name: "Millivolts (mV)", factor: 0.001 },
        kilovolt: { name: "Kilovolts (kV)", factor: 1000 }
      },
      defaultFrom: "volt",
      defaultTo: "millivolt",
      presets: [
        { label: "UK Mains (230V)", from: "volt", to: "volt", val: 230 },
        { label: "US Mains (120V)", from: "volt", to: "volt", val: 120 },
        { label: "1 kV to V", from: "kilovolt", to: "volt", val: 1 }
      ]
    },
    current: {
      name: "Electrical Current (Ampere)",
      base: "ampere",
      units: {
        ampere: { name: "Amperes (A)", factor: 1 },
        milliampere: { name: "Milliamperes (mA)", factor: 0.001 },
        microampere: { name: "Microamperes (µA)", factor: 0.000001 },
        kiloampere: { name: "Kiloamperes (kA)", factor: 1000 }
      },
      defaultFrom: "ampere",
      defaultTo: "milliampere",
      presets: [
        { label: "1 A to mA", from: "ampere", to: "milliampere", val: 1 },
        { label: "500 mA to A", from: "milliampere", to: "ampere", val: 500 },
        { label: "10 A (Household fuse)", from: "ampere", to: "milliampere", val: 10 }
      ]
    },
    flow_rate: {
      name: "Flow Rate",
      base: "liter_per_minute",
      units: {
        liter_per_minute: { name: "Liters / min (L/min)", factor: 1 },
        m3_per_hour: { name: "Cubic meters / hour (m³/h)", factor: 16.66667 },
        cfm: { name: "Cubic feet / min (CFM)", factor: 28.31685 },
        gpm: { name: "US Gallons / min (GPM)", factor: 3.785412 }
      },
      defaultFrom: "liter_per_minute",
      defaultTo: "gpm",
      presets: [
        { label: "100 CFM to m³/h", from: "cfm", to: "m3_per_hour", val: 100 },
        { label: "10 GPM to L/min", from: "gpm", to: "liter_per_minute", val: 10 },
        { label: "50 L/min to GPM", from: "liter_per_minute", to: "gpm", val: 50 }
      ]
    },
    density: {
      name: "Density",
      base: "kg_per_m3",
      units: {
        kg_per_m3: { name: "Kilograms / m³ (kg/m³)", factor: 1 },
        g_per_cm3: { name: "Grams / cm³ (g/cm³)", factor: 1000 },
        lb_per_ft3: { name: "Pounds / ft³ (lb/ft³)", factor: 16.01846 },
        lb_per_in3: { name: "Pounds / in³ (lb/in³)", factor: 27679.9 }
      },
      defaultFrom: "kg_per_m3",
      defaultTo: "g_per_cm3",
      presets: [
        { label: "Water (1000 kg/m³)", from: "kg_per_m3", to: "g_per_cm3", val: 1000 },
        { label: "Steel (7.85 g/cm³)", from: "g_per_cm3", to: "kg_per_m3", val: 7.85 }
      ]
    },
    moment_of_inertia: {
      name: "Moment of Inertia",
      base: "kg_m2",
      units: {
        kg_m2: { name: "kg·m²", factor: 1 },
        g_cm2: { name: "g·cm²", factor: 0.0000001 },
        lb_ft2: { name: "lb·ft²", factor: 0.04214011 },
        lb_in2: { name: "lb·in²", factor: 0.0002926397 }
      },
      defaultFrom: "kg_m2",
      defaultTo: "lb_ft2",
      presets: [
        { label: "1 kg·m² to lb·ft²", from: "kg_m2", to: "lb_ft2", val: 1 },
        { label: "10 lb·ft² to kg·m²", from: "lb_ft2", to: "kg_m2", val: 10 }
      ]
    },
    thermal: {
      name: "Thermal Energy & BTU",
      base: "joule",
      units: {
        btu: { name: "British Thermal Units (BTU)", factor: 1055.056 },
        joule: { name: "Joules (J)", factor: 1 },
        kilojoule: { name: "Kilojoules (kJ)", factor: 1000 },
        calorie: { name: "Calories (cal)", factor: 4.184 },
        kilocalorie: { name: "Kilocalories (kcal)", factor: 4184 },
        kwh: { name: "Kilowatt-hours (kWh)", factor: 3600000 }
      },
      defaultFrom: "btu",
      defaultTo: "kilowatt_hour",
      presets: [
        { label: "10,000 BTU AC to kWh", from: "btu", to: "kwh", val: 10000 },
        { label: "1 kWh to BTU", from: "kwh", to: "btu", val: 1 },
        { label: "1000 Joules to cal", from: "joule", to: "calorie", val: 1000 }
      ]
    },
    blood_glucose: {
      name: "Blood Glucose (Reference Only)",
      custom: true,
      units: {
        mg_dl: { name: "mg/dL (US standard)" },
        mmol_l: { name: "mmol/L (UK/International)" }
      },
      defaultFrom: "mg_dl",
      defaultTo: "mmol_l",
      convert: (val, from, to) => {
        // Standard clinical factor for glucose: 1 mmol/L = 18.0182 mg/dL
        if (from === to) return val;
        if (from === "mg_dl" && to === "mmol_l") return val / 18.0182;
        if (from === "mmol_l" && to === "mg_dl") return val * 18.0182;
        return val;
      },
      formula: (from, to) => {
        if (from === "mg_dl" && to === "mmol_l") return "mmol/L = mg/dL ÷ 18.0182";
        if (from === "mmol_l" && to === "mg_dl") return "mg/dL = mmol/L × 18.0182";
        return "";
      },
      presets: [
        { label: "Fasting Normal (90 mg/dL)", from: "mg_dl", to: "mmol_l", val: 90 },
        { label: "5.0 mmol/L to mg/dL", from: "mmol_l", to: "mg_dl", val: 5.0 },
        { label: "Fasting High (126 mg/dL)", from: "mg_dl", to: "mmol_l", val: 126 }
      ]
    },
    rack_unit: {
      name: "IT Server Rack Units (U / RU)",
      base: "rack_unit",
      units: {
        rack_unit: { name: "Rack Units (U / RU)", factor: 1 },
        inch: { name: "Inches (in)", factor: 0.57142857 }, // 1.75 in per U (factor to U = 1 / 1.75)
        millimeter: { name: "Millimeters (mm)", factor: 0.022497188 } // 44.45 mm per U
      },
      defaultFrom: "rack_unit",
      defaultTo: "inch",
      presets: [
        { label: "1U Server", from: "rack_unit", to: "inch", val: 1 },
        { label: "2U Server", from: "rack_unit", to: "inch", val: 2 },
        { label: "42U Standard Rack", from: "rack_unit", to: "inch", val: 42 }
      ]
    }
  };

  // Populate Unit Dropdowns
  function populateUnits(catKey) {
    const cat = unitCategories[catKey];
    if (!cat) return;

    fromUnitSelect.innerHTML = "";
    toUnitSelect.innerHTML = "";

    for (const [key, item] of Object.entries(cat.units)) {
      const optFrom = document.createElement("option");
      optFrom.value = key;
      optFrom.textContent = item.name;
      if (key === cat.defaultFrom) optFrom.selected = true;
      fromUnitSelect.appendChild(optFrom);

      const optTo = document.createElement("option");
      optTo.value = key;
      optTo.textContent = item.name;
      if (key === cat.defaultTo) optTo.selected = true;
      toUnitSelect.appendChild(optTo);
    }

    renderPresets(cat);
    performConversion();
  }

  function renderPresets(cat) {
    if (!presetContainer) return;
    presetContainer.innerHTML = "";
    if (!cat.presets || cat.presets.length === 0) return;

    cat.presets.forEach(p => {
      const btn = document.createElement("button");
      btn.className = "btn btn-secondary";
      btn.style.padding = "0.3rem 0.65rem";
      btn.style.fontSize = "0.8rem";
      btn.textContent = p.label;
      btn.addEventListener("click", () => {
        fromUnitSelect.value = p.from;
        toUnitSelect.value = p.to;
        fromValueInput.value = p.val;
        performConversion();
      });
      presetContainer.appendChild(btn);
    });
  }

  function formatResult(num) {
    if (isNaN(num)) return "--";
    if (Math.abs(num) >= 1e9 || (Math.abs(num) > 0 && Math.abs(num) < 1e-4)) {
      return num.toExponential(6);
    }
    // Round cleanly
    return Number(num.toPrecision(8)).toString();
  }

  function performConversion() {
    const catKey = categorySelect.value;
    const cat = unitCategories[catKey];
    if (!cat) return;

    const fromVal = parseFloat(fromValueInput.value);
    const fromUnitKey = fromUnitSelect.value;
    const toUnitKey = toUnitSelect.value;

    if (isNaN(fromVal)) {
      toValueInput.value = "";
      if (formulaDisplay) formulaDisplay.textContent = "Enter a valid numeric value";
      return;
    }

    let result = 0;
    let formulaText = "";

    if (cat.custom && cat.convert) {
      result = cat.convert(fromVal, fromUnitKey, toUnitKey);
      if (cat.formula) {
        formulaText = cat.formula(fromUnitKey, toUnitKey);
      }
    } else {
      const fromFactor = cat.units[fromUnitKey].factor;
      const toFactor = cat.units[toUnitKey].factor;

      // Base = Val * fromFactor
      // Target = Base / toFactor
      const inBase = fromVal * fromFactor;
      result = inBase / toFactor;

      const singleRatio = fromFactor / toFactor;
      formulaText = `1 ${cat.units[fromUnitKey].name.split("(")[0].trim()} = ${formatResult(singleRatio)} ${cat.units[toUnitKey].name.split("(")[0].trim()}`;
    }

    toValueInput.value = formatResult(result);
    if (formulaDisplay) formulaDisplay.textContent = formulaText;

    updateReferenceTable(cat, fromUnitKey, toUnitKey, fromVal);
  }

  function updateReferenceTable(cat, fromKey, toKey, val) {
    if (!quickTable) return;
    quickTable.innerHTML = "";

    const testMultipliers = [1, 5, 10, 25, 50, 100];
    const fromName = cat.units[fromKey].name.split("(")[0].trim();
    const toName = cat.units[toKey].name.split("(")[0].trim();

    testMultipliers.forEach(m => {
      let r = 0;
      if (cat.custom && cat.convert) {
        r = cat.convert(m, fromKey, toKey);
      } else {
        r = (m * cat.units[fromKey].factor) / cat.units[toKey].factor;
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="padding: 0.4rem 0.75rem; border-bottom: 1px solid var(--color-border);">${m} ${fromName}</td>
        <td style="padding: 0.4rem 0.75rem; border-bottom: 1px solid var(--color-border); font-weight: 700; color: var(--color-accent);">${formatResult(r)} ${toName}</td>
      `;
      quickTable.appendChild(tr);
    });
  }

  // Swap Units
  if (btnSwap) {
    btnSwap.addEventListener("click", () => {
      const temp = fromUnitSelect.value;
      fromUnitSelect.value = toUnitSelect.value;
      toUnitSelect.value = temp;

      // If toValue is numeric, place it as fromValue
      const currentToVal = parseFloat(toValueInput.value);
      if (!isNaN(currentToVal)) {
        fromValueInput.value = currentToVal;
      }

      performConversion();
    });
  }

  if (categorySelect) {
    categorySelect.addEventListener("change", () => {
      populateUnits(categorySelect.value);
    });
  }

  if (fromValueInput) {
    fromValueInput.addEventListener("input", performConversion);
  }

  if (fromUnitSelect) {
    fromUnitSelect.addEventListener("change", performConversion);
  }

  if (toUnitSelect) {
    toUnitSelect.addEventListener("change", performConversion);
  }

  // Initialize with Length
  populateUnits("length");
});
