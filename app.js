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
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
let isPlaying = true;

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
 * @param {number} totalSeconds
 */
function updateReaderTimer(totalSeconds) {
  readerTimer.textContent = `0:00 / ${formatTime(totalSeconds)}`;
}

/**
 * Open reader mode.
 */
function openReader() {
  reader.classList.add("active");
  isPlaying = true;
  playPauseBtn.textContent = "Пауза";
  const totalChars = countChars(inputText.value, includeSpaces.checked);
  const totalSeconds = Math.ceil((totalChars / Number(speedInput.value)) * 60);
  updateReaderTimer(totalSeconds);
}

/**
 * Close reader mode.
 */
function closeReader() {
  reader.classList.remove("active");
}

/**
 * Toggle play/pause state.
 */
function togglePlay() {
  isPlaying = !isPlaying;
  playPauseBtn.textContent = isPlaying ? "Пауза" : "Плей";
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
