export const FAVORITE_GROUPS = [
    {
        id: 'tempo',
        title: 'Темп',
        keys: ['speed', 'startDelay', 'speedMultiplier'],
    },
    {
        id: 'time',
        title: 'Время',
        keys: ['sessionTime', 'estimateTime'],
    },
    {
        id: 'text',
        title: 'Текст',
        keys: ['fontSize', 'lineHeight', 'textWidth', 'paragraphGap', 'indent', 'font', 'align'],
    },
    {
        id: 'window',
        title: 'Окно',
        keys: ['overlaySize', 'overlayOpacity'],
    },
    {
        id: 'screen',
        title: 'Экран',
        keys: ['brightness', 'contrast', 'sepia'],
    },
    {
        id: 'minimap',
        title: 'Миникарта',
        keys: ['showMinimap', 'minimapWidth', 'minimapScale'],
    },
];

export const FAVORITE_KEYS = FAVORITE_GROUPS.flatMap((group) => group.keys);

export function normalizeFavorites(favorites) {
    const normalized = FAVORITE_KEYS.reduce((acc, key) => {
        acc[key] = false;

        return acc;
    }, {});

    const legacyMap = { padding: 'textWidth' };

    if (Array.isArray(favorites)) {
        favorites.forEach((key) => {
            if (typeof key === 'string' && key in normalized) {
                normalized[key] = true;
            } else if (typeof key === 'string' && key in legacyMap) {
                normalized[legacyMap[key]] = true;
            }
        });

        return normalized;
    }

    if (favorites && typeof favorites === 'object') {
        Object.entries(favorites).forEach(([key, value]) => {
            if (key in normalized) {
                normalized[key] = Boolean(value);
            } else if (key in legacyMap) {
                normalized[legacyMap[key]] = Boolean(value);
            }
        });
    }

    return normalized;
}
