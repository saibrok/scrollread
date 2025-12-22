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

const emit = defineEmits(['toggle-play', 'fullscreen', 'reset', 'help', 'close', 'update:theme-tone', 'update:theme-palette']);

const paletteOptions = computed(() => getPaletteOptions(props.themeTone));
</script>

<template>
    <div class="reader-header">
        <div class="reader-controls">
            <SrButton
                class="reader-btn"
                :variant="props.isPlaying ? 'accent' : 'default'"
                @click="emit('toggle-play')"
            >
                {{ props.isPlaying ? 'Пауза' : 'Начать' }}
            </SrButton>
            <SrButton
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
                <div class="reader-timer__label">Предполагаемое время чтения</div>
                <div class="reader-timer__value">{{ props.timerText }}</div>
            </div>
        </div>
        <div class="reader-controls">
            <div class="reader-theme">
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
                class="reader-btn"
                @click="emit('reset')"
                >Сброс настроек</SrButton
            >
            <SrButton
                class="reader-btn"
                @click="emit('help')"
                >Горячие клавиши</SrButton
            >
            <SrButton
                class="reader-btn"
                @click="emit('close')"
                >Закрыть</SrButton
            >
        </div>
    </div>
</template>
