<script setup>
import { onMounted, ref, watch } from 'vue';

import { normalizePalette, resolveThemeName, THEME_CLASS_NAMES } from './utils/themes';
import { useTheme } from './composables/useTheme';

import ReaderView from './modules/Reader/ReaderView.vue';
import MainPage from './pages/MainPage.vue';

const readerRef = ref(null);
const { themeSettings } = useTheme();

function handleStart() {
    readerRef.value?.openReader?.();
}

function applyTheme(tone, palette) {
    const normalizedPalette = normalizePalette(tone, palette);
    const themeName = resolveThemeName(tone, normalizedPalette);

    document.body.classList.remove(...THEME_CLASS_NAMES);
    document.body.classList.add(`theme-${themeName}`);
    document.body.classList.toggle('dark', tone === 'dark');
}

onMounted(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (!['dark', 'light'].includes(themeSettings.themeTone)) {
        themeSettings.themeTone = prefersDark ? 'dark' : 'light';
    }

    applyTheme(themeSettings.themeTone, themeSettings.themePalette);
});

watch(
    () => [themeSettings.themeTone, themeSettings.themePalette],
    ([tone, palette]) => {
        const normalizedPalette = normalizePalette(tone, palette);

        if (normalizedPalette !== palette) {
            themeSettings.themePalette = normalizedPalette;
        }
        applyTheme(tone, normalizedPalette);
    },
);
</script>

<template>
    <MainPage @start="handleStart" />
    <ReaderView ref="readerRef" />
</template>
