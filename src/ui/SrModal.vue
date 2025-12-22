<script setup>
const props = defineProps({
    open: {
        type: Boolean,
        required: true,
    },
    cardClass: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['close']);
</script>

<template>
    <div
        class="sr-modal"
        :class="{ active: props.open }"
        :aria-hidden="!props.open"
        @click.self="emit('close')"
    >
        <div :class="['sr-modal-card', props.cardClass]">
            <slot />
        </div>
    </div>
</template>
