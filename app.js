(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const numberFormat = new Intl.NumberFormat("en-US");

  const crops = [
    { name: "Potato", scientific: "Solanum tuberosum", icon: "🥔", calories: 77, protein: 2, harvest: 90, tags: ["calories", "regolith"], color: "amber", summary: "A dependable calorie staple with edible tubers and a compact growth habit.", specs: "90–120 days to harvest · High carbohydrate yield · Requires carefully remediated substrate." },
    { name: "Sweet Potato", scientific: "Ipomoea batatas", icon: "🍠", calories: 86, protein: 2, harvest: 100, tags: ["calories", "regolith"], color: "orange", summary: "A nutrient-dense tuber crop that tolerates heat and produces edible leafy greens.", specs: "100–120 days to harvest · High energy density · Vining growth benefits from trellising." },
    { name: "Duckweed", scientific: "Lemna minor", icon: "🌿", calories: 25, protein: 5, harvest: 7, tags: ["protein", "fast"], color: "lime", summary: "A fast-growing aquatic plant with useful protein and a small cultivation footprint.", specs: "Harvest every 5–10 days · Protein-rich dry biomass · Grows in shallow nutrient solution." },
    { name: "Spirulina", scientific: "Arthrospira platensis", icon: "🧫", calories: 290, protein: 57, harvest: 3, tags: ["protein", "fast"], color: "cyan", summary: "A high-protein cyanobacterium suitable for controlled photobioreactors.", specs: "Continuous or frequent harvest · Very high protein per dry mass · Needs light, mixing, and pH control." },
    { name: "Dwarf Wheat", scientific: "Triticum aestivum 'Apogee'", icon: "🌾", calories: 339, protein: 13, harvest: 75, tags: ["calories"], color: "yellow", summary: "A compact wheat cultivar that can supply grain while limiting greenhouse height.", specs: "70–85 days to harvest · Grain supports staple foods · Requires controlled pollination and airflow." },
    { name: "Radish", scientific: "Raphanus sativus", icon: "🌱", calories: 16, protein: 1, harvest: 28, tags: ["fast", "regolith"], color: "rose", summary: "A quick-turnaround root crop useful for fresh meals and early substrate trials.", specs: "25–35 days to harvest · Rapid crop cycle · Root quality depends on loose, clean growing media." },
    { name: "Soybean", scientific: "Glycine max", icon: "🫘", calories: 446, protein: 36, harvest: 90, tags: ["protein", "calories"], color: "emerald", summary: "A versatile protein and oil crop that can contribute to a balanced food system.", specs: "80–110 days to harvest · Protein- and oil-rich seed · Benefits from compatible nitrogen-fixing bacteria." },
    { name: "Alpine Strawberry", scientific: "Fragaria vesca", icon: "🍓", calories: 32, protein: 1, harvest: 60, tags: ["regolith"], color: "pink", summary: "A compact fruit crop that adds variety and fresh produce to the crew diet.", specs: "First fruit in roughly 60–90 days · Repeated harvests possible · Needs pollination and stable lighting." },
  ];
  let modalTrigger;

  function renderIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  function renderCrops() {
    const grid = $("#crops-grid");
    if (!grid) return;
    grid.innerHTML = crops.map((crop, index) => `
      <article class="crop-card p-5 bg-space-850 rounded-xl border border-slate-700 hover:border-${crop.color}-500/60 transition shadow-lg flex flex-col" style="animation-delay:${index * 35}ms">
        <div class="flex items-start justify-between gap-3">
          <span class="text-3xl" aria-hidden="true">${crop.icon}</span>
          <span class="text-[10px] uppercase tracking-wider font-mono text-${crop.color}-300 bg-${crop.color}-500/10 border border-${crop.color}-500/20 rounded-full px-2 py-1">${crop.harvest} day${crop.harvest === 1 ? "" : "s"}</span>
        </div>
        <h3 class="text-lg font-bold text-white mt-4">${crop.name}</h3>
        <p class="text-xs italic text-slate-500 mt-0.5">${crop.scientific}</p>
        <p class="text-sm text-slate-300 leading-relaxed mt-3 flex-1">${crop.summary}</p>
        <div class="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
          <div class="rounded-lg bg-space-900 p-2"><span class="block text-slate-500">Calories</span><strong class="text-amber-300">${crop.calories} kcal</strong></div>
          <div class="rounded-lg bg-space-900 p-2"><span class="block text-slate-500">Protein</span><strong class="text-emerald-300">${crop.protein} g</strong></div>
        </div>
        <button type="button" class="crop-details-btn mt-4 w-full rounded-lg border border-slate-700 bg-space-800 px-3 py-2 text-sm text-slate-200 hover:bg-space-700 transition" data-crop-index="${index}" aria-label="View ${crop.name} details">View crop specs</button>
      </article>`).join("");
    renderIcons();
  }

  function setCropFilter(filter) {
    $$(".crop-filter-btn").forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle("active", active);
      button.classList.toggle("bg-mars-500", active);
      button.classList.toggle("text-white", active);
      button.classList.toggle("font-bold", active);
      button.classList.toggle("shadow-sm", active);
      button.classList.toggle("bg-space-800", !active);
      button.classList.toggle("text-slate-300", !active);
      button.classList.toggle("border", !active);
      button.classList.toggle("border-slate-700/60", !active);
      button.setAttribute("aria-pressed", String(active));
    });

    $$(".crop-card").forEach((card, index) => {
      card.hidden = filter !== "all" && !crops[index].tags.includes(filter);
    });
  }

  function openCrop(index) {
    const crop = crops[index];
    const modal = $("#crop-modal");
    const content = $("#modal-content");
    if (!crop || !modal || !content) return;

    content.innerHTML = `
      <div class="text-xs font-mono uppercase tracking-wider text-emerald-400">Martian Crop Spec Sheet</div>
      <div class="flex items-start gap-4 pr-8">
        <span class="text-5xl" aria-hidden="true">${crop.icon}</span>
        <div><h2 id="crop-modal-title" class="text-2xl sm:text-3xl font-black text-white">${crop.name}</h2><p class="text-sm italic text-slate-400">${crop.scientific}</p></div>
      </div>
      <p class="text-slate-300 leading-relaxed">${crop.summary}</p>
      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-xl bg-space-900 p-4"><span class="text-xs text-slate-400">Energy</span><strong class="block text-xl text-amber-300">${crop.calories} kcal / 100 g</strong></div>
        <div class="rounded-xl bg-space-900 p-4"><span class="text-xs text-slate-400">Protein</span><strong class="block text-xl text-emerald-300">${crop.protein} g / 100 g</strong></div>
      </div>
      <div class="rounded-xl border border-slate-700 bg-space-900 p-4"><h3 class="font-bold text-white">Cultivation notes</h3><p class="text-sm text-slate-300 mt-2">${crop.specs}</p></div>`;
    modalTrigger = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    $("#close-modal-btn")?.focus();
    renderIcons();
  }

  function closeCrop() {
    const modal = $("#crop-modal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modalTrigger?.focus();
    modalTrigger = undefined;
  }

  const controls = {
    pressure: { input: "#param-pressure", output: "#val-pressure", suffix: " kPa" },
    co2: { input: "#param-co2", output: "#val-co2", suffix: " ppm", format: true },
    photoperiod: { input: "#param-photoperiod", output: "#val-photoperiod", suffix: " hrs/sol" },
    water: { input: "#param-water-loop", output: "#val-water-loop", suffix: "%" },
    temp: { input: "#param-temp", output: "#val-temp", suffix: "°C" },
  };
  const defaults = { pressure: 50, co2: 1200, photoperiod: 18, water: 96, temp: 22, medium: "regolith-remediated" };
  const presets = {
    ideal: { pressure: 55, co2: 1400, photoperiod: 18, water: 98, temp: 22, medium: "aeroponics" },
    dust_storm: { pressure: 50, co2: 1200, photoperiod: 10, water: 92, temp: 20, medium: "hydroponics" },
    hull_breach: { pressure: 12, co2: 800, photoperiod: 18, water: 85, temp: 15, medium: "regolith-remediated" },
    the_martian: { pressure: 35, co2: 1100, photoperiod: 16, water: 90, temp: 20, medium: "raw-regolith" },
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function updateSimulator() {
    const values = {};
    for (const [key, config] of Object.entries(controls)) {
      const input = $(config.input);
      if (!input) continue;
      values[key] = Number(input.value);
      const formatted = config.format ? numberFormat.format(values[key]) : String(values[key]);
      const output = $(config.output);
      if (output) output.textContent = `${formatted}${config.suffix}`;
    }

    const medium = $("#param-medium")?.value || defaults.medium;
    const mediumFactor = { aeroponics: 1.06, hydroponics: 0.98, "regolith-remediated": 1, "raw-regolith": 0.48 }[medium] || 1;
    const pressureFactor = clamp(1 - Math.abs(values.pressure - 50) * 0.008, 0.4, 1);
    const co2Factor = clamp(1 - Math.abs(values.co2 - 1300) / 5000, 0.45, 1);
    const lightFactor = clamp(1 - Math.abs(values.photoperiod - 18) * 0.025, 0.55, 1);
    const temperatureFactor = clamp(1 - Math.abs(values.temp - 22) * 0.025, 0.45, 1);
    const waterFactor = clamp(0.75 + (values.water - 70) / 100, 0.75, 1.04);
    const yieldFactor = pressureFactor * co2Factor * lightFactor * temperatureFactor * waterFactor * mediumFactor;
    const calories = Math.round(21450 * yieldFactor);
    const score = Math.round(clamp(92 + (yieldFactor - 1) * 78 - Math.max(0, 35 - values.pressure) * 0.45 - (medium === "raw-regolith" ? 22 : 0), 0, 100));
    const oxygen = calories * 0.000289;
    const waterLoss = 45 * (1 - values.water / 100);
    const harvest = clamp(1.28 * yieldFactor, 0.2, 1.6);
    const rating = score >= 80 ? "OPTIMAL" : score >= 60 ? "STABLE" : score >= 35 ? "AT RISK" : "CRITICAL";
    const color = score >= 80 ? "emerald" : score >= 60 ? "yellow" : score >= 35 ? "orange" : "red";
    const reason = medium === "raw-regolith"
      ? "Raw regolith presents a serious perchlorate hazard; remediate the substrate before planting."
      : values.pressure < 30
        ? "Low pressure is stressing crops and reducing colony safety margins."
        : values.co2 > 2500
          ? "CO₂ is approaching harmful levels; increase ventilation or reduce enrichment."
          : values.photoperiod < 12
            ? "Limited light is reducing photosynthesis; increase LED exposure if power allows."
            : values.water < 85
              ? "Water recovery is low; fresh-water reserves will deplete quickly."
              : score >= 80
                ? "Biomass synthesis is running at peak photosynthetic efficiency."
                : "Production is reduced; adjust environmental controls to improve crop performance.";

    const ratingNode = $("#viability-rating");
    if (ratingNode) {
      ratingNode.textContent = rating;
      ratingNode.className = `text-3xl sm:text-4xl font-black text-${color}-400`;
    }
    $("#viability-score")?.replaceChildren(document.createTextNode(String(score)));
    const progress = $("#viability-progress-bar");
    if (progress) {
      progress.style.width = `${score}%`;
      progress.className = `h-full bg-gradient-to-r from-${color}-500 to-${color}-300 transition-all duration-300`;
    }

    const statusCard = $("#status-card");
    if (statusCard) statusCard.className = `p-6 rounded-2xl bg-space-850 border border-${color}-500/40 shadow-2xl relative overflow-hidden`;
    const alertBox = $("#sim-alert-box");
    if (alertBox) {
      alertBox.className = `mt-4 p-3 rounded-lg bg-${color}-950/40 border border-${color}-500/30 text-xs text-${color}-300`;
      alertBox.innerHTML = `<div class="flex items-center gap-1.5 font-bold"><i data-lucide="${score >= 80 ? "check-circle" : "alert-triangle"}" class="w-4 h-4 text-${color}-400"></i>${score >= 80 ? "All Environmental Parameters Within Tolerances" : "Environmental Stress Detected"}</div><p class="text-[11px] text-slate-300 mt-1">${reason}</p>`;
    }

    const crew = $("#out-crew-support");
    if (crew) crew.textContent = `(Supports ${(calories / 3000).toFixed(1)} crew)`;
    $("#out-calories")?.replaceChildren(document.createTextNode(numberFormat.format(calories)));
    $("#out-oxygen")?.replaceChildren(document.createTextNode(`${oxygen.toFixed(1)} kg`));
    $("#out-water-loss")?.replaceChildren(document.createTextNode(`${waterLoss.toFixed(1)} L`));
    $("#out-harvest-rate")?.replaceChildren(document.createTextNode(`${harvest.toFixed(2)}x`));
    renderIcons();
  }

  window.applyPreset = (name) => {
    const values = name === "default" ? defaults : presets[name];
    if (!values) return;
    for (const [key, config] of Object.entries(controls)) {
      const input = $(config.input);
      if (input) input.value = values[key];
    }
    const medium = $("#param-medium");
    if (medium) medium.value = values.medium;
    updateSimulator();
  };

  function setupMenu() {
    const button = $("#mobile-menu-btn");
    const menu = $("#mobile-menu");
    if (!button || !menu) return;
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", () => {
      const opening = menu.classList.contains("hidden");
      menu.classList.toggle("hidden", !opening);
      button.setAttribute("aria-expanded", String(opening));
      document.body.classList.toggle("menu-open", opening);
      const icon = $("#menu-icon");
      if (icon) icon.setAttribute("data-lucide", opening ? "x" : "menu");
      renderIcons();
    });
    $$(".mobile-nav-link", menu).forEach((link) => link.addEventListener("click", () => {
      menu.classList.add("hidden");
      button.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    }));
  }

  function setupClock() {
    const timeNode = $("#martian-time");
    if (!timeNode) return;
    const update = () => {
      const now = new Date();
      timeNode.textContent = now.toLocaleTimeString("en-GB", { timeZone: "UTC", hour12: false });
    };
    update();
    window.setInterval(update, 1000);
  }

  function setupAudio() {
    const button = $("#audio-toggle-btn");
    const status = $("#audio-status");
    if (!button || !status) return;
    let audioContext;
    let oscillator;
    let gain;

    button.addEventListener("click", async () => {
      if (oscillator) {
        oscillator.stop();
        await audioContext.close();
        oscillator = undefined;
        status.textContent = "Audio: OFF";
        button.setAttribute("aria-pressed", "false");
        return;
      }
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        status.textContent = "Audio unavailable";
        return;
      }
      try {
        audioContext = new AudioContext();
        oscillator = audioContext.createOscillator();
        gain = audioContext.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = 58;
        gain.gain.value = 0.012;
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start();
        status.textContent = "Audio: ON";
        button.setAttribute("aria-pressed", "true");
      } catch (error) {
        status.textContent = "Audio unavailable";
        console.error("Could not start habitat audio.", error);
        oscillator = undefined;
      }
    });
  }

  function setupFaq() {
    $$(".faq-btn").forEach((button) => {
      const content = button.nextElementSibling;
      button.setAttribute("aria-expanded", "false");
      button.addEventListener("click", () => {
        const opening = content?.classList.contains("hidden") ?? false;
        content?.classList.toggle("hidden", !opening);
        button.setAttribute("aria-expanded", String(opening));
        $(".faq-icon", button)?.classList.toggle("is-open", opening);
      });
    });
  }

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const filterButton = target.closest(".crop-filter-btn");
    if (filterButton) setCropFilter(filterButton.dataset.filter || "all");

    const cropButton = target.closest(".crop-details-btn");
    if (cropButton) openCrop(Number(cropButton.dataset.cropIndex));
  });

  $("#close-modal-btn")?.addEventListener("click", closeCrop);
  $("#crop-modal")?.addEventListener("click", (event) => {
    if (event.target === $("#crop-modal")) closeCrop();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCrop();
  });
  $("#reset-sim-btn")?.addEventListener("click", () => window.applyPreset("default"));
  Object.values(controls).forEach(({ input }) => $(input)?.addEventListener("input", updateSimulator));
  $("#param-medium")?.addEventListener("change", updateSimulator);

  renderCrops();
  setupMenu();
  setupClock();
  setupAudio();
  setupFaq();
  setCropFilter("all");
  updateSimulator();
  renderIcons();
})();
