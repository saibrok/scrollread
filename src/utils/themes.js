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

const THEME_NAME_MAP = {
    dark: {
        'gray-hard': 'gray-hard-dark',
        'gray-medium': 'gray-medium-dark',
        'gray-light': 'gray-light-dark',
        sage: 'sage-dark',
        sand: 'sand-dark',
        sky: 'sky-dark',
        blush: 'blush-dark',
        violet: 'violet-dark',
    },
    light: {
        'gray-hard': 'gray-hard-light',
        'gray-medium': 'gray-medium-light',
        'gray-light': 'gray-light-light',
        sage: 'sage',
        sand: 'sand',
        sky: 'sky',
        blush: 'blush',
        violet: 'violet',
    },
};

export const THEME_CLASS_NAMES = [
    'theme-gray-hard-dark',
    'theme-gray-hard-light',
    'theme-gray-medium-dark',
    'theme-gray-medium-light',
    'theme-gray-light-dark',
    'theme-gray-light-light',
    'theme-sage',
    'theme-sand',
    'theme-sky',
    'theme-blush',
    'theme-violet',
    'theme-sage-dark',
    'theme-sand-dark',
    'theme-sky-dark',
    'theme-blush-dark',
    'theme-violet-dark',
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
    const toneMap = THEME_NAME_MAP[tone];

    if (!toneMap) {
        return THEME_NAME_MAP.light['gray-medium'];
    }

    return toneMap[palette] || toneMap['gray-medium'];
}
