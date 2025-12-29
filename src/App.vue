<script setup>
import { computed, onMounted, provide, reactive, ref, watch } from 'vue';

import { DEFAULTS, loadSettings, loadTextSaves, saveSettings, saveTextSaves } from './utils/storage';
import { countChars, countWords, formatTime } from './utils/text';
import { normalizePalette, resolveThemeName, THEME_CLASS_NAMES } from './utils/themes';

import EditorView from './components/EditorView.vue';
import ReaderView from './components/ReaderView.vue';

const text = ref('');
const settings = reactive(loadSettings());
const readerOpen = ref(false);
const textSaves = ref(loadTextSaves());
const selectedSaveId = ref('');
const saveConfirmOpen = ref(false);
const loadConfirmOpen = ref(false);
const deleteConfirmOpen = ref(false);

const stats = computed(() => {
    return {
        words: countWords(text.value),
        chars: countChars(text.value, true),
        charsNoSpaces: countChars(text.value, false),
    };
});

const timeRange = computed(() => {
    const speed = settings.speed;
    const withSpaces = countChars(text.value, true);

    const totalSeconds = Math.ceil((withSpaces / speed) * 60);

    return formatTime(totalSeconds);
});

const canStart = computed(() => text.value.trim().length > 0);
const canSave = computed(() => text.value.trim().length > 0);
const canLoad = computed(() => {
    if (!selectedSaveId.value) {
        return false;
    }

    return textSaves.value.some((save) => save.id === selectedSaveId.value);
});

const saveOptions = computed(() =>
    textSaves.value.map((entry) => ({
        value: entry.id,
        text: formatSaveLabel(entry),
    })),
);

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
    const { themeTone, themePalette } = settings;

    Object.assign(settings, DEFAULTS, { themeTone, themePalette });
}

function applyTheme(tone, palette) {
    const normalizedPalette = normalizePalette(tone, palette);
    const themeName = resolveThemeName(tone, normalizedPalette);

    document.body.classList.remove(...THEME_CLASS_NAMES);
    document.body.classList.add(`theme-${themeName}`);
    document.body.classList.toggle('dark', tone === 'dark');
}

provide('settings', settings);
provide('resetSettings', resetSettings);

onMounted(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (!['dark', 'light'].includes(settings.themeTone)) {
        settings.themeTone = prefersDark ? 'dark' : 'light';
    }

    applyTheme(settings.themeTone, settings.themePalette);
});

watch(
    () => [settings.themeTone, settings.themePalette],
    ([tone, palette]) => {
        const normalizedPalette = normalizePalette(tone, palette);

        if (normalizedPalette !== palette) {
            settings.themePalette = normalizedPalette;
        }
        applyTheme(tone, normalizedPalette);
    },
);

function updateText(value) {
    text.value = value;
}

function updateSpeed(value) {
    settings.speed = value;
}

function updateThemeTone(value) {
    settings.themeTone = value;
}

function updateThemePalette(value) {
    settings.themePalette = value;
}

function normalizePreview(value) {
    return value.replace(/\s+/g, ' ').trim();
}

function formatSaveLabel(entry) {
    const preview = normalizePreview(entry.text);
    const shortPreview = preview.slice(0, 50);
    const suffix = preview.length > 50 ? '...' : '';
    const savedAt = new Date(entry.savedAt);
    const dateLabel = Number.isNaN(savedAt.getTime())
        ? ''
        : savedAt.toLocaleString('ru-RU', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
          });

    return `${shortPreview}${suffix}${dateLabel ? ` - ${dateLabel}` : ''}`;
}

function createSave(textValue) {
    const id = `${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
    const entry = {
        id,
        text: textValue,
        savedAt: new Date().toISOString(),
    };

    textSaves.value = [entry, ...textSaves.value];
    selectedSaveId.value = id;
}

function overwriteSave(id, textValue) {
    const index = textSaves.value.findIndex((save) => save.id === id);

    if (index === -1) {
        createSave(textValue);

        return;
    }

    const entry = {
        ...textSaves.value[index],
        text: textValue,
        savedAt: new Date().toISOString(),
    };

    const next = [...textSaves.value];

    next.splice(index, 1);
    textSaves.value = [entry, ...next];
    selectedSaveId.value = entry.id;
}

function handleSaveRequest() {
    if (!canSave.value) {
        return;
    }

    if (selectedSaveId.value) {
        saveConfirmOpen.value = true;

        return;
    }

    createSave(text.value);
}

function handleSaveOverwrite() {
    if (!selectedSaveId.value) {
        saveConfirmOpen.value = false;

        return;
    }

    overwriteSave(selectedSaveId.value, text.value);
    saveConfirmOpen.value = false;
}

function handleSaveNew() {
    createSave(text.value);
    saveConfirmOpen.value = false;
}

function handleLoadRequest() {
    if (!canLoad.value) {
        return;
    }

    if (text.value.trim().length) {
        loadConfirmOpen.value = true;

        return;
    }

    handleLoadReplace();
}

function handleLoadReplace() {
    const entry = textSaves.value.find((save) => save.id === selectedSaveId.value);

    if (entry) {
        text.value = entry.text;
    }
    loadConfirmOpen.value = false;
}

function handleSaveSelect(value) {
    selectedSaveId.value = value;
}

function handleDeleteSave() {
    if (!selectedSaveId.value) {
        return;
    }

    deleteConfirmOpen.value = true;
}

function handleDeleteConfirm() {
    if (!selectedSaveId.value) {
        deleteConfirmOpen.value = false;

        return;
    }

    textSaves.value = textSaves.value.filter((save) => save.id !== selectedSaveId.value);
    selectedSaveId.value = '';
    deleteConfirmOpen.value = false;
}

watch(
    settings,
    () => {
        saveSettings({ ...settings });
    },
    { deep: true },
);

watch(
    textSaves,
    () => {
        saveTextSaves(textSaves.value);
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
        :theme-tone="settings.themeTone"
        :theme-palette="settings.themePalette"
        :can-start="canStart"
        :save-items="saveOptions"
        :selected-save-id="selectedSaveId"
        :save-confirm-open="saveConfirmOpen"
        :load-confirm-open="loadConfirmOpen"
        :delete-confirm-open="deleteConfirmOpen"
        :can-save="canSave"
        :can-load="canLoad"
        @update:text="updateText"
        @update:speed="updateSpeed"
        @update:theme-tone="updateThemeTone"
        @update:theme-palette="updateThemePalette"
        @start="openReader"
        @save="handleSaveRequest"
        @load="handleLoadRequest"
        @select-save="handleSaveSelect"
        @close-save-confirm="saveConfirmOpen = false"
        @confirm-save-overwrite="handleSaveOverwrite"
        @confirm-save-new="handleSaveNew"
        @close-load-confirm="loadConfirmOpen = false"
        @confirm-load-replace="handleLoadReplace"
        @delete-save="handleDeleteSave"
        @close-delete-confirm="deleteConfirmOpen = false"
        @confirm-delete-save="handleDeleteConfirm"
    />
    <ReaderView
        :open="readerOpen"
        :text="text"
        @close="closeReader"
    />
</template>
