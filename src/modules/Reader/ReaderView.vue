<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { useReaderPlayer } from '../../composables/useReaderPlayer';
import { useReaderSettings } from '../../composables/useReaderSettings';
import { useReaderShortcuts } from '../../composables/useReaderShortcuts';
import { useTextStore } from '../../composables/useTextStore';
import { useTheme } from '../../composables/useTheme';
import { formatTime, toParagraphs } from '../../utils/text';
import { getPaletteOptions, THEME_TONE_OPTIONS } from '../../utils/themes';

import SrButton from '../../ui/SrButton.vue';
import SrModal from '../../ui/SrModal.vue';
import SrSelect from '../../ui/SrSelect.vue';
import ReaderHeader from './components/ReaderHeader.vue';
import ReaderHelp from './components/ReaderHelp.vue';
import ReaderMinimap from './components/ReaderMinimap.vue';
import ReaderPanel from './components/ReaderPanel.vue';
import ReaderResetConfirm from './components/ReaderResetConfirm.vue';

const { readerSettings, resetReaderSettings } = useReaderSettings();
const { themeSettings } = useTheme();
const { text } = useTextStore();

const readerStage = ref(null);
const readerText = ref(null);
const isOpen = ref(false);
const helpOpen = ref(false);
const resetOpen = ref(false);
const isFullscreen = ref(false);
const isCompact = ref(false);
const settingsOpen = ref(false);
const themeOpen = ref(false);
const sessionSeconds = ref(0);
let sessionStart = 0;
let sessionAccumulated = 0;
let sessionTimerId = null;
const pendingStartId = ref(null);
const pendingStartSeconds = ref(null);
const pendingStartTickId = ref(null);
const bodyOverflow = ref('');

const showMinimap = computed(() => readerSettings.showMinimap !== false);

const readerStyle = computed(() => {
    const parsedIndent = Number.parseFloat(readerSettings.indent);
    const indentValue = Number.isFinite(parsedIndent) ? parsedIndent : 0;
    const parsedMinimapWidth = Number.parseFloat(readerSettings.minimapWidth);
    const minimapWidthValue = Number.isFinite(parsedMinimapWidth) ? parsedMinimapWidth : 120;

    return {
        '--reader-font-size': `${readerSettings.fontSize}px`,
        '--reader-font': readerSettings.font,
        '--reader-brightness': `${readerSettings.brightness}%`,
        '--reader-contrast': `${readerSettings.contrast}%`,
        '--reader-sepia': `${readerSettings.sepia}%`,
        '--reader-overlay-opacity': readerSettings.overlayOpacity / 100,
        '--read-band': `${readerSettings.overlaySize}em`,
        '--read-line-height': readerSettings.lineHeight,
        '--read-paragraph-gap': `${readerSettings.paragraphGap}em`,
        '--read-padding': `${readerSettings.padding}px`,
        '--reader-align': readerSettings.align,
        '--reader-indent': readerSettings.align === 'center' ? '0em' : `${indentValue}em`,
        '--reader-minimap-width': showMinimap.value ? `${minimapWidthValue}px` : '0px',
    };
});

const readerHtml = computed(() => toParagraphs(text.value));
const paletteOptions = computed(() => getPaletteOptions(themeSettings.themeTone));

const speedMultiplier = ref(1);

const {
    isPlaying,
    currentElapsed,
    currentSeconds,
    totalDuration,
    togglePlay,
    pauseScroll,
    jumpToEdge,
    smoothSeek,
    setProgress,
    recalcMetricsPreservePosition,
    initReader,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
} = useReaderPlayer({
    getText: () => text.value,
    getSpeed: () => readerSettings.speed * speedMultiplier.value,
    stageRef: readerStage,
    textRef: readerText,
});

const timerText = computed(() => {
    return `${formatTime(currentSeconds.value)} / ${formatTime(totalDuration.value)}`;
});

const sessionTimerText = computed(() => formatTime(sessionSeconds.value));
const readerProgress = computed(() => {
    if (totalDuration.value <= 0) {
        return 0;
    }

    return Math.min(1, Math.max(0, currentElapsed.value / totalDuration.value));
});

function updateReaderSetting({ key, value }) {
    readerSettings[key] = value;
}

function updateThemeTone(value) {
    themeSettings.themeTone = value;
}

function updateThemePalette(value) {
    themeSettings.themePalette = value;
}

function handlePanelShortcut() {
    toggleSettingsVisibility();
}
function setSpeedMultiplier(multiplier) {
    speedMultiplier.value = multiplier || 1;
    recalcMetricsPreservePosition();
}

function handleSpeedMultiplier(multiplier) {
    setSpeedMultiplier(multiplier === 1 ? null : multiplier);
}

function handleMinimapSeek({ progress, smooth }) {
    if (smooth) {
        smoothSeek(progress);
    } else {
        setProgress(progress);
    }
}

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
    if (typeof resetReaderSettings === 'function') {
        resetReaderSettings();
    }
    recalcMetricsPreservePosition();
    resetOpen.value = false;
}

function openSettings() {
    settingsOpen.value = true;
}

function closeSettings() {
    settingsOpen.value = false;
}

function toggleSettingsVisibility() {
    settingsOpen.value = !settingsOpen.value;
}

function openTheme() {
    themeOpen.value = true;
}

function closeTheme() {
    themeOpen.value = false;
}

function clearPendingStart() {
    if (pendingStartId.value) {
        clearTimeout(pendingStartId.value);
        pendingStartId.value = null;
    }
    if (pendingStartTickId.value) {
        clearInterval(pendingStartTickId.value);
        pendingStartTickId.value = null;
    }
    pendingStartSeconds.value = null;
}

function getStartDelaySeconds() {
    const parsed = Number(readerSettings.startDelay);

    if (Number.isNaN(parsed)) {
        return 0;
    }

    return Math.min(60, Math.max(0, parsed));
}

function handleTogglePlay() {
    if (isPlaying.value) {
        clearPendingStart();
        togglePlay();

        return;
    }
    if (pendingStartId.value) {
        clearPendingStart();

        return;
    }
    const delay = getStartDelaySeconds();

    if (delay > 0) {
        const startedAt = performance.now();

        pendingStartSeconds.value = delay;
        pendingStartTickId.value = window.setInterval(() => {
            const elapsed = (performance.now() - startedAt) / 1000;
            const remaining = Math.max(0, Math.ceil(delay - elapsed));

            pendingStartSeconds.value = remaining;
        }, 200);
        pendingStartId.value = window.setTimeout(() => {
            pendingStartId.value = null;

            if (pendingStartTickId.value) {
                clearInterval(pendingStartTickId.value);
                pendingStartTickId.value = null;
            }
            pendingStartSeconds.value = null;

            if (!isPlaying.value && isOpen.value) {
                togglePlay();
            }
        }, delay * 1000);

        return;
    }

    togglePlay();
}

function openReader() {
    isOpen.value = true;
}

function closeReader() {
    if (!isOpen.value) {
        return;
    }
    isOpen.value = false;
}

defineExpose({ openReader, closeReader });

function handleClose() {
    clearPendingStart();
    pauseScroll();
    helpOpen.value = false;
    resetOpen.value = false;
    settingsOpen.value = false;
    themeOpen.value = false;
    speedMultiplier.value = 1;
    resetSessionTimer();
    closeReader();
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

function syncCompact(value) {
    isCompact.value = value;
}

function lockBodyScroll() {
    bodyOverflow.value = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
}

function unlockBodyScroll() {
    document.body.style.overflow = bodyOverflow.value;
}

watch(isOpen, (value) => {
    clearPendingStart();

    if (value) {
        lockBodyScroll();
        isPlaying.value = false;
        helpOpen.value = false;
        resetOpen.value = false;
        speedMultiplier.value = 1;
        resetSessionTimer();
        initReader();
    } else {
        unlockBodyScroll();
        pauseScroll();
    }
});

watch(text, () => {
    if (isOpen.value) {
        initReader();
    }
});

watch(
    () => [
        readerSettings.speed,
        readerSettings.fontSize,
        readerSettings.font,
        readerSettings.lineHeight,
        readerSettings.paragraphGap,
        readerSettings.padding,
        readerSettings.overlaySize,
        readerSettings.showMinimap,
    ],
    () => {
        if (isOpen.value) {
            recalcMetricsPreservePosition();
        }
    },
);

useReaderShortcuts({
    isOpen: () => isOpen.value,
    settings: readerSettings,
    setSpeedMultiplier,
    togglePlay: handleTogglePlay,
    isPlaying: () => isPlaying.value,
    jumpToEdge,
    handleFullscreen,
    handleClose,
    togglePanel: handlePanelShortcut,
    isHelpOpen: () => helpOpen.value,
    closeHelp,
    recalcMetrics: recalcMetricsPreservePosition,
});

let compactQuery = null;
let onCompactChange = null;

onMounted(() => {
    syncFullscreen();
    document.addEventListener('fullscreenchange', syncFullscreen);

    compactQuery = window.matchMedia('(max-width: 1480px)');
    syncCompact(compactQuery.matches);
    onCompactChange = (event) => syncCompact(event.matches);
    compactQuery.addEventListener('change', onCompactChange);
});

onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', syncFullscreen);
    clearPendingStart();
    unlockBodyScroll();

    if (compactQuery && onCompactChange) {
        compactQuery.removeEventListener('change', onCompactChange);
    }
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
        :class="{ active: isOpen }"
        :style="readerStyle"
    >
        <ReaderHeader
            :is-playing="isPlaying"
            :is-compact="isCompact"
            :pending-start-seconds="pendingStartSeconds"
            :settings="readerSettings"
            :timer-text="timerText"
            :session-timer-text="sessionTimerText"
            :speed-multiplier="speedMultiplier"
            @toggle-play="handleTogglePlay"
            @update-setting="updateReaderSetting"
            @reset="handleReset"
            @open-settings="openSettings"
            @open-theme="openTheme"
            @speed-multiplier="handleSpeedMultiplier"
            @close="handleClose"
        />
        <div class="reader-body">
            <div class="reader-content">
                <div
                    class="reader-overlay reader-overlay-top"
                    aria-hidden="true"
                ></div>
                <div
                    ref="readerStage"
                    class="reader-stage"
                    @wheel="handleWheel"
                    @touchstart="handleTouchStart"
                    @touchmove.prevent="handleTouchMove"
                    @touchend="handleTouchEnd"
                    @touchcancel="handleTouchEnd"
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
            <div
                v-if="showMinimap"
                class="reader-minimap"
            >
                <ReaderMinimap
                    :html="readerHtml"
                    :progress="readerProgress"
                    :is-playing="isPlaying"
                    :stage-element="readerStage"
                    :text-element="readerText"
                    :scale-factor="readerSettings.minimapScale"
                    @seek="handleMinimapSeek"
                />
            </div>
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
        <SrModal
            :open="themeOpen"
            card-class="sr-modal-card--compact"
            @close="closeTheme"
        >
            <div class="sr-modal-header">
                <div>Тема</div>
                <SrButton
                    class="reader-btn"
                    aria-label="Закрыть"
                    @click="closeTheme"
                >
                    <span
                        class="material-icons"
                        aria-hidden="true"
                    >
                        close
                    </span>
                </SrButton>
            </div>
            <div class="sr-modal-body">
                <div class="reader-settings">
                    <div class="reader-settings__group">
                        <div class="reader-settings__label">Тон</div>
                        <SrSelect
                            :model-value="themeSettings.themeTone"
                            :items="THEME_TONE_OPTIONS"
                            teleport
                            @update:model-value="updateThemeTone"
                        />
                    </div>
                    <div class="reader-settings__group">
                        <div class="reader-settings__label">Цветовая схема</div>
                        <SrSelect
                            :model-value="themeSettings.themePalette"
                            :items="paletteOptions"
                            teleport
                            @update:model-value="updateThemePalette"
                        />
                    </div>
                </div>
            </div>
        </SrModal>
        <SrModal
            :open="settingsOpen"
            modal-class="sr-modal--settings"
            card-class="sr-modal-card--wide"
            @close="closeSettings"
        >
            <div class="sr-modal-header">
                <div>Настройки</div>
                <SrButton
                    class="reader-btn"
                    @click="closeSettings"
                >
                    <span
                        class="material-icons"
                        aria-hidden="true"
                    >
                        close
                    </span>
                </SrButton>
            </div>
            <div class="sr-modal-body">
                <ReaderPanel
                    :settings="readerSettings"
                    :speed-multiplier="speedMultiplier"
                    :is-fullscreen="isFullscreen"
                    :is-compact="isCompact"
                    :show-speed-in-bar="false"
                    :timer-text="timerText"
                    :session-timer-text="sessionTimerText"
                    @update="updateReaderSetting"
                    @fullscreen="handleFullscreen"
                    @help="openHelp"
                    @speed-multiplier="handleSpeedMultiplier"
                />
                <div class="reader-settings__actions">
                    <SrButton
                        class="reader-btn"
                        @click="handleReset"
                    >
                        Сброс настроек
                    </SrButton>
                </div>
            </div>
        </SrModal>
    </div>
</template>

<style scoped>
.reader {
    --reader-font-size: 32px;
    --reader-font: 'Rubik', 'Segoe UI', arial, sans-serif;
    --read-line-height: 1.6;
    --read-paragraph-gap: 0.6em;
    --reader-brightness: 100%;
    --reader-contrast: 100%;
    --reader-sepia: 0%;
    --reader-overlay-opacity: 0.75;
    --read-band: 3.2em;
    --read-padding: 120px;

    position: fixed;
    z-index: 50;
    inset: 0;

    display: none;
    flex-direction: column;

    color: var(--reader-text);

    background: transparent;
}

.reader.active {
    display: flex;
}

.reader-body {
    overflow: hidden;
    display: flex;
    flex: 1;
    min-height: 0;
}

.reader-content {
    position: relative;

    overflow: hidden;
    display: grid;
    grid-template-rows: 1fr calc(var(--read-band) * var(--read-line-height)) 1fr;
    flex: 1;
    align-items: stretch;
    justify-content: stretch;

    min-height: 0;

    font-size: var(--reader-font-size);

    background: var(--reader-bg);
    filter: brightness(var(--reader-brightness)) contrast(var(--reader-contrast)) sepia(var(--reader-sepia));
}

.reader-stage {
    position: relative;

    display: flex;
    align-items: start;

    width: 100%;
    height: 100%;
    min-height: 0;
    padding-inline: var(--read-padding);
}

.reader-text {
    will-change: transform;

    transform: translateY(0);

    width: 100%;
    padding-top: calc(var(--read-band) * var(--read-line-height) / 2 - 1em * var(--read-line-height) + 1em);

    font-family: var(--reader-font);
    line-height: var(--read-line-height);
    text-align: var(--reader-align);
    word-break: break-word;
}

:deep(.reader-text p) {
    margin: 0 0 var(--read-paragraph-gap);
    text-indent: var(--reader-indent);
}

:deep(.reader-text p:last-child) {
    margin-bottom: 0;
}

.reader-overlay {
    pointer-events: none;
    z-index: 10;
    background: rgb(0 0 0 / var(--reader-overlay-opacity));
}

.reader-settings {
    display: grid;
    grid-template-columns: repeat(2, minmax(180px, 1fr));
    gap: 12px;
    margin-bottom: 16px;
}

.reader-settings__group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.reader-settings__label {
    font-size: 11px;
    color: var(--reader-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.reader-settings__actions {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: flex-end;

    margin-top: 16px;
}

.reader-btn .material-icons {
    font-size: 20px;
    line-height: 1;
}

.reader-minimap {
    flex: 0 0 var(--reader-minimap-width);
    width: var(--reader-minimap-width);
    background: var(--reader-surface);
    border-left: 1px solid var(--reader-border);
}

.reader-minimap--placeholder {
    opacity: 0.4;
}

@media (max-width: 900px) {
    .reader-settings {
        grid-template-columns: 1fr;
    }
}
</style>
