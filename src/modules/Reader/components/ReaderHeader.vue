<script setup>
import ReaderFavorites from './ReaderFavorites.vue';

import SrButton from '../../../ui/SrButton.vue';

const props = defineProps({
    isPlaying: {
        type: Boolean,
        required: true,
    },
    isCompact: {
        type: Boolean,
        required: true,
    },
    settings: {
        type: Object,
        required: true,
    },
    timerText: {
        type: String,
        required: true,
    },
    sessionTimerText: {
        type: String,
        required: true,
    },
    speedMultiplier: {
        type: Number,
        default: 1,
    },
    pendingStartSeconds: {
        type: Number,
        default: null,
    },
});

const emit = defineEmits(['toggle-play', 'reset', 'help', 'close', 'open-settings', 'open-theme', 'update-setting', 'speed-multiplier']);
</script>

<template>
    <div class="reader-header">
        <div class="reader-controls">
            <SrButton
                class="reader-btn"
                :variant="props.isPlaying ? 'accent' : 'default'"
                :aria-label="props.isPlaying ? 'Пауза' : 'Начать'"
                @click="emit('toggle-play')"
            >
                <span
                    v-if="props.pendingStartSeconds !== null"
                    class="reader-countdown"
                >
                    {{ props.pendingStartSeconds }}
                </span>
                <span
                    v-else
                    class="material-icons"
                    aria-hidden="true"
                >
                    {{ props.isPlaying ? 'pause' : 'play_arrow' }}
                </span>
            </SrButton>
        </div>
        <ReaderFavorites
            :settings="props.settings"
            :speed-multiplier="props.speedMultiplier"
            :timer-text="props.timerText"
            :session-timer-text="props.sessionTimerText"
            @update-setting="emit('update-setting', $event)"
            @speed-multiplier="emit('speed-multiplier', $event)"
        />
        <div class="reader-controls">
            <SrButton
                class="reader-btn"
                aria-label="Настройки темы"
                @click="emit('open-theme')"
            >
                <span
                    class="material-icons"
                    aria-hidden="true"
                >
                    style
                </span>
            </SrButton>
            <SrButton
                class="reader-btn"
                aria-label="Настройки"
                @click="emit('open-settings')"
            >
                <span
                    class="material-icons"
                    aria-hidden="true"
                >
                    tune
                </span>
            </SrButton>
            <SrButton
                class="reader-btn"
                aria-label="Закрыть"
                @click="emit('close')"
            >
                <span
                    class="material-icons"
                    aria-hidden="true"
                >
                    close
                </span>
            </SrButton>
        </div>
    </div>
</template>

<style scoped>
.reader-header {
    position: relative;
    z-index: 30;

    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;

    padding: 10px;

    background: var(--reader-surface);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--reader-border);
}

.reader-controls {
    display: flex;
    gap: 12px;
    align-items: center;
}

.reader-countdown {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.04em;
}

.reader-btn .material-icons {
    font-size: 20px;
    line-height: 1;
}
</style>
