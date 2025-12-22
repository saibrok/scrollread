<script setup>
const props = defineProps({
    type: {
        type: String,
        default: 'button',
    },
    variant: {
        type: String,
        default: 'default',
    },
});
</script>

<template>
    <button
        :class="['sr-button', `sr-button--${props.variant}`]"
        :type="type"
        v-bind="$attrs"
    >
        <slot />
    </button>
</template>

<style scoped>
.sr-button {
    cursor: pointer;

    display: inline-flex;
    gap: 8px;
    align-items: center;
    justify-content: center;

    padding: 10px 16px;

    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    color: var(--ui-text, var(--text));
    letter-spacing: 0.02em;

    background: var(--ui-surface, var(--surface));
    border: 1px solid var(--ui-border, var(--border));
    border-radius: 12px;
    box-shadow: var(--ui-shadow, 0 10px 20px rgb(15 23 42 / 8%));

    transition:
        transform 0.15s ease,
        box-shadow 0.15s ease,
        border-color 0.15s ease,
        background 0.15s ease,
        color 0.15s ease;
}

.sr-button:hover {
    transform: translateY(-1px);
    background: var(--ui-surface-hover, var(--bg-accent));
    border-color: var(--ui-border-hover, var(--accent));
}

.sr-button:active {
    transform: translateY(0);
}

.sr-button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    box-shadow: none;
}

.sr-button--accent {
    color: #fff;
    background: var(--accent);
    border-color: var(--accent);
}

.sr-button--accent:hover {
    filter: brightness(1.05);
    background: var(--accent);
    border-color: var(--accent);
}
</style>
