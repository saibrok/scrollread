<script setup>
const props = defineProps({
    modelValue: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue']);

function onInput(event) {
    emit('update:modelValue', event.target.value);
}
</script>

<template>
    <textarea
        class="sr-textarea"
        :value="props.modelValue"
        v-bind="$attrs"
        @input="onInput"
    ></textarea>
</template>

<style scoped>
.sr-textarea {
    resize: vertical;
    scrollbar-color: var(--ui-border, var(--border)) var(--ui-surface, var(--surface));
    scrollbar-width: thin;

    width: 100%;
    min-height: 430px;
    padding: 16px 18px;

    font-size: 16px;
    line-height: 1.6;
    color: var(--text);

    background: transparent;
    border: 1px solid var(--border);
    border-radius: 16px;
}

.sr-textarea:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}

.sr-textarea::-webkit-scrollbar {
    width: 10px;
}

.sr-textarea::-webkit-scrollbar-track {
    background: var(--ui-surface, var(--surface));
    border-radius: 999px;
}

.sr-textarea::-webkit-scrollbar-thumb {
    background: var(--ui-border, var(--border));
    border: 2px solid var(--ui-surface, var(--surface));
    border-radius: 999px;
}

.sr-textarea::-webkit-scrollbar-thumb:hover {
    background: var(--ui-border-hover, var(--accent));
}
</style>
