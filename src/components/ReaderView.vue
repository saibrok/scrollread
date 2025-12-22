<script setup>
import { computed, inject, ref, watch } from 'vue';

import { formatTime, toParagraphs } from '../utils/text';
import { useReaderPlayer } from '../composables/useReaderPlayer';
import { useReaderShortcuts } from '../composables/useReaderShortcuts';

import ReaderHeader from './ReaderHeader.vue';
import ReaderHelp from './ReaderHelp.vue';
import ReaderPanel from './ReaderPanel.vue';

const props = defineProps({
    open: {
        type: Boolean,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['close']);

const settings = inject('settings');
const resetSettings = inject('resetSettings');

const readerStage = ref(null);
const readerText = ref(null);
const helpOpen = ref(false);

const readerThemeClass = computed(() => `reader--theme-${settings.theme || 'system'}`);

const readerStyle = computed(() => {
    return {
        '--reader-font-size': `${settings.readerFontSize}px`,
        '--reader-font': settings.readerFont,
        '--reader-brightness': `${settings.readerBrightness}%`,
        '--reader-contrast': `${settings.readerContrast}%`,
        '--reader-sepia': `${settings.readerSepia}%`,
        '--reader-overlay-opacity': settings.readerOverlayOpacity / 100,
        '--read-band': `${settings.readerOverlaySize}em`,
        '--read-line-height': settings.readerLineHeight,
        '--read-paragraph-gap': `${settings.readerParagraphGap}em`,
        '--read-padding': `${settings.readerPadding}px`,
    };
});

const readerHtml = computed(() => toParagraphs(props.text));

const { isPlaying, currentSeconds, totalDuration, togglePlay, pauseScroll, jumpToEdge, recalcMetricsPreservePosition, initReader, handleWheel } =
    useReaderPlayer({
        getText: () => props.text,
        getSpeed: () => settings.speed,
        stageRef: readerStage,
        textRef: readerText,
    });

const timerText = computed(() => {
    return `${formatTime(currentSeconds.value)} / ${formatTime(totalDuration.value)}`;
});

function updateSetting({ key, value }) {
    settings[key] = value;
}

function openHelp() {
    helpOpen.value = true;
}

function closeHelp() {
    helpOpen.value = false;
}

function handleReset() {
    if (typeof resetSettings === 'function') {
        resetSettings();
    }
    recalcMetricsPreservePosition();
}

function handleClose() {
    pauseScroll();
    helpOpen.value = false;
    emit('close');
}

function handleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

watch(
    () => props.open,
    (value) => {
        if (value) {
            isPlaying.value = false;
            helpOpen.value = false;
            initReader();
        } else {
            pauseScroll();
        }
    },
);

watch(
    () => props.text,
    () => {
        if (props.open) {
            initReader();
        }
    },
);

watch(
    () => [
        settings.speed,
        settings.readerFontSize,
        settings.readerFont,
        settings.readerLineHeight,
        settings.readerParagraphGap,
        settings.readerPadding,
        settings.readerOverlaySize,
    ],
    () => {
        if (props.open) {
            recalcMetricsPreservePosition();
        }
    },
);

useReaderShortcuts({
    isOpen: () => props.open,
    settings,
    togglePlay,
    jumpToEdge,
    handleFullscreen,
    handleClose,
    openHelp,
    recalcMetrics: recalcMetricsPreservePosition,
});
</script>

<template>
    <div
        class="reader"
        :class="[{ active: props.open }, readerThemeClass]"
        :style="readerStyle"
    >
        <ReaderHeader
            :is-playing="isPlaying"
            :timer-text="timerText"
            @toggle-play="togglePlay"
            @fullscreen="handleFullscreen"
            @jump-end="() => jumpToEdge(true)"
            @reset="handleReset"
            @help="openHelp"
            @close="handleClose"
        />
        <ReaderPanel
            :settings="settings"
            @update="updateSetting"
        />
        <div class="reader-body">
            <div
                class="reader-overlay reader-overlay-top"
                aria-hidden="true"
            ></div>
            <div
                ref="readerStage"
                class="reader-stage"
                @wheel="handleWheel"
            >
                <div
                    ref="readerText"
                    class="reader-text"
                    v-html="readerHtml"
                ></div>
            </div>
            <div
                class="reader-overlay reader-overlay-bottom"
                aria-hidden="true"
            ></div>
        </div>
        <ReaderHelp
            :open="helpOpen"
            @close="closeHelp"
        />
    </div>
</template>
