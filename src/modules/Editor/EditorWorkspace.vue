<script setup>
import { computed, ref } from 'vue';

import { useReaderSettings } from '../../composables/useReaderSettings';
import { useTextStore } from '../../composables/useTextStore';
import { countChars, formatTime } from '../../utils/text';

import EditorControls from './components/EditorControls.vue';
import EditorSaveModals from './components/EditorSaveModals.vue';
import EditorTextPanel from './components/EditorTextPanel.vue';

const emit = defineEmits(['start']);

const { readerSettings } = useReaderSettings();
const { text, savedTexts } = useTextStore();
const selectedSaveId = ref('');
const saveConfirmOpen = ref(false);
const loadConfirmOpen = ref(false);
const deleteConfirmOpen = ref(false);

const canStart = computed(() => text.value.trim().length > 0);
const canSave = computed(() => text.value.trim().length > 0);
const canLoad = computed(() => {
    if (!selectedSaveId.value) {
        return false;
    }

    return savedTexts.value.some((save) => save.id === selectedSaveId.value);
});

const timeRange = computed(() => {
    const speed = readerSettings.speed;
    const withSpaces = countChars(text.value, true);

    const totalSeconds = Math.ceil((withSpaces / speed) * 60);

    return formatTime(totalSeconds);
});

const saveOptions = computed(() =>
    savedTexts.value.map((entry) => ({
        value: entry.id,
        text: formatSaveLabel(entry),
    })),
);

function updateText(value) {
    text.value = value;
}

function updateSpeed(value) {
    readerSettings.speed = value;
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

    savedTexts.value = [entry, ...savedTexts.value];
    selectedSaveId.value = id;
}

function overwriteSave(id, textValue) {
    const index = savedTexts.value.findIndex((save) => save.id === id);

    if (index === -1) {
        createSave(textValue);

        return;
    }

    const entry = {
        ...savedTexts.value[index],
        text: textValue,
        savedAt: new Date().toISOString(),
    };

    const next = [...savedTexts.value];

    next.splice(index, 1);
    savedTexts.value = [entry, ...next];
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
    const entry = savedTexts.value.find((save) => save.id === selectedSaveId.value);

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

    savedTexts.value = savedTexts.value.filter((save) => save.id !== selectedSaveId.value);
    selectedSaveId.value = '';
    deleteConfirmOpen.value = false;
}
</script>

<template>
    <section
        id="editor"
        class="card"
    >
        <EditorTextPanel
            :text="text"
            :save-items="saveOptions"
            :selected-save-id="selectedSaveId"
            :can-save="canSave"
            :can-load="canLoad"
            @update:text="updateText"
            @save="handleSaveRequest"
            @load="handleLoadRequest"
            @select-save="handleSaveSelect"
            @delete-save="handleDeleteSave"
        />
        <EditorControls
            :text="text"
            :speed="readerSettings.speed"
            :time-range="timeRange"
            :can-start="canStart"
            @update:speed="updateSpeed"
            @start="emit('start')"
        />
        <EditorSaveModals
            :save-confirm-open="saveConfirmOpen"
            :load-confirm-open="loadConfirmOpen"
            :delete-confirm-open="deleteConfirmOpen"
            @close-save-confirm="saveConfirmOpen = false"
            @confirm-save-overwrite="handleSaveOverwrite"
            @confirm-save-new="handleSaveNew"
            @close-load-confirm="loadConfirmOpen = false"
            @confirm-load-replace="handleLoadReplace"
            @close-delete-confirm="deleteConfirmOpen = false"
            @confirm-delete-save="handleDeleteConfirm"
        />
    </section>
</template>
