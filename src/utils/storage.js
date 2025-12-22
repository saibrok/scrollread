export const STORAGE_KEY = 'scrollread_settings_v1';

export const DEFAULTS = {
    speed: 800,
    theme: 'system',
    readerFontSize: 32,
    readerFont: "'Rubik', 'Segoe UI', Arial, sans-serif",
    readerAlign: 'left',
    readerPadding: 120,
    readerBrightness: 100,
    readerContrast: 100,
    readerSepia: 0,
    readerOverlaySize: 3,
    readerOverlayOpacity: 75,
    readerLineHeight: 1.6,
    readerParagraphGap: 0.6,
};

const THEME_MAP = {
    dark: 'dark-gray',
    light: 'light-gray',
};

/**
 * Load settings from localStorage.
 * @returns {typeof DEFAULTS}
 */
export function loadSettings() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        return { ...DEFAULTS };
    }
    try {
        const parsed = JSON.parse(saved);
        const themeValue = parsed.theme ?? parsed.readerTheme;
        const normalizedTheme = THEME_MAP[themeValue] || themeValue || DEFAULTS.theme;

        return { ...DEFAULTS, ...parsed, theme: normalizedTheme };
    } catch (error) {
        console.warn('Settings parse error', error);

        return { ...DEFAULTS };
    }
}

/**
 * Save settings to localStorage.
 * @param {typeof DEFAULTS} settings
 */
export function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

