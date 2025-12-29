<script setup>
import SrRange from '../../../ui/SrRange.vue';

const props = defineProps({
    speed: {
        type: Number,
        required: true,
    },
    timeRange: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['update:speed']);
</script>

<template>
    <div class="control">
        <div class="label">Скорость</div>
        <div class="range-row">
            <strong>{{ props.speed }}</strong>
            знаков/мин
        </div>
        <div class="meta">
            Оценка времени: <span>{{ props.timeRange }}</span>
        </div>
        <SrRange
            :model-value="props.speed"
            min="100"
            max="2000"
            step="10"
            @update:model-value="emit('update:speed', $event)"
        />
    </div>
</template>
