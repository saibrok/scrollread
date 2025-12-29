<script setup>
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    open: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <details
        class="sr-expansion-panel"
        :open="props.open"
    >
        <summary>{{ props.title }}</summary>
        <div class="sr-expansion-panel__content">
            <slot />
        </div>
    </details>
</template>

<style scoped>
.sr-expansion-panel {
    padding: 14px 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
}

.sr-expansion-panel summary {
    cursor: pointer;
    font-weight: 600;
}

.sr-expansion-panel__content {
    margin: 10px 0 0;
    font-size: 14px;
    line-height: 1.5;
    color: var(--muted);
}
</style>
