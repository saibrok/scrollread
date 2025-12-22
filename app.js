const STORAGE_KEY = "teleprompter_settings_v1";
const DEFAULTS = {
  speed: 800,
  theme: "system",
  readerFontSize: 32,
  readerFont: "'Rubik', 'Segoe UI', Arial, sans-serif",
  readerAlign: "left",
  readerPadding: 120,
  readerTheme: "dark-gray",
  readerBrightness: 100,
  readerContrast: 100,
  readerSepia: 0,
};
const state = { ...DEFAULTS };

const inputText = document.getElementById("inputText");
const speedInput = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");
const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");
const charCountNoSpaces = document.getElementById("charCountNoSpaces");
const timeRange = document.getElementById("timeRange");
const themeSelect = document.getElementById("themeSelect");
const reader = document.getElementById("reader");
const startBtn = document.getElementById("startBtn");
const closeReaderBtn = document.getElementById("closeReaderBtn");
const playPauseBtn = document.getElementById("playPauseBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const jumpEndBtn = document.getElementById("jumpEndBtn");
const resetSettingsBtn = document.getElementById("resetSettingsBtn");
const helpBtn = document.getElementById("helpBtn");
const readerHelp = document.getElementById("readerHelp");
const helpCloseBtn = document.getElementById("helpCloseBtn");
const readerTimer = document.getElementById("readerTimer");
const readerStage = document.getElementById("readerStage");
const readerText = document.getElementById("readerText");
const readerSpeed = document.getElementById("readerSpeed");
const readerSpeedValue = document.getElementById("readerSpeedValue");
const readerFontSize = document.getElementById("readerFontSize");
const readerFontSizeValue = document.getElementById("readerFontSizeValue");
const readerFont = document.getElementById("readerFont");
const readerAlign = document.getElementById("readerAlign");
const readerPadding = document.getElementById("readerPadding");
const readerPaddingValue = document.getElementById("readerPaddingValue");
const readerTheme = document.getElementById("readerTheme");
const readerBrightness = document.getElementById("readerBrightness");
const readerBrightnessValue = document.getElementById("readerBrightnessValue");
const readerContrast = document.getElementById("readerContrast");
const readerContrastValue = document.getElementById("readerContrastValue");
const readerSepia = document.getElementById("readerSepia");
const readerSepiaValue = document.getElementById("readerSepiaValue");
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
let isPlaying = true;
let animationId = null;
let startTimestamp = 0;
let accumulatedElapsed = 0;
let totalDuration = 0;
let totalDistance = 0;

/**
 * Count characters in a string.
 * @param {string} text
 * @param {boolean} withSpaces
 * @returns {number}
 */
function countChars(text, withSpaces) {
  if (withSpaces) {
    return text.length;
  }
  return text.replace(/\s/g, "").length;
}

/**
 * Format seconds to mm:ss.
 * @param {number} seconds
 * @returns {string}
 */
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Update character counts and time range.
 */
function updateCounts() {
  const text = inputText.value;
  const withSpaces = countChars(text, true);
  const withoutSpaces = countChars(text, false);
  const words = text.trim().length
    ? text.trim().split(/\s+/).filter(Boolean).length
    : 0;
  wordCount.textContent = words;
  charCount.textContent = withSpaces;
  charCountNoSpaces.textContent = withoutSpaces;

  const speed = Number(speedInput.value);
  const minSeconds = Math.ceil((withoutSpaces / speed) * 60);
  const maxSeconds = Math.ceil((withSpaces / speed) * 60);
  timeRange.textContent = `${formatTime(minSeconds)}-${formatTime(maxSeconds)}`;
  speedValue.textContent = speed;
  startBtn.disabled = text.trim().length === 0;
}

/**
 * Save settings (text is excluded).
 */
function saveSettings() {
  const settings = {
    speed: Number(speedInput.value),
    theme: themeSelect.value,
    readerFontSize: Number(readerFontSize.value),
    readerFont: readerFont.value,
    readerAlign: readerAlign.value,
    readerPadding: Number(readerPadding.value),
    readerTheme: readerTheme.value,
    readerBrightness: Number(readerBrightness.value),
    readerContrast: Number(readerContrast.value),
    readerSepia: Number(readerSepia.value),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

/**
 * Load saved settings.
 */
function loadSettings() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return;
  }
  try {
    const parsed = JSON.parse(saved);
    if (typeof parsed.speed === "number") {
      state.speed = parsed.speed;
    }
    if (typeof parsed.theme === "string") {
      state.theme = parsed.theme;
    }
    if (typeof parsed.readerFontSize === "number") {
      state.readerFontSize = parsed.readerFontSize;
    }
    if (typeof parsed.readerFont === "string") {
      state.readerFont = parsed.readerFont;
    }
    if (typeof parsed.readerAlign === "string") {
      state.readerAlign = parsed.readerAlign;
    }
    if (typeof parsed.readerPadding === "number") {
      state.readerPadding = parsed.readerPadding;
    }
    if (typeof parsed.readerTheme === "string") {
      state.readerTheme = parsed.readerTheme;
    }
    if (typeof parsed.readerBrightness === "number") {
      state.readerBrightness = parsed.readerBrightness;
    }
    if (typeof parsed.readerContrast === "number") {
      state.readerContrast = parsed.readerContrast;
    }
    if (typeof parsed.readerSepia === "number") {
      state.readerSepia = parsed.readerSepia;
    }
  } catch (error) {
    console.warn("Settings parse error", error);
  }
}

/**
 * Apply UI theme.
 */
function applyTheme() {
  const theme = themeSelect.value;
  document.body.classList.remove("theme-dark");
  if (theme === "dark") {
    document.body.classList.add("theme-dark");
  } else if (theme === "system") {
    if (mediaQuery.matches) {
      document.body.classList.add("theme-dark");
    }
  }
}

/**
 * Apply reader theme variables.
 */
function applyReaderTheme() {
  const themes = {
    "dark-gray": { bg: "#0d1016", text: "#e7ebf3" },
    "light-gray": { bg: "#f0f1f5", text: "#1a1f2b" },
    sepia: { bg: "#f2e6d0", text: "#3b2f25" },
    paper: { bg: "#fbf8f0", text: "#2d2a26" },
  };
  const theme = themes[readerTheme.value] || themes["dark-gray"];
  reader.style.setProperty("--reader-bg", theme.bg);
  reader.style.setProperty("--reader-text", theme.text);
}

/**
 * Apply reader settings to CSS variables.
 */
function applyReaderSettings() {
  reader.style.setProperty("--reader-font-size", `${readerFontSize.value}px`);
  reader.style.setProperty("--reader-font", readerFont.value);
  readerStage.style.setProperty("--read-padding", `${readerPadding.value}px`);
  readerText.style.textAlign = readerAlign.value;
  reader.style.setProperty("--reader-brightness", `${readerBrightness.value}%`);
  reader.style.setProperty("--reader-contrast", `${readerContrast.value}%`);
  reader.style.setProperty("--reader-sepia", `${readerSepia.value}%`);
  applyReaderTheme();
}

/**
 * Sync speed controls between editor and reader.
 */
function syncSpeedControls(value) {
  speedInput.value = value;
  speedValue.textContent = value;
  readerSpeed.value = value;
  readerSpeedValue.textContent = value;
}

/**
 * Update reader timer display.
 * @param {number} currentSeconds
 * @param {number} totalSeconds
 */
function updateReaderTimer(currentSeconds, totalSeconds) {
  readerTimer.textContent = `${formatTime(currentSeconds)} / ${formatTime(totalSeconds)}`;
}

/**
 * Measure scroll distance and duration for reader mode.
 * @returns {{distance: number, duration: number}}
 */
function getReaderMetrics() {
  const totalChars = countChars(inputText.value, true);
  const speed = Number(readerSpeed.value || speedInput.value);
  const duration = totalChars > 0 ? Math.ceil((totalChars / speed) * 60) : 0;
  const stageHeight = readerStage.clientHeight;
  const baseDistance = Math.max(0, readerText.scrollHeight - stageHeight);
  const distance = Math.max(baseDistance, stageHeight);
  return { distance, duration };
}

/**
 * Reset reader scroll to start.
 */
function resetReaderScroll() {
  readerText.style.transform = "translateY(0)";
  startTimestamp = 0;
  accumulatedElapsed = 0;
  updateReaderTimer(0, totalDuration);
}

/**
 * Render scroll position for a given elapsed time.
 * @param {number} elapsedSeconds
 */
function renderScroll(elapsedSeconds) {
  const clamped = Math.min(Math.max(elapsedSeconds, 0), totalDuration);
  const progress = totalDuration > 0 ? clamped / totalDuration : 0;
  const offset = -totalDistance * progress;
  readerText.style.transform = `translateY(${offset}px)`;
  updateReaderTimer(Math.floor(clamped), totalDuration);
}

/**
 * Start or resume the scrolling animation.
 */
function startScroll() {
  if (!readerText.textContent) {
    readerText.textContent = inputText.value;
  }
  if (!totalDuration) {
    const metrics = getReaderMetrics();
    totalDistance = metrics.distance;
    totalDuration = metrics.duration;
  }
  if (totalDuration === 0) {
    updateReaderTimer(0, totalDuration);
    return;
  }
  if (!startTimestamp) {
    startTimestamp = performance.now();
  }
  const tick = (timestamp) => {
    if (!isPlaying) {
      return;
    }
    const elapsed = accumulatedElapsed + (timestamp - startTimestamp) / 1000;
    renderScroll(elapsed);
    if (elapsed < totalDuration) {
      animationId = requestAnimationFrame(tick);
    } else {
      isPlaying = false;
      playPauseBtn.textContent = "Плей";
    }
  };
  animationId = requestAnimationFrame(tick);
}

/**
 * Pause scrolling animation.
 */
function pauseScroll() {
  if (!animationId) {
    return;
  }
  cancelAnimationFrame(animationId);
  animationId = null;
  if (startTimestamp) {
    accumulatedElapsed += (performance.now() - startTimestamp) / 1000;
    accumulatedElapsed = Math.min(accumulatedElapsed, totalDuration);
    startTimestamp = 0;
  }
}

/**
 * Open reader mode.
 */
function openReader() {
  if (startBtn.disabled) {
    return;
  }
  reader.classList.add("active");
  isPlaying = false;
  playPauseBtn.textContent = "Плей";
  readerText.textContent = inputText.value;
  applyReaderSettings();
  requestAnimationFrame(() => {
    const metrics = getReaderMetrics();
    totalDistance = metrics.distance;
    totalDuration = metrics.duration;
    resetReaderScroll();
  });
}

/**
 * Close reader mode.
 */
function closeReader() {
  reader.classList.remove("active");
  readerHelp.classList.remove("active");
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

/**
 * Toggle play/pause state.
 */
function togglePlay() {
  isPlaying = !isPlaying;
  playPauseBtn.textContent = isPlaying ? "Пауза" : "Плей";
  if (isPlaying) {
    startScroll();
  } else {
    pauseScroll();
  }
}

/**
 * Jump to start or end.
 * @param {boolean} toEnd
 */
function jumpToEdge(toEnd) {
  if (!totalDuration) {
    const metrics = getReaderMetrics();
    totalDistance = metrics.distance;
    totalDuration = metrics.duration;
  }
  pauseScroll();
  accumulatedElapsed = toEnd ? totalDuration : 0;
  startTimestamp = 0;
  renderScroll(accumulatedElapsed);
}

/**
 * Reset settings to defaults.
 */
function resetSettings() {
  Object.assign(state, DEFAULTS);
  speedInput.value = state.speed;
  speedValue.textContent = state.speed;
  readerSpeed.value = state.speed;
  readerSpeedValue.textContent = state.speed;
  themeSelect.value = state.theme;
  readerFontSize.value = state.readerFontSize;
  readerFontSizeValue.textContent = state.readerFontSize;
  readerFont.value = state.readerFont;
  readerAlign.value = state.readerAlign;
  readerPadding.value = state.readerPadding;
  readerPaddingValue.textContent = state.readerPadding;
  readerTheme.value = state.readerTheme;
  readerBrightness.value = state.readerBrightness;
  readerBrightnessValue.textContent = state.readerBrightness;
  readerContrast.value = state.readerContrast;
  readerContrastValue.textContent = state.readerContrast;
  readerSepia.value = state.readerSepia;
  readerSepiaValue.textContent = state.readerSepia;
  applyTheme();
  applyReaderSettings();
  updateCounts();
  saveSettings();
}

loadSettings();

speedInput.value = state.speed;
themeSelect.value = state.theme;
readerSpeed.value = state.speed;
readerSpeedValue.textContent = state.speed;
readerFontSize.value = state.readerFontSize;
readerFontSizeValue.textContent = state.readerFontSize;
readerFont.value = state.readerFont;
readerAlign.value = state.readerAlign;
readerPadding.value = state.readerPadding;
readerPaddingValue.textContent = state.readerPadding;
readerTheme.value = state.readerTheme;
readerBrightness.value = state.readerBrightness;
readerBrightnessValue.textContent = state.readerBrightness;
readerContrast.value = state.readerContrast;
readerContrastValue.textContent = state.readerContrast;
readerSepia.value = state.readerSepia;
readerSepiaValue.textContent = state.readerSepia;

updateCounts();
applyTheme();
applyReaderSettings();

inputText.addEventListener("input", updateCounts);
speedInput.addEventListener("input", () => {
  updateCounts();
  syncSpeedControls(speedInput.value);
  saveSettings();
});
themeSelect.addEventListener("change", () => {
  applyTheme();
  saveSettings();
});

mediaQuery.addEventListener("change", () => {
  if (themeSelect.value === "system") {
    applyTheme();
  }
});

startBtn.addEventListener("click", openReader);
closeReaderBtn.addEventListener("click", closeReader);
playPauseBtn.addEventListener("click", togglePlay);
fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

jumpEndBtn.addEventListener("click", () => {
  jumpToEdge(true);
});

resetSettingsBtn.addEventListener("click", resetSettings);

helpBtn.addEventListener("click", () => {
  readerHelp.classList.add("active");
});

helpCloseBtn.addEventListener("click", () => {
  readerHelp.classList.remove("active");
});

readerSpeed.addEventListener("input", () => {
  updateCounts();
  syncSpeedControls(readerSpeed.value);
  saveSettings();
  const metrics = getReaderMetrics();
  totalDistance = metrics.distance;
  totalDuration = metrics.duration;
});

readerFontSize.addEventListener("input", () => {
  readerFontSizeValue.textContent = readerFontSize.value;
  applyReaderSettings();
  saveSettings();
  const metrics = getReaderMetrics();
  totalDistance = metrics.distance;
  totalDuration = metrics.duration;
});

readerFont.addEventListener("change", () => {
  applyReaderSettings();
  saveSettings();
  const metrics = getReaderMetrics();
  totalDistance = metrics.distance;
  totalDuration = metrics.duration;
});

readerAlign.addEventListener("change", () => {
  applyReaderSettings();
  saveSettings();
});

readerPadding.addEventListener("input", () => {
  readerPaddingValue.textContent = readerPadding.value;
  applyReaderSettings();
  saveSettings();
  const metrics = getReaderMetrics();
  totalDistance = metrics.distance;
  totalDuration = metrics.duration;
});

readerTheme.addEventListener("change", () => {
  applyReaderSettings();
  saveSettings();
});

readerBrightness.addEventListener("input", () => {
  readerBrightnessValue.textContent = readerBrightness.value;
  applyReaderSettings();
  saveSettings();
});

readerContrast.addEventListener("input", () => {
  readerContrastValue.textContent = readerContrast.value;
  applyReaderSettings();
  saveSettings();
});

readerSepia.addEventListener("input", () => {
  readerSepiaValue.textContent = readerSepia.value;
  applyReaderSettings();
  saveSettings();
});

document.addEventListener("keydown", (event) => {
  if (!reader.classList.contains("active")) {
    return;
  }
  const tagName = event.target.tagName.toLowerCase();
  if (["input", "textarea", "select"].includes(tagName)) {
    return;
  }
  if (event.code === "Space") {
    event.preventDefault();
    togglePlay();
    return;
  }
  if (event.key === "?") {
    event.preventDefault();
    readerHelp.classList.add("active");
    return;
  }
  if (event.key === "Escape") {
    event.preventDefault();
    closeReader();
    return;
  }
  if (event.key.toLowerCase() === "f") {
    event.preventDefault();
    fullscreenBtn.click();
    return;
  }
  if (event.key === "ArrowUp") {
    event.preventDefault();
    const next = Math.min(2000, Number(readerSpeed.value) + 100);
    syncSpeedControls(next);
    updateCounts();
    saveSettings();
    const metrics = getReaderMetrics();
    totalDistance = metrics.distance;
    totalDuration = metrics.duration;
    return;
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    const next = Math.max(100, Number(readerSpeed.value) - 100);
    syncSpeedControls(next);
    updateCounts();
    saveSettings();
    const metrics = getReaderMetrics();
    totalDistance = metrics.distance;
    totalDuration = metrics.duration;
    return;
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    const next = Math.min(100, Number(readerFontSize.value) + 2);
    readerFontSize.value = next;
    readerFontSizeValue.textContent = next;
    applyReaderSettings();
    saveSettings();
    const metrics = getReaderMetrics();
    totalDistance = metrics.distance;
    totalDuration = metrics.duration;
    return;
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    const next = Math.max(10, Number(readerFontSize.value) - 2);
    readerFontSize.value = next;
    readerFontSizeValue.textContent = next;
    applyReaderSettings();
    saveSettings();
    const metrics = getReaderMetrics();
    totalDistance = metrics.distance;
    totalDuration = metrics.duration;
    return;
  }
  if (event.key === "Home") {
    event.preventDefault();
    jumpToEdge(false);
    return;
  }
  if (event.key === "End") {
    event.preventDefault();
    jumpToEdge(true);
    return;
  }
});

readerStage.addEventListener("wheel", (event) => {
  if (isPlaying || totalDuration === 0 || totalDistance === 0) {
    return;
  }
  event.preventDefault();
  const delta = event.deltaY / totalDistance;
  accumulatedElapsed = Math.min(
    totalDuration,
    Math.max(0, accumulatedElapsed + delta * totalDuration)
  );
  renderScroll(accumulatedElapsed);
});

