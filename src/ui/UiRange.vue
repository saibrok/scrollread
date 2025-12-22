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

const emit = defineEmits(['update:modelValue']);

function onInput(event) {
    emit('update:modelValue', Number(event.target.value));
}
</script>

<template>
    <input
        type="range"
        :min="props.min"
        :max="props.max"
        :step="props.step"
        :value="props.modelValue"
        v-bind="$attrs"
        @input="onInput"
    />
</template>
