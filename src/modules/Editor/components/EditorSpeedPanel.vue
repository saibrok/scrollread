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

<style scoped>
.control {
    display: flex;
    flex-direction: column;
    gap: 10px;

    padding: 16px;

    background: var(--bg-accent);
    border: 1px solid var(--border);
    border-radius: 16px;
}

.label {
    font-size: 13px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.range-row {
    display: flex;
    gap: 10px;
    align-items: center;

    font-size: 14px;
    color: var(--muted);
}

.meta {
    font-size: 14px;
    color: var(--muted);
}
</style>
