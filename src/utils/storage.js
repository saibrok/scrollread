export const READER_STORAGE_KEY = 'reader_settings';
export const THEME_STORAGE_KEY = 'theme_settings';
export const SAVED_TEXTS_KEY = 'saved_texts';

export const READER_DEFAULTS = {
    speed: 800,
    fontSize: 32,
    font: "'EB Garamond', 'Times New Roman', serif",
    align: 'left',
    padding: 120,
    brightness: 100,
    contrast: 100,
    sepia: 0,
    overlaySize: 3,
    overlayOpacity: 75,
    lineHeight: 1.6,
    paragraphGap: 0.6,
    indent: 1,
    startDelay: 0,
    showMinimap: true,
};

export const THEME_DEFAULTS = {
    themeTone: 'light',
    themePalette: 'gray-medium',
};

/**
 * Load reader settings from localStorage.
 * @returns {typeof READER_DEFAULTS}
 */
export function loadReaderSettings() {
    const saved = localStorage.getItem(READER_STORAGE_KEY);

    if (!saved) {
        return { ...READER_DEFAULTS };
    }
    try {
        const parsed = JSON.parse(saved);

        return { ...READER_DEFAULTS, ...parsed };
    } catch (error) {
        console.warn('Reader settings parse error', error);

        return { ...READER_DEFAULTS };
    }
}

/**
 * Save reader settings to localStorage.
 * @param {typeof READER_DEFAULTS} settings
 */
export function saveReaderSettings(settings) {
    localStorage.setItem(READER_STORAGE_KEY, JSON.stringify(settings));
}

/**
 * Load theme settings from localStorage.
 * @returns {typeof THEME_DEFAULTS}
 */
export function loadThemeSettings() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);

    if (!saved) {
        return { ...THEME_DEFAULTS };
    }
    try {
        const parsed = JSON.parse(saved);

        return { ...THEME_DEFAULTS, ...parsed };
    } catch (error) {
        console.warn('Theme settings parse error', error);

        return { ...THEME_DEFAULTS };
    }
}

/**
 * Save theme settings to localStorage.
 * @param {typeof THEME_DEFAULTS} settings
 */
export function saveThemeSettings(settings) {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings));
}

/**
 * Load saved texts from localStorage.
 * @returns {{ id: string, text: string, savedAt: string }[]}
 */
export function loadSavedTexts() {
    const saved = localStorage.getItem(SAVED_TEXTS_KEY);

    if (!saved) {
        return [];
    }
    try {
        const parsed = JSON.parse(saved);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter((item) => item && typeof item.id === 'string' && typeof item.text === 'string' && typeof item.savedAt === 'string');
    } catch (error) {
        console.warn('Text saves parse error', error);

        return [];
    }
}

/**
 * Save texts to localStorage.
 * @param {{ id: string, text: string, savedAt: string }[]} saves
 */
export function saveSavedTexts(saves) {
    localStorage.setItem(SAVED_TEXTS_KEY, JSON.stringify(saves));
}
