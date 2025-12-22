<script setup>
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { formatTime, toParagraphs } from '../utils/text';
import { useReaderPlayer } from '../composables/useReaderPlayer';
import { useReaderShortcuts } from '../composables/useReaderShortcuts';

import ReaderHeader from './ReaderHeader.vue';
import ReaderHelp from './ReaderHelp.vue';
import ReaderPanel from './ReaderPanel.vue';
import ReaderResetConfirm from './ReaderResetConfirm.vue';

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
const resetOpen = ref(false);
const isFullscreen = ref(false);
const sessionSeconds = ref(0);
let sessionStart = 0;
let sessionAccumulated = 0;
let sessionTimerId = null;

const readerStyle = computed(() => {
    return {
        '--reader-font-size': `${settings.fontSize}px`,
        '--reader-font': settings.font,
        '--reader-brightness': `${settings.brightness}%`,
        '--reader-contrast': `${settings.contrast}%`,
        '--reader-sepia': `${settings.sepia}%`,
        '--reader-overlay-opacity': settings.overlayOpacity / 100,
        '--read-band': `${settings.overlaySize}em`,
        '--read-line-height': settings.lineHeight,
        '--read-paragraph-gap': `${settings.paragraphGap}em`,
        '--read-padding': `${settings.padding}px`,
        '--reader-align': settings.align,
        '--reader-indent': settings.align === 'center' ? '0em' : `${settings.indent}em`,
    };
});

const readerHtml = computed(() => toParagraphs(props.text));

const speedMultiplier = ref(1);

const { isPlaying, currentSeconds, totalDuration, togglePlay, pauseScroll, jumpToEdge, recalcMetricsPreservePosition, initReader, handleWheel } =
    useReaderPlayer({
        getText: () => props.text,
        getSpeed: () => settings.speed * speedMultiplier.value,
        stageRef: readerStage,
        textRef: readerText,
    });

const timerText = computed(() => {
    return `${formatTime(currentSeconds.value)} / ${formatTime(totalDuration.value)}`;
});

const sessionTimerText = computed(() => formatTime(sessionSeconds.value));

function updateSetting({ key, value }) {
    settings[key] = value;
}

function handlePanelToggle() {
    if (props.open) {
        recalcMetricsPreservePosition();
    }
}
function setSpeedMultiplier(multiplier) {
    speedMultiplier.value = multiplier || 1;
    recalcMetricsPreservePosition();
}

const speedMultiplierLabel = computed(() => {
    if (speedMultiplier.value === 2) {
        return 'x2';
    }
    if (speedMultiplier.value === 0.5) {
        return 'x0.5';
    }

    return '';
});

function openHelp() {
    helpOpen.value = true;
}

function closeHelp() {
    helpOpen.value = false;
}

function handleReset() {
    resetOpen.value = true;
}

function closeReset() {
    resetOpen.value = false;
}

function confirmReset() {
    if (typeof resetSettings === 'function') {
        resetSettings();
    }
    recalcMetricsPreservePosition();
    resetOpen.value = false;
}

function handleClose() {
    pauseScroll();
    helpOpen.value = false;
    resetOpen.value = false;
    speedMultiplier.value = 1;
    resetSessionTimer();
    emit('close');
}

function handleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function syncFullscreen() {
    isFullscreen.value = Boolean(document.fullscreenElement);
}

watch(
    () => props.open,
    (value) => {
        if (value) {
            isPlaying.value = false;
            helpOpen.value = false;
            resetOpen.value = false;
            speedMultiplier.value = 1;
            resetSessionTimer();
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
        settings.fontSize,
        settings.font,
        settings.lineHeight,
        settings.paragraphGap,
        settings.padding,
        settings.overlaySize,
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
    setSpeedMultiplier,
    togglePlay,
    jumpToEdge,
    handleFullscreen,
    handleClose,
    isHelpOpen: () => helpOpen.value,
    closeHelp,
    recalcMetrics: recalcMetricsPreservePosition,
});

onMounted(() => {
    syncFullscreen();
    document.addEventListener('fullscreenchange', syncFullscreen);
});

onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', syncFullscreen);
});

function startSessionTimer() {
    if (sessionTimerId) {
        return;
    }
    sessionStart = performance.now();
    sessionTimerId = window.setInterval(() => {
        const elapsed = (performance.now() - sessionStart) / 1000;
        sessionSeconds.value = Math.floor(sessionAccumulated + elapsed);
    }, 250);
}

function stopSessionTimer() {
    if (!sessionTimerId) {
        return;
    }
    sessionAccumulated += (performance.now() - sessionStart) / 1000;
    sessionSeconds.value = Math.floor(sessionAccumulated);
    sessionStart = 0;
    clearInterval(sessionTimerId);
    sessionTimerId = null;
}

function resetSessionTimer() {
    if (sessionTimerId) {
        clearInterval(sessionTimerId);
    }
    sessionTimerId = null;
    sessionStart = 0;
    sessionAccumulated = 0;
    sessionSeconds.value = 0;
}

watch(
    isPlaying,
    (value) => {
        if (value) {
            startSessionTimer();
        } else {
            stopSessionTimer();
        }
    },
    { immediate: false },
);
</script>

<template>
    <div
        class="reader"
        :class="{ active: props.open }"
        :style="readerStyle"
    >
        <ReaderHeader
            :is-playing="isPlaying"
            :timer-text="timerText"
            :session-timer-text="sessionTimerText"
            :is-fullscreen="isFullscreen"
            :theme-tone="settings.themeTone"
            :theme-palette="settings.themePalette"
            @toggle-play="togglePlay"
            @fullscreen="handleFullscreen"
            @update:theme-tone="(value) => updateSetting({ key: 'themeTone', value })"
            @update:theme-palette="(value) => updateSetting({ key: 'themePalette', value })"
            @reset="handleReset"
            @help="openHelp"
            @close="handleClose"
        />
        <ReaderPanel
            :settings="settings"
            :speed-multiplier-label="speedMultiplierLabel"
            @update="updateSetting"
            @toggle="handlePanelToggle"
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
        <ReaderResetConfirm
            :open="resetOpen"
            @close="closeReset"
            @confirm="confirmReset"
        />
    </div>
</template>

