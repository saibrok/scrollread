export const STORAGE_KEY = 'scrollread_settings';
export const TEXT_SAVES_KEY = 'scrollread_text_saves';

export const DEFAULTS = {
    speed: 800,
    themeTone: 'light',
    themePalette: 'gray-medium',
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

        return { ...DEFAULTS, ...parsed };
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

/**
 * Load saved texts from localStorage.
 * @returns {{ id: string, text: string, savedAt: string }[]}
 */
export function loadTextSaves() {
    const saved = localStorage.getItem(TEXT_SAVES_KEY);

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
export function saveTextSaves(saves) {
    localStorage.setItem(TEXT_SAVES_KEY, JSON.stringify(saves));
}
