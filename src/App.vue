<script setup>
import { computed, onBeforeUnmount, onMounted, provide, reactive, ref, watch } from 'vue';

import { DEFAULTS, loadSettings, saveSettings } from './utils/storage';
import { countChars, countWords, formatTime } from './utils/text';

import EditorView from './components/EditorView.vue';
import ReaderView from './components/ReaderView.vue';

const text = ref('');
const settings = reactive(loadSettings());
const readerOpen = ref(false);

const stats = computed(() => {
    return {
        words: countWords(text.value),
        chars: countChars(text.value, true),
        charsNoSpaces: countChars(text.value, false),
    };
});

const timeRange = computed(() => {
    const speed = settings.speed;
    const withoutSpaces = countChars(text.value, false);
    const withSpaces = countChars(text.value, true);
    const minSeconds = Math.ceil((withoutSpaces / speed) * 60);
    const maxSeconds = Math.ceil((withSpaces / speed) * 60);

    return `${formatTime(minSeconds)}-${formatTime(maxSeconds)}`;
});

const canStart = computed(() => text.value.trim().length > 0);

function openReader() {
    if (!canStart.value) {
        return;
    }
    readerOpen.value = true;
}

function closeReader() {
    readerOpen.value = false;
}

function resetSettings() {
    Object.assign(settings, DEFAULTS);
}

const themeClasses = ['theme-system', 'theme-dark-gray', 'theme-light-gray', 'theme-sepia', 'theme-paper'];

function applyTheme(theme) {
    const nextTheme = theme || 'system';

    document.body.classList.remove(...themeClasses);
    document.body.classList.add(`theme-${nextTheme}`);
}

provide('settings', settings);
provide('resetSettings', resetSettings);

let mediaQuery = null;
let handleMediaChange = null;

onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    applyTheme(settings.theme);
    handleMediaChange = () => {
        if (settings.theme === 'system') {
            applyTheme(settings.theme);
        }
    };
    mediaQuery.addEventListener('change', handleMediaChange);
});

onBeforeUnmount(() => {
    if (mediaQuery && handleMediaChange) {
        mediaQuery.removeEventListener('change', handleMediaChange);
    }
});

watch(
    () => settings.theme,
    (theme) => {
        applyTheme(theme);
    },
);

function updateText(value) {
    text.value = value;
}

function updateSpeed(value) {
    settings.speed = value;
}

function updateTheme(value) {
    settings.theme = value;
}

watch(
    settings,
    () => {
        saveSettings({ ...settings });
    },
    { deep: true },
);
</script>

<template>
    <EditorView
        :text="text"
        :stats="stats"
        :speed="settings.speed"
        :time-range="timeRange"
        :theme="settings.theme"
        :can-start="canStart"
        @update:text="updateText"
        @update:speed="updateSpeed"
        @update:theme="updateTheme"
        @start="openReader"
    />
    <ReaderView
        :open="readerOpen"
        :text="text"
        @close="closeReader"
    />
</template>
