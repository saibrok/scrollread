<script setup>
import { onBeforeUnmount, watch } from 'vue';

let openModals = 0;

function updateBodyLock(delta) {
    openModals = Math.max(0, openModals + delta);
    document?.body?.classList.toggle('modal-open', openModals > 0);
}

const props = defineProps({
    open: {
        type: Boolean,
        required: true,
    },
    modalClass: {
        type: String,
        default: '',
    },
    cardClass: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['close']);

watch(
    () => props.open,
    (value, prev) => {
        if (value === prev) {
            return;
        }
        updateBodyLock(value ? 1 : -1);
    },
    { immediate: true },
);

onBeforeUnmount(() => {
    if (props.open) {
        updateBodyLock(-1);
    }
});
</script>

<template>
    <div
        :class="['sr-modal', props.modalClass, { active: props.open }]"
        :aria-hidden="!props.open"
        @click.self="emit('close')"
    >
        <div :class="['sr-modal-card', props.cardClass]">
            <slot />
        </div>
    </div>
</template>
