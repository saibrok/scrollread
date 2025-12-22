<script setup>
import { computed } from 'vue';

import { getPaletteOptions, THEME_TONE_OPTIONS } from '../utils/themes';

import SrButton from '../ui/SrButton.vue';
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
    isFullscreen: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['toggle-play', 'fullscreen', 'reset', 'help', 'close', 'open-settings', 'update:theme-tone', 'update:theme-palette']);

const paletteOptions = computed(() => getPaletteOptions(props.themeTone));
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
                    v-if="props.isCompact"
                    class="material-icons"
                    aria-hidden="true"
                >
                    {{ props.isPlaying ? 'pause' : 'play_arrow' }}
                </span>
                <span v-else>{{ props.isPlaying ? 'Пауза' : 'Начать' }}</span>
            </SrButton>
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
