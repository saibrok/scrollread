<script setup>
import SrButton from '../ui/SrButton.vue';

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
            <SrButton
                class="reader-btn"
                @click="emit('toggle-play')"
            >
                {{ props.isPlaying ? 'Пауза' : 'Плей' }}
            </SrButton>
            <SrButton
                class="reader-btn"
                @click="emit('fullscreen')"
                >Полный экран</SrButton
            >
            <SrButton
                class="reader-btn"
                @click="emit('jump-end')"
                >В конец</SrButton
            >
        </div>
        <div class="reader-timer">{{ props.timerText }}</div>
        <div class="reader-controls">
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
