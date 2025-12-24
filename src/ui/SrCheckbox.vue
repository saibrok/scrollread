<script setup>
import { computed, useSlots } from 'vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    label: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['update:modelValue']);
const slots = useSlots();

const hasLabel = computed(() => Boolean(props.label) || Boolean(slots.default));

function onChange(event) {
    emit('update:modelValue', event.target.checked);
}
</script>

<template>
    <label class="sr-checkbox">
        <input
            class="sr-checkbox__input"
            type="checkbox"
            :checked="props.modelValue"
            @change="onChange"
        />
        <span
            class="sr-checkbox__box"
            aria-hidden="true"
        >
            <span class="material-icons sr-checkbox__icon">check</span>
        </span>
        <span
            v-if="hasLabel"
            class="sr-checkbox__label"
        >
            <slot>{{ props.label }}</slot>
        </span>
    </label>
</template>

<style scoped>
.sr-checkbox {
    cursor: pointer;
    user-select: none;

    position: relative;

    display: inline-flex;
    gap: 8px;
    align-items: center;
}

.sr-checkbox__input {
    pointer-events: none;
    position: absolute;
    opacity: 0;
}

.sr-checkbox__box {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 16px;
    height: 16px;

    background: var(--ui-surface, var(--surface));
    border: 1px solid var(--ui-border, var(--border));
    border-radius: 6px;

    transition:
        background 0.15s ease,
        border-color 0.15s ease,
        transform 0.15s ease;
}

.sr-checkbox__input:checked + .sr-checkbox__box {
    background: var(--accent);
    border-color: var(--accent);
}

.sr-checkbox__icon {
    transform: scale(0.8);

    font-size: 12px;
    line-height: 1;
    color: #fff;

    opacity: 0;

    transition:
        opacity 0.12s ease,
        transform 0.12s ease;
}

.sr-checkbox__input:checked + .sr-checkbox__box .sr-checkbox__icon {
    transform: scale(1);
    opacity: 1;
}

.sr-checkbox__input:focus-visible + .sr-checkbox__box {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}

.sr-checkbox__label {
    font-size: 11px;
    color: var(--ui-text-muted, var(--muted, var(--text)));
    text-transform: uppercase;
    letter-spacing: 0.08em;
}
</style>
