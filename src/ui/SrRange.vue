<script setup>
import { ref } from 'vue';
const props = defineProps({
    modelValue: {
        type: Number,
        required: true,
    },
    min: {
        type: [Number, String],
        default: undefined,
    },
    max: {
        type: [Number, String],
        default: undefined,
    },
    step: {
        type: [Number, String],
        default: undefined,
    },
});

const emit = defineEmits(['update:modelValue', 'change']);

const rangeRef = ref(null);
const pointerState = {
    active: false,
    touch: false,
    startX: 0,
    startY: 0,
    isHorizontal: false,
    isVertical: false,
};

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function toNumber(value, fallback) {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : fallback;
}

function snapToStep(value, step, min) {
    if (!Number.isFinite(step) || step <= 0) {
        return value;
    }

    const stepped = Math.round((value - min) / step) * step + min;

    return Number(stepped.toFixed(6));
}

function calcValueFromPointer(target, clientX) {
    const rect = target.getBoundingClientRect();
    const min = toNumber(props.min, 0);
    const max = toNumber(props.max, 100);
    const step = toNumber(props.step, NaN);
    const ratio = rect.width > 0 ? (clientX - rect.left) / rect.width : 0;
    const rawValue = min + clamp(ratio, 0, 1) * (max - min);

    return snapToStep(rawValue, step, min);
}

function applyValue(nextValue, commit = false) {
    if (rangeRef.value) {
        rangeRef.value.value = nextValue;
    }

    emit('update:modelValue', nextValue);

    if (commit) {
        emit('change', nextValue);
    }
}

function onInput(event) {
    emit('update:modelValue', Number(event.target.value));
}

function onChange(event) {
    emit('change', Number(event.target.value));
}

function onPointerDown(event) {
    pointerState.active = true;
    pointerState.touch = event.pointerType === 'touch';
    pointerState.startX = event.clientX;
    pointerState.startY = event.clientY;
    pointerState.isHorizontal = false;
    pointerState.isVertical = false;

    if (!pointerState.touch) {
        event.preventDefault();
        applyValue(calcValueFromPointer(event.currentTarget, event.clientX));
    }

    if (event.currentTarget?.setPointerCapture) {
        event.currentTarget.setPointerCapture(event.pointerId);
    }
}

function onPointerMove(event) {
    if (!pointerState.active || !pointerState.touch) {
        return;
    }

    const deltaX = event.clientX - pointerState.startX;
    const deltaY = event.clientY - pointerState.startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const threshold = 6;

    if (!pointerState.isHorizontal && !pointerState.isVertical) {
        if (absY > threshold && absY > absX) {
            pointerState.isVertical = true;

            return;
        }
        if (absX > threshold && absX > absY) {
            pointerState.isHorizontal = true;
        } else {
            return;
        }
    }

    if (!pointerState.isHorizontal) {
        return;
    }

    event.preventDefault();

    const nextValue = calcValueFromPointer(event.currentTarget, event.clientX);

    applyValue(nextValue);
}

function onPointerUp(event) {
    if (pointerState.active && !pointerState.isVertical) {
        const nextValue = calcValueFromPointer(event.currentTarget, event.clientX);

        applyValue(nextValue, true);
    }

    pointerState.active = false;
    pointerState.touch = false;
    pointerState.isHorizontal = false;
    pointerState.isVertical = false;
}

function onPointerCancel() {
    pointerState.active = false;
    pointerState.touch = false;
    pointerState.isHorizontal = false;
    pointerState.isVertical = false;
}
</script>

<template>
    <div class="sr-range-wrap">
        <input
            ref="rangeRef"
            type="range"
            class="sr-range"
            :min="props.min"
            :max="props.max"
            :step="props.step"
            :value="props.modelValue"
            v-bind="$attrs"
            @input="onInput"
            @change="onChange"
        />
        <div
            class="sr-range-hit"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerCancel"
        ></div>
    </div>
</template>

<style scoped>
.sr-range-wrap {
    position: relative;
}

.sr-range {
    cursor: pointer;

    width: 100%;
    height: 28px;

    appearance: none;
    background: transparent;
    pointer-events: none;
}

.sr-range-hit {
    position: absolute;
    inset: 0;
    cursor: pointer;
    touch-action: pan-y;
    background: transparent;
}

.sr-range:disabled {
    cursor: default;
    opacity: 0.5;
}

.sr-range::-webkit-slider-runnable-track {
    height: 6px;
    background: var(--ui-track, var(--border));
    border-radius: 999px;
}

.sr-range::-webkit-slider-thumb {
    width: 18px;
    height: 18px;
    margin-top: -6px;

    appearance: none;
    background: var(--accent);
    border: 4px solid var(--ui-surface, var(--surface));
    border-radius: 50%;
    box-shadow: var(--ui-shadow, 0 8px 18px rgb(15 23 42 / 18%));

    transition:
        transform 0.15s ease,
        box-shadow 0.15s ease;
}

.sr-range:active::-webkit-slider-thumb {
    transform: scale(1.05);
}

.sr-range::-moz-range-track {
    height: 6px;
    background: var(--ui-track, var(--border));
    border-radius: 999px;
}

.sr-range::-moz-range-thumb {
    width: 18px;
    height: 18px;

    background: var(--accent);
    border: 4px solid var(--ui-surface, var(--surface));
    border-radius: 50%;
    box-shadow: var(--ui-shadow, 0 8px 18px rgb(15 23 42 / 18%));

    transition:
        transform 0.15s ease,
        box-shadow 0.15s ease;
}

.sr-range:active::-moz-range-thumb {
    transform: scale(1.05);
}
</style>
