<script setup>
import UiButton from '../ui/UiButton.vue';

const props = defineProps({
    open: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['close']);
</script>

<template>
    <div
        class="reader-help"
        :class="{ active: props.open }"
        aria-hidden="true"
    >
        <div class="reader-help-card">
            <div class="reader-help-header">
                <div>Горячие клавиши</div>
                <UiButton
                    class="reader-btn"
                    @click="emit('close')"
                    >Закрыть</UiButton
                >
            </div>
            <div class="reader-help-grid">
                <div><strong>Space</strong> - плей/пауза</div>
                <div><strong>Esc</strong> - закрыть</div>
                <div><strong>F</strong> - полный экран</div>
                <div><strong>?</strong> - справка</div>
                <div><strong>↑/↓</strong> - скорость +100</div>
                <div><strong>←/→</strong> - размер шрифта +2</div>
                <div><strong>Home/End</strong> - в начало/конец</div>
            </div>
        </div>
    </div>
</template>
