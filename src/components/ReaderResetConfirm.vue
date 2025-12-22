<script setup>
import SrButton from '../ui/SrButton.vue';
import SrModal from '../ui/SrModal.vue';

const props = defineProps({
    open: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['close', 'confirm']);
</script>

<template>
    <SrModal
        :open="props.open"
        card-class="sr-modal-card--compact"
        @close="emit('close')"
    >
        <div class="sr-modal-header">
            <div>Сброс настроек</div>
        </div>
        <div class="sr-modal-text">Сбросить настройки форматирования к значениям по умолчанию?</div>
        <div class="sr-modal-actions">
            <SrButton
                class="reader-btn"
                @click="emit('close')"
                >Отмена</SrButton
            >
            <SrButton
                class="reader-btn"
                @click="emit('confirm')"
                >Сбросить</SrButton
            >
        </div>
    </SrModal>
</template>
