<script setup>
import SrButton from '../../../ui/SrButton.vue';
import EditorSpeedPanel from './EditorSpeedPanel.vue';
import EditorStatsPanel from './EditorStatsPanel.vue';

const props = defineProps({
    text: {
        type: String,
        required: true,
    },
    speed: {
        type: Number,
        required: true,
    },
    timeRange: {
        type: String,
        required: true,
    },
    canStart: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['update:speed', 'start']);
</script>

<template>
    <div class="controls">
        <EditorStatsPanel :text="props.text" />
        <EditorSpeedPanel
            :speed="props.speed"
            :time-range="props.timeRange"
            @update:speed="emit('update:speed', $event)"
        />

        <SrButton
            class="start"
            :disabled="!props.canStart"
            variant="accent"
            @click="emit('start')"
        >
            НАЧАТЬ
        </SrButton>
    </div>
</template>
