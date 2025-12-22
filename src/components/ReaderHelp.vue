<script setup>
import SrButton from '../ui/SrButton.vue';
import SrModal from '../ui/SrModal.vue';

const props = defineProps({
    open: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['close']);
</script>

<template>
    <SrModal
        :open="props.open"
        @close="emit('close')"
    >
        <div class="sr-modal-header">
            <div>Горячие клавиши</div>
            <SrButton
                class="reader-btn"
                @click="emit('close')"
                >Закрыть</SrButton
            >
        </div>
        <div class="sr-modal-grid">
            <div><strong>Space</strong> - плей/пауза</div>
            <div><strong>F</strong> - полный экран</div>
            <div><strong>Up/Down</strong> - скорость +100</div>
            <div><strong>W/S</strong> - удерживать множитель скорости x2 / x0.5</div>
            <div><strong>Left/Right</strong> - размер шрифта +2</div>
            <div><strong>Home/End</strong> - в начало/конец</div>
        </div>
    </SrModal>
</template>
