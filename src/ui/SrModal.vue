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

<style scoped>
.sr-modal {
    position: absolute;
    z-index: 60;
    inset: 0;

    display: none;
    align-items: center;
    justify-content: center;

    background: rgb(0 0 0 / 75%);
    backdrop-filter: blur(8px);
}

.sr-modal--settings {
    z-index: 55;
}

.sr-modal--peek {
    background: transparent;
    backdrop-filter: none;
}

.sr-modal-card {
    overflow: hidden;
    display: flex;
    flex-direction: column;

    width: min(520px, 90vw);
    max-height: calc(80vh - 32px);
    padding: 18px 20px 16px;

    color: var(--reader-text);

    background: var(--reader-help-bg);
    border: 1px solid var(--reader-help-border);
    border-radius: 16px;
    box-shadow: 0 20px 40px rgb(0 0 0 / 40%);
}

.sr-modal--peek .sr-modal-card {
    opacity: 0;
    box-shadow: none;
}

.sr-modal.active {
    display: flex;
}

.sr-modal-card--compact {
    width: min(420px, 90vw);
}

.sr-modal-card--wide {
    width: min(900px, 94vw);
}

:deep(.sr-modal-header) {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 12px;

    font-size: 14px;
    color: var(--reader-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

:deep(.sr-modal-body) {
    overflow: auto;
    flex: 1 1 auto;
    min-height: 0;
}

:deep(.sr-modal-grid) {
    display: grid;
    gap: 8px;
    font-size: 14px;
}

:deep(.sr-modal-text) {
    margin-bottom: 16px;
    font-size: 14px;
    line-height: 1.5;
    color: var(--reader-text);
}

:deep(.sr-modal-actions) {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

@media (max-width: 900px) {
    .sr-modal {
        align-items: center;
        padding: 16px 12px;
    }

    .sr-modal-card,
    .sr-modal-card--compact,
    .sr-modal-card--wide {
        width: 100%;
        max-height: calc(80vh - 32px);
    }
}
</style>
