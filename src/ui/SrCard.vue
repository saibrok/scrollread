<script setup>
const props = defineProps({
    as: {
        type: String,
        default: 'div',
    },
    variant: {
        type: String,
        default: 'default',
    },
});
</script>

<template>
    <component
        :is="props.as"
        :class="['sr-card', `sr-card--${props.variant}`]"
        v-bind="$attrs"
    >
        <slot />
    </component>
</template>

<style scoped>
.sr-card {
    padding: 24px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
}

.sr-card--alt {
    background: var(--bg-accent);
}
</style>
