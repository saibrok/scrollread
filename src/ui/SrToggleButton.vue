<script setup>
import { computed } from 'vue';

import SrButton from './SrButton.vue';

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
    active: {
        type: Boolean,
        default: false,
    },
    activeVariant: {
        type: String,
        default: 'accent',
    },
    inactiveVariant: {
        type: String,
        default: 'default',
    },
});

const variant = computed(() => (props.active ? props.activeVariant : props.inactiveVariant));
</script>

<template>
    <SrButton
        :as="props.as"
        :type="props.type"
        :width="props.width"
        :variant="variant"
        :aria-pressed="props.active"
        v-bind="$attrs"
    >
        <slot />
    </SrButton>
</template>
