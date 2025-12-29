import { reactive, watch } from 'vue';

import { loadThemeSettings, saveThemeSettings, THEME_DEFAULTS } from '../utils/storage';

let themeStore = null;

export function useTheme() {
    if (themeStore) {
        return themeStore;
    }

    const themeSettings = reactive(loadThemeSettings());

    function resetThemeSettings() {
        Object.assign(themeSettings, THEME_DEFAULTS);
    }

    watch(
        themeSettings,
        () => {
            saveThemeSettings({ ...themeSettings });
        },
        { deep: true },
    );

    themeStore = { themeSettings, resetThemeSettings };

    return themeStore;
}
