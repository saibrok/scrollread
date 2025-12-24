<script setup>
import { computed } from 'vue';

import { getPaletteOptions, THEME_TONE_OPTIONS } from '../utils/themes';

import SrButton from '../ui/SrButton.vue';
import SrInput from '../ui/SrInput.vue';
import SrSelect from '../ui/SrSelect.vue';

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
    themeTone: {
        type: String,
        required: true,
    },
    themePalette: {
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
    isFullscreen: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits([
    'toggle-play',
    'fullscreen',
    'reset',
    'help',
    'close',
    'open-settings',
    'update:theme-tone',
    'update:theme-palette',
    'update:start-delay',
]);

const paletteOptions = computed(() => getPaletteOptions(props.themeTone));

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
                width="100px"
                @click="emit('toggle-play')"
            >
                <span
                    v-if="props.pendingStartSeconds !== null"
                    class="reader-countdown"
                >
                    {{ props.pendingStartSeconds }}
                </span>
                <span
                    v-else-if="props.isCompact"
                    class="material-icons"
                    aria-hidden="true"
                >
                    {{ props.isPlaying ? 'pause' : 'play_arrow' }}
                </span>
                <span v-else>{{ props.isPlaying ? 'Пауза' : 'Начать' }}</span>
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
            <SrButton
                v-if="!props.isCompact"
                class="reader-btn"
                :variant="props.isFullscreen ? 'accent' : 'default'"
                @click="emit('fullscreen')"
                >Полный экран</SrButton
            >
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
            <div
                v-if="!props.isCompact"
                class="reader-theme"
            >
                <label class="reader-theme__control">
                    <SrSelect
                        :model-value="props.themeTone"
                        :items="THEME_TONE_OPTIONS"
                        @update:model-value="emit('update:theme-tone', $event)"
                    />
                </label>
                <label class="reader-theme__control">
                    <SrSelect
                        :model-value="props.themePalette"
                        :items="paletteOptions"
                        @update:model-value="emit('update:theme-palette', $event)"
                    />
                </label>
            </div>
            <SrButton
                v-if="!props.isCompact"
                class="reader-btn"
                @click="emit('reset')"
                >Сброс настроек</SrButton
            >
            <SrButton
                v-if="!props.isCompact"
                class="reader-btn"
                @click="emit('help')"
                >Горячие клавиши</SrButton
            >
            <SrButton
                v-if="props.isCompact"
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
                :aria-label="props.isCompact ? 'Закрыть' : null"
                @click="emit('close')"
            >
                <span
                    v-if="props.isCompact"
                    class="material-icons"
                    aria-hidden="true"
                >
                    close
                </span>
                <span v-else>Закрыть</span>
            </SrButton>
        </div>
    </div>
</template>
