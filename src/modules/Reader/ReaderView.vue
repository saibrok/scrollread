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
const readerPanelRef = ref(null);
const readerModalPanelRef = ref(null);
const settingsOpen = ref(false);
const themeOpen = ref(false);
const settingsPeeking = ref(false);
const sessionSeconds = ref(0);
let sessionStart = 0;
let sessionAccumulated = 0;
let sessionTimerId = null;
const pendingStartId = ref(null);
const pendingStartSeconds = ref(null);
const pendingStartTickId = ref(null);
const minimapRenderKey = ref(0);
const bodyOverflow = ref('');

const showMinimap = computed(() => readerSettings.showMinimap !== false && !isCompact.value);

const readerStyle = computed(() => {
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
        '--reader-indent': readerSettings.align === 'center' ? '0em' : `${readerSettings.indent}em`,
        '--reader-minimap-width': showMinimap.value ? '120px' : '0px',
    };
});

const readerHtml = computed(() => toParagraphs(text.value));
const paletteOptions = computed(() => getPaletteOptions(themeSettings.themeTone));

const speedMultiplier = ref(1);

const {
    isPlaying,
    currentSeconds,
    totalDuration,
    togglePlay,
    pauseScroll,
    jumpToEdge,
    smoothSeek,
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
const playbackProgress = computed(() => {
    if (totalDuration.value === 0) {
        return 0;
    }

    return Math.min(1, Math.max(0, currentSeconds.value / totalDuration.value));
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

function handlePanelToggle() {
    if (isOpen.value) {
        recalcMetricsPreservePosition();
    }
}

function handlePanelUpdateEnd() {
    minimapRenderKey.value += 1;
}

function handlePanelShortcut() {
    if (isCompact.value) {
        if (settingsOpen.value && readerModalPanelRef.value?.togglePanel) {
            readerModalPanelRef.value.togglePanel();
        }

        return;
    }

    if (readerPanelRef.value?.togglePanel) {
        readerPanelRef.value.togglePanel();
    }
}
function setSpeedMultiplier(multiplier) {
    speedMultiplier.value = multiplier || 1;
    recalcMetricsPreservePosition();
}

function handleSpeedMultiplier(multiplier) {
    setSpeedMultiplier(multiplier === 1 ? null : multiplier);
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
    if (typeof resetReaderSettings === 'function') {
        resetReaderSettings();
    }
    recalcMetricsPreservePosition();
    resetOpen.value = false;
}

function openSettings() {
    if (!isCompact.value) {
        return;
    }
    settingsOpen.value = true;
}

function closeSettings() {
    settingsOpen.value = false;
}

function openTheme() {
    themeOpen.value = true;
}

function closeTheme() {
    themeOpen.value = false;
}

function startSettingsPeek() {
    settingsPeeking.value = true;
}

function stopSettingsPeek() {
    settingsPeeking.value = false;
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

    if (!value) {
        settingsOpen.value = false;
        themeOpen.value = false;
    }
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
        minimapRenderKey.value += 1;
    } else {
        unlockBodyScroll();
        pauseScroll();
    }
});

watch(text, () => {
    if (isOpen.value) {
        initReader();
        minimapRenderKey.value += 1;
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

function handleMinimapSeek(progress) {
    if (isPlaying.value) {
        return;
    }
    smoothSeek(progress);
}
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
            :timer-text="timerText"
            :session-timer-text="sessionTimerText"
            :pending-start-seconds="pendingStartSeconds"
            :start-delay="readerSettings.startDelay"
            @toggle-play="handleTogglePlay"
            @update:start-delay="(value) => updateReaderSetting({ key: 'startDelay', value })"
            @reset="handleReset"
            @help="openHelp"
            @open-settings="openSettings"
            @open-theme="openTheme"
            @close="handleClose"
        />
        <ReaderPanel
            v-if="!isCompact"
            ref="readerPanelRef"
            :settings="readerSettings"
            :speed-multiplier-label="speedMultiplierLabel"
            :speed-multiplier="speedMultiplier"
            :is-fullscreen="isFullscreen"
            :is-compact="isCompact"
            @update="updateReaderSetting"
            @update-end="handlePanelUpdateEnd"
            @fullscreen="handleFullscreen"
            @speed-multiplier="handleSpeedMultiplier"
            @toggle="handlePanelToggle"
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
            <ReaderMinimap
                v-if="showMinimap"
                :stage-el="readerStage"
                :text-el="readerText"
                :content="text"
                :render-key="minimapRenderKey"
                :progress="playbackProgress"
                :is-playing="isPlaying"
                @seek="handleMinimapSeek"
            />
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
            <div class="reader-settings">
                <div class="reader-settings__group">
                    <div class="reader-settings__label">Тон</div>
                    <SrSelect
                        :model-value="themeSettings.themeTone"
                        :items="THEME_TONE_OPTIONS"
                        @update:model-value="updateThemeTone"
                    />
                </div>
                <div class="reader-settings__group">
                    <div class="reader-settings__label">Цветовая схема</div>
                    <SrSelect
                        :model-value="themeSettings.themePalette"
                        :items="paletteOptions"
                        @update:model-value="updateThemePalette"
                    />
                </div>
            </div>
        </SrModal>
        <SrModal
            :open="settingsOpen"
            :modal-class="settingsPeeking ? 'sr-modal--settings sr-modal--peek' : 'sr-modal--settings'"
            card-class="sr-modal-card--wide"
            @close="closeSettings"
        >
            <div class="sr-modal-header">
                <div>Настройки</div>
                <SrButton
                    class="reader-btn"
                    @mousedown="startSettingsPeek"
                    @mouseup="stopSettingsPeek"
                    @mouseleave="stopSettingsPeek"
                    @touchstart.prevent="startSettingsPeek"
                    @touchend="stopSettingsPeek"
                    @touchcancel="stopSettingsPeek"
                >
                    <span
                        class="material-icons"
                        aria-hidden="true"
                    >
                        visibility
                    </span>
                </SrButton>
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
            <ReaderPanel
                ref="readerModalPanelRef"
                :settings="readerSettings"
                :speed-multiplier-label="speedMultiplierLabel"
                :speed-multiplier="speedMultiplier"
                :is-fullscreen="isFullscreen"
                :is-compact="isCompact"
                :show-speed-in-bar="false"
                @update="updateReaderSetting"
                @update-end="handlePanelUpdateEnd"
                @fullscreen="handleFullscreen"
                @speed-multiplier="handleSpeedMultiplier"
                @toggle="handlePanelToggle"
            />
            <div class="reader-settings__actions">
                <SrButton
                    class="reader-btn"
                    @click="handleReset"
                >
                    Сброс настроек
                </SrButton>
                <SrButton
                    class="reader-btn"
                    aria-label="Горячие клавиши"
                    @click="openHelp"
                >
                    <span
                        class="material-icons"
                        aria-hidden="true"
                    >
                        help_outline
                    </span>
                </SrButton>
            </div>
        </SrModal>
    </div>
</template>
