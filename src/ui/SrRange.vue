<script setup>
const props = defineProps({
    modelValue: {
        type: Number,
        required: true,
    },
    min: {
        type: [Number, String],
        default: undefined,
    },
    max: {
        type: [Number, String],
        default: undefined,
    },
    step: {
        type: [Number, String],
        default: undefined,
    },
});

const emit = defineEmits(['update:modelValue', 'change']);

function onInput(event) {
    emit('update:modelValue', Number(event.target.value));
}

function onChange(event) {
    emit('change', Number(event.target.value));
}
</script>

<template>
    <input
        type="range"
        class="sr-range"
        :min="props.min"
        :max="props.max"
        :step="props.step"
        :value="props.modelValue"
        v-bind="$attrs"
        @input="onInput"
        @change="onChange"
    />
</template>

<style scoped>
.sr-range {
    cursor: pointer;

    width: 100%;
    height: 28px;

    appearance: none;
    background: transparent;
}

.sr-range:disabled {
    cursor: default;
    opacity: 0.5;
}

.sr-range::-webkit-slider-runnable-track {
    height: 6px;
    background: var(--ui-track, var(--border));
    border-radius: 999px;
}

.sr-range::-webkit-slider-thumb {
    width: 18px;
    height: 18px;
    margin-top: -6px;

    appearance: none;
    background: var(--accent);
    border: 4px solid var(--ui-surface, var(--surface));
    border-radius: 50%;
    box-shadow: var(--ui-shadow, 0 8px 18px rgb(15 23 42 / 18%));

    transition:
        transform 0.15s ease,
        box-shadow 0.15s ease;
}

.sr-range:active::-webkit-slider-thumb {
    transform: scale(1.05);
}

.sr-range::-moz-range-track {
    height: 6px;
    background: var(--ui-track, var(--border));
    border-radius: 999px;
}

.sr-range::-moz-range-thumb {
    width: 18px;
    height: 18px;

    background: var(--accent);
    border: 4px solid var(--ui-surface, var(--surface));
    border-radius: 50%;
    box-shadow: var(--ui-shadow, 0 8px 18px rgb(15 23 42 / 18%));

    transition:
        transform 0.15s ease,
        box-shadow 0.15s ease;
}

.sr-range:active::-moz-range-thumb {
    transform: scale(1.05);
}
</style>
