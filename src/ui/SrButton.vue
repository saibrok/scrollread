<script setup>
import { computed } from 'vue';

const props = defineProps({
    as: {
        type: String,
        default: 'button',
    },
    type: {
        type: String,
        default: 'button',
    },
    width: {
        type: [String, Number],
        default: '',
    },
    variant: {
        type: String,
        default: 'default',
    },
});

const isButton = computed(() => props.as === 'button');

function resolveWidth(value) {
    if (value === null || value === undefined || value === '') {
        return undefined;
    }
    if (typeof value === 'number') {
        return `${value}px`;
    }

    return value;
}
</script>

<template>
    <component
        :is="props.as"
        :class="['sr-button', `sr-button--${props.variant}`]"
        :type="isButton ? props.type : undefined"
        :style="{ width: resolveWidth(props.width) }"
        v-bind="$attrs"
    >
        <slot />
    </component>
</template>

<style scoped>
.sr-button {
    cursor: pointer;

    display: inline-flex;
    gap: 8px;
    align-items: center;
    justify-content: center;

    padding: 10px;

    text-decoration: none;
    letter-spacing: 0.02em;
}

.sr-button--accent {
    color: #fff;
    background: var(--accent);
    border-color: var(--accent);
}

.sr-button--accent:hover {
    filter: brightness(1.1);
}

.sr-button--default:hover {
    background: var(--accent);
    background: var(--ui-surface-hover, var(--bg-accent));
    border-color: var(--ui-border-hover, var(--accent));
}

.sr-button:active {
    transform: translateY(0);
}

.sr-button:disabled {
    cursor: default;
    opacity: 0.6;
    box-shadow: none;
}

.sr-button:not(:disabled):hover {
    transform: translateY(-1px);
}
</style>
