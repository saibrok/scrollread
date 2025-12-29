<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
    html: {
        type: String,
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
    stageElement: {
        type: Object,
        default: null,
    },
    textElement: {
        type: Object,
        default: null,
    },
    scaleFactor: {
        type: Number,
        default: 0.1,
    },
});

const emit = defineEmits(['seek']);

const root = ref(null);
const containerWidth = ref(0);
const containerHeight = ref(0);
const stageWidth = ref(0);
const stageHeight = ref(0);
const textHeight = ref(0);
const contentScrollTop = ref(0);
const targetScrollTop = ref(0);
const isDragging = ref(false);
const dragPointerOffset = ref(0);
const scrollAnimId = ref(null);

let containerObserver = null;
let stageObserver = null;
let textObserver = null;

const scrollEasing = 0.18;
const scrollStopThreshold = 0.5;
const wheelViewportFactor = 0.6;

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function updateContainerSize() {
    if (!root.value) {
        return;
    }
    const rect = root.value.getBoundingClientRect();

    containerWidth.value = rect.width;
    containerHeight.value = rect.height;
}

function updateStageSize() {
    if (!props.stageElement) {
        stageWidth.value = 0;
        stageHeight.value = 0;

        return;
    }
    stageWidth.value = props.stageElement.clientWidth || 0;
    stageHeight.value = props.stageElement.clientHeight || 0;
}

function updateTextHeight() {
    if (!props.textElement) {
        textHeight.value = 0;

        return;
    }
    textHeight.value = props.textElement.scrollHeight || 0;
}

function setupObserver(target, setter, previousObserver) {
    if (previousObserver) {
        previousObserver.disconnect();
    }
    if (!target) {
        return null;
    }
    const observer = new ResizeObserver(() => {
        setter();
    });

    observer.observe(target);

    return observer;
}

const scale = computed(() => {
    return props.scaleFactor;
});

const scaledTextHeight = computed(() => textHeight.value * scale.value);
const minCanvasHeight = computed(() => {
    if (!scale.value) {
        return 0;
    }

    return containerHeight.value / scale.value;
});
const canvasHeight = computed(() => Math.max(textHeight.value, minCanvasHeight.value));
const scaledCanvasHeight = computed(() => canvasHeight.value * scale.value);
const viewportHeight = computed(() => {
    if (!scale.value) {
        return 0;
    }

    return Math.min(stageHeight.value * scale.value, scaledTextHeight.value);
});
const maxViewportOffset = computed(() => Math.max(0, scaledTextHeight.value - viewportHeight.value));
const viewportY = computed(() => {
    if (maxViewportOffset.value <= 0) {
        return 0;
    }

    return clamp(props.progress * maxViewportOffset.value, 0, maxViewportOffset.value);
});
const maxContentScrollTop = computed(() => Math.max(0, scaledCanvasHeight.value - containerHeight.value));

const canvasStyle = computed(() => {
    if (!scale.value) {
        return {
            width: '0px',
            height: '0px',
            transform: 'scale(0)',
        };
    }

    return {
        width: `${stageWidth.value}px`,
        height: `${canvasHeight.value}px`,
        transform: `scale(${scale.value})`,
    };
});

const contentStyle = computed(() => ({
    height: `${scaledCanvasHeight.value}px`,
    transform: `translate3d(0, -${contentScrollTop.value}px, 0)`,
}));

const viewportStyle = computed(() => ({
    height: `${viewportHeight.value}px`,
    transform: `translateY(${viewportY.value}px)`,
}));

function stopScrollAnimation() {
    if (scrollAnimId.value) {
        cancelAnimationFrame(scrollAnimId.value);
        scrollAnimId.value = null;
    }
}

function startScrollAnimation() {
    if (scrollAnimId.value) {
        return;
    }
    const tick = () => {
        const delta = targetScrollTop.value - contentScrollTop.value;

        if (Math.abs(delta) < scrollStopThreshold) {
            contentScrollTop.value = targetScrollTop.value;
            stopScrollAnimation();

            return;
        }
        contentScrollTop.value += delta * scrollEasing;
        scrollAnimId.value = requestAnimationFrame(tick);
    };

    scrollAnimId.value = requestAnimationFrame(tick);
}

function updateTargetScrollTop(immediate = false) {
    const maxScroll = maxContentScrollTop.value;

    if (!maxScroll) {
        contentScrollTop.value = 0;
        targetScrollTop.value = 0;
        stopScrollAnimation();

        return;
    }
    const maxOffset = maxViewportOffset.value;
    const progress = maxOffset > 0 ? viewportY.value / maxOffset : 0;
    const next = clamp(maxScroll * progress, 0, maxScroll);

    targetScrollTop.value = next;

    if (immediate) {
        contentScrollTop.value = targetScrollTop.value;
        stopScrollAnimation();
    } else {
        startScrollAnimation();
    }
}

function getLocalOffset(event) {
    if (!root.value) {
        return 0;
    }
    const rect = root.value.getBoundingClientRect();

    return event.clientY - rect.top + contentScrollTop.value;
}

function seekToOffset(offsetY, immediateScroll) {
    const maxOffset = maxViewportOffset.value;

    if (maxOffset <= 0) {
        return;
    }
    const nextViewportY = clamp(offsetY - viewportHeight.value / 2, 0, maxOffset);
    const nextProgress = maxOffset ? nextViewportY / maxOffset : 0;

    emit('seek', { progress: nextProgress, smooth: !immediateScroll });
    updateTargetScrollTop(immediateScroll);
}

function handleJump(event) {
    if (props.isPlaying || isDragging.value) {
        return;
    }
    seekToOffset(getLocalOffset(event), false);
}

function handleWheel(event) {
    if (props.isPlaying) {
        return;
    }
    const maxOffset = maxViewportOffset.value;

    if (maxOffset <= 0) {
        return;
    }
    event.preventDefault();

    const delta = (event.deltaY / Math.max(1, containerHeight.value)) * maxOffset * wheelViewportFactor;
    const nextViewportY = clamp(viewportY.value + delta, 0, maxOffset);
    const nextProgress = maxOffset ? nextViewportY / maxOffset : 0;

    emit('seek', { progress: nextProgress, smooth: true });
    updateTargetScrollTop(false);
}

function handleViewportPointerDown(event) {
    if (props.isPlaying || maxViewportOffset.value <= 0) {
        return;
    }
    event.preventDefault();
    isDragging.value = true;
    dragPointerOffset.value = getLocalOffset(event) - viewportY.value;

    if (event.currentTarget?.setPointerCapture) {
        event.currentTarget.setPointerCapture(event.pointerId);
    }
    window.addEventListener('pointermove', handleDragMove);
    window.addEventListener('pointerup', handleDragEnd);
    window.addEventListener('pointercancel', handleDragEnd);
}

function handleDragMove(event) {
    if (!isDragging.value) {
        return;
    }
    event.preventDefault();

    const offset = getLocalOffset(event) - dragPointerOffset.value;
    const maxOffset = maxViewportOffset.value;
    const nextViewportY = clamp(offset, 0, maxOffset);
    const nextProgress = maxOffset ? nextViewportY / maxOffset : 0;

    emit('seek', { progress: nextProgress, smooth: false });
    updateTargetScrollTop(true);
}

function handleDragEnd() {
    if (!isDragging.value) {
        return;
    }
    isDragging.value = false;
    window.removeEventListener('pointermove', handleDragMove);
    window.removeEventListener('pointerup', handleDragEnd);
    window.removeEventListener('pointercancel', handleDragEnd);
    updateTargetScrollTop(false);
}

watch(
    () => [props.progress, viewportHeight.value, scaledCanvasHeight.value, containerHeight.value],
    () => {
        updateTargetScrollTop(false);
    },
    { flush: 'post' },
);

watch(
    () => props.isPlaying,
    (value) => {
        if (value) {
            handleDragEnd();
        }
    },
);

watch(
    () => props.stageElement,
    () => {
        stageObserver = setupObserver(props.stageElement, updateStageSize, stageObserver);
        nextTick(updateStageSize);
    },
    { immediate: true },
);

watch(
    () => props.textElement,
    () => {
        textObserver = setupObserver(props.textElement, updateTextHeight, textObserver);
        nextTick(updateTextHeight);
    },
    { immediate: true },
);

watch(
    () => props.html,
    () => {
        nextTick(updateTextHeight);
    },
);

onMounted(() => {
    containerObserver = setupObserver(root.value, updateContainerSize, containerObserver);
    updateContainerSize();
    updateStageSize();
    updateTextHeight();
});

onBeforeUnmount(() => {
    if (containerObserver) {
        containerObserver.disconnect();
    }
    if (stageObserver) {
        stageObserver.disconnect();
    }
    if (textObserver) {
        textObserver.disconnect();
    }
    stopScrollAnimation();
    handleDragEnd();
});
</script>

<template>
    <div
        ref="root"
        class="reader-minimap-inner"
        :class="{ 'reader-minimap-inner--disabled': props.isPlaying }"
        @pointerdown="handleJump"
        @wheel="handleWheel"
    >
        <div
            class="reader-minimap-inner__content"
            :style="contentStyle"
        >
            <div
                class="reader-minimap-inner__canvas"
                :style="canvasStyle"
            >
                <div
                    class="reader-minimap-inner__text"
                    v-html="props.html"
                ></div>
            </div>
            <div
                class="reader-minimap-inner__viewport"
                :class="{ 'reader-minimap-inner__viewport--dragging': isDragging }"
                :style="viewportStyle"
                @pointerdown.stop="handleViewportPointerDown"
            ></div>
        </div>
    </div>
</template>

<style scoped>
.reader-minimap-inner {
    touch-action: none;
    cursor: pointer;
    user-select: none;

    position: relative;

    overflow: hidden;
    display: block;

    width: 100%;
    height: 100%;

    opacity: 0.6;

    -webkit-tap-highlight-color: transparent;
}

.reader-minimap-inner--disabled {
    pointer-events: none;
    cursor: default;
}

.reader-minimap-inner__content {
    position: relative;
    transform: translateY(0);
    width: 100%;
}

.reader-minimap-inner__canvas {
    pointer-events: none;
    position: absolute;
    inset: 0 auto auto 0;
    transform-origin: top left;
}

.reader-minimap-inner__text {
    box-sizing: border-box;
    width: 100%;
    padding-top: calc(var(--read-band) * var(--read-line-height) / 2 - 1em * var(--read-line-height) + 1em);
    padding-inline: var(--read-padding);

    font-family: var(--reader-font);
    font-size: var(--reader-font-size);
    line-height: var(--read-line-height);
    color: var(--reader-text);
    text-align: var(--reader-align);
    word-break: break-word;
}

:deep(.reader-minimap-inner__text p) {
    margin: 0 0 var(--read-paragraph-gap);
    text-indent: var(--reader-indent);
}

:deep(.reader-minimap-inner__text p:last-child) {
    margin-bottom: 0;
}

.reader-minimap-inner__viewport {
    touch-action: none;
    cursor: grab;

    position: absolute;
    inset: 0 auto auto 0;

    width: 100%;

    background: color-mix(in srgb, var(--reader-text) 12%, transparent);
    border: 1px solid color-mix(in srgb, var(--reader-text) 20%, transparent);
    border-radius: 1px;

    transition:
        transform 120ms linear,
        height 120ms linear;

    -webkit-tap-highlight-color: transparent;

    &:hover {
        background: color-mix(in srgb, var(--accent) 12%, transparent);
    }
}

.reader-minimap-inner__viewport--dragging {
    cursor: grabbing;
    transition: none;
}
</style>
