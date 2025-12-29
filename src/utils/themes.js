export const THEME_TONE_OPTIONS = [
    { value: 'dark', text: 'Темная' },
    { value: 'light', text: 'Светлая' },
];

const PALETTES = [
    { value: 'gray-hard', text: 'Графит' },
    { value: 'gray-medium', text: 'Серый' },
    { value: 'gray-light', text: 'Туман' },
    { value: 'sage', text: 'Шалфей' },
    { value: 'sand', text: 'Песок' },
    { value: 'sky', text: 'Небо' },
    { value: 'blush', text: 'Румянец' },
    { value: 'violet', text: 'Фиолет' },
];

export const THEME_PALETTE_OPTIONS = PALETTES;

export const THEME_CLASS_NAMES = [
    'theme-gray-hard',
    'theme-gray-medium',
    'theme-gray-light',
    'theme-sage',
    'theme-sand',
    'theme-sky',
    'theme-blush',
    'theme-violet',
];

export function getPaletteOptions() {
    return PALETTES;
}

export function normalizePalette(tone, palette) {
    const available = getPaletteOptions().map((item) => item.value);

    if (available.includes(palette)) {
        return palette;
    }

    return 'gray-medium';
}

export function resolveThemeName(tone, palette) {
    const available = getPaletteOptions().map((item) => item.value);

    if (!available.includes(palette)) {
        return 'gray-medium';
    }

    return palette;
}
