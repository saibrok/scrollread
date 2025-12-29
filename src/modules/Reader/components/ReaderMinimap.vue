<template>
    <div
        ref="minimapEl"
        class="reader-minimap"
        :class="{ 'reader-minimap--locked': props.isPlaying }"
        aria-label="Minimap"
    >
        <canvas
            ref="canvasEl"
            class="reader-minimap__canvas"
        ></canvas>
        <div
            ref="viewportEl"
            class="reader-minimap__viewport"
        ></div>
    </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import { ReaderMinimapController } from '../../../composables/readerMinimap/ReaderMinimapController';

const props = defineProps({
    stageEl: {
        type: Object,
        default: null,
        validator: (value) => value === null || typeof value === 'object',
    },
    textEl: {
        type: Object,
        default: null,
        validator: (value) => value === null || typeof value === 'object',
    },
    content: {
        type: String,
        required: true,
    },
    renderKey: {
        type: Number,
        required: true,
    },
    progress: {
        type: Number,
        required: true,
    },
    isPlaying: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['seek']);

const minimapEl = ref(null);
const viewportEl = ref(null);
const canvasEl = ref(null);

let controller = null;

function getStageEl() {
    return props.stageEl?.value ?? props.stageEl ?? null;
}

function getTextEl() {
    return props.textEl?.value ?? props.textEl ?? null;
}

function initController() {
    const stageEl = getStageEl();
    const textEl = getTextEl();

    if (!stageEl || !textEl) {
        return;
    }
    if (!minimapEl.value || !viewportEl.value || !canvasEl.value) {
        return;
    }

    controller = new ReaderMinimapController({
        stageEl,
        textEl,
        minimapEl: minimapEl.value,
        viewportEl: viewportEl.value,
        canvasEl: canvasEl.value,
        getProgress: () => props.progress,
        onSeek: (ratio) => emit('seek', ratio),
        canInteract: () => !props.isPlaying,
    });

    controller.init();
}

function destroyController() {
    if (!controller) {
        return;
    }
    controller.destroy();
    controller = null;
}

async function handleContentChange() {
    if (!controller) {
        return;
    }
    await nextTick();
    controller.render();
    controller.sync();
}

function handleTargetChange() {
    destroyController();
    initController();
}

onMounted(() => {
    initController();
});

onUnmounted(() => {
    destroyController();
});

watch(() => getStageEl(), handleTargetChange);
watch(() => getTextEl(), handleTargetChange);
watch(() => props.content, handleContentChange, { flush: 'post' });
watch(() => props.renderKey, handleContentChange, { flush: 'post' });
watch(
    () => props.progress,
    () => controller?.sync(),
);
watch(
    () => props.isPlaying,
    () => controller?.sync(),
);
</script>
