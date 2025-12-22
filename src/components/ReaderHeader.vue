<script setup>
import UiButton from '../ui/UiButton.vue';

const props = defineProps({
    isPlaying: {
        type: Boolean,
        required: true,
    },
    timerText: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['toggle-play', 'fullscreen', 'jump-end', 'reset', 'help', 'close']);
</script>

<template>
    <div class="reader-header">
        <div class="reader-controls">
            <UiButton
                class="reader-btn"
                @click="emit('toggle-play')"
            >
                {{ props.isPlaying ? 'Пауза' : 'Плей' }}
            </UiButton>
            <UiButton
                class="reader-btn"
                @click="emit('fullscreen')"
                >Полный экран</UiButton
            >
            <UiButton
                class="reader-btn"
                @click="emit('jump-end')"
                >В конец</UiButton
            >
        </div>
        <div class="reader-timer">{{ props.timerText }}</div>
        <div class="reader-controls">
            <UiButton
                class="reader-btn"
                @click="emit('reset')"
                >Сброс</UiButton
            >
            <UiButton
                class="reader-btn"
                @click="emit('help')"
                >?</UiButton
            >
            <UiButton
                class="reader-btn"
                @click="emit('close')"
                >Закрыть</UiButton
            >
        </div>
    </div>
</template>
