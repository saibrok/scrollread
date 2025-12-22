<script setup>
const props = defineProps({
    modelValue: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue']);

function onChange(event) {
    emit('update:modelValue', event.target.value);
}
</script>

<template>
    <select
        :value="props.modelValue"
        v-bind="$attrs"
        @change="onChange"
    >
        <slot />
    </select>
</template>
