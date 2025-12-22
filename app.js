const STORAGE_KEY = "teleprompter_settings_v1";
const state = {
  includeSpaces: true,
  speed: 800,
  theme: "system",
};

const inputText = document.getElementById("inputText");
const includeSpaces = document.getElementById("includeSpaces");
const speedInput = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");
const charCount = document.getElementById("charCount");
const timeRange = document.getElementById("timeRange");
const themeSelect = document.getElementById("themeSelect");
const reader = document.getElementById("reader");
const startBtn = document.getElementById("startBtn");
const closeReaderBtn = document.getElementById("closeReaderBtn");
const playPauseBtn = document.getElementById("playPauseBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const readerTimer = document.getElementById("readerTimer");
const readerStage = document.getElementById("readerStage");
const readerText = document.getElementById("readerText");
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
  charCount.textContent = includeSpaces.checked ? withSpaces : withoutSpaces;

  const speed = Number(speedInput.value);
  const minSeconds = Math.ceil((withoutSpaces / speed) * 60);
  const maxSeconds = Math.ceil((withSpaces / speed) * 60);
  timeRange.textContent = `${formatTime(minSeconds)}–${formatTime(maxSeconds)}`;
  speedValue.textContent = speed;
}

/**
 * Save settings (text is excluded).
 */
function saveSettings() {
  const settings = {
    includeSpaces: includeSpaces.checked,
    speed: Number(speedInput.value),
    theme: themeSelect.value,
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
    if (typeof parsed.includeSpaces === "boolean") {
      state.includeSpaces = parsed.includeSpaces;
    }
    if (typeof parsed.speed === "number") {
      state.speed = parsed.speed;
    }
    if (typeof parsed.theme === "string") {
      state.theme = parsed.theme;
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
  const totalChars = countChars(inputText.value, includeSpaces.checked);
  const speed = Number(speedInput.value);
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
    const clamped = Math.min(elapsed, totalDuration);
    const progress = totalDuration > 0 ? clamped / totalDuration : 0;
    const offset = -totalDistance * progress;
    readerText.style.transform = `translateY(${offset}px)`;
    updateReaderTimer(Math.floor(clamped), totalDuration);
    if (elapsed < totalDuration) {
      animationId = requestAnimationFrame(tick);
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
  reader.classList.add("active");
  isPlaying = false;
  playPauseBtn.textContent = "Плей";
  readerText.textContent = inputText.value;
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

loadSettings();

includeSpaces.checked = state.includeSpaces;
speedInput.value = state.speed;
themeSelect.value = state.theme;

updateCounts();
applyTheme();

inputText.addEventListener("input", updateCounts);
includeSpaces.addEventListener("change", () => {
  updateCounts();
  saveSettings();
});
speedInput.addEventListener("input", () => {
  updateCounts();
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

document.addEventListener("keydown", (event) => {
  if (!reader.classList.contains("active")) {
    return;
  }
  if (event.code === "Space") {
    event.preventDefault();
    togglePlay();
  }
});
