<script setup>
import SrButton from '../../../ui/SrButton.vue';
import SrInput from '../../../ui/SrInput.vue';

const props = defineProps({
    isPlaying: {
        type: Boolean,
        required: true,
    },
    isCompact: {
        type: Boolean,
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
    startDelay: {
        type: Number,
        required: true,
    },
    pendingStartSeconds: {
        type: Number,
        default: null,
    },
});

const emit = defineEmits(['toggle-play', 'reset', 'help', 'close', 'open-settings', 'open-theme', 'update:start-delay']);

function clampDelay(value) {
    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
        return 0;
    }

    return Math.min(60, Math.max(0, parsed));
}

function handleDelayInput(value) {
    emit('update:start-delay', clampDelay(value));
}
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
            <SrInput
                type="number"
                min="0"
                max="60"
                step="1"
                width="95px"
                :label="props.isCompact ? '' : 'Задержка'"
                :model-value="props.startDelay"
                @update:model-value="handleDelayInput"
            >
                <template #append-inner>с</template>
            </SrInput>
        </div>
        <div class="reader-timers">
            <div class="reader-timer">
                <div class="reader-timer__label">Время сессии</div>
                <div class="reader-timer__value">{{ props.sessionTimerText }}</div>
            </div>
            <div class="reader-timer">
                <div class="reader-timer__label">Оценка времени</div>
                <div class="reader-timer__value">{{ props.timerText }}</div>
            </div>
        </div>
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
                v-if="!props.isCompact"
                class="reader-btn"
                aria-label="Горячие клавиши"
                @click="emit('help')"
            >
                <span
                    class="material-icons"
                    aria-hidden="true"
                >
                    help_outline
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

.reader-timers {
    display: flex;
    gap: 36px;
    text-align: center;
}

.reader-timer {
    display: flex;
    flex-direction: column;
    gap: 2px;

    font-size: 12px;
    color: var(--reader-text-muted);
}

.reader-timer__label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.reader-timer__value {
    font-size: 20px;
    color: var(--reader-text);
}

.reader-btn .material-icons {
    font-size: 20px;
    line-height: 1;
}

@media (max-width: 900px) {
    .reader-header {
        flex-wrap: wrap;
        gap: 12px;
    }

    .reader-timers {
        gap: 12px;
        justify-content: center;
        order: 3;
        width: 100%;
    }
}
</style>
