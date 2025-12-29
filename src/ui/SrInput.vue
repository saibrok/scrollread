<script setup>
defineOptions({ inheritAttrs: false });

const props = defineProps({
    modelValue: {
        type: [String, Number],
        required: true,
    },
    type: {
        type: String,
        default: 'text',
    },
    min: {
        type: [String, Number],
        default: undefined,
    },
    max: {
        type: [String, Number],
        default: undefined,
    },
    step: {
        type: [String, Number],
        default: undefined,
    },
    label: {
        type: String,
        default: '',
    },
    width: {
        type: [String, Number],
        default: '',
    },
});

const emit = defineEmits(['update:modelValue']);

function onInput(event) {
    emit('update:modelValue', event.target.value);
}

function parseNumber(value) {
    const parsed = Number(value);

    return Number.isNaN(parsed) ? 0 : parsed;
}

function clampNumber(value) {
    let next = value;

    if (props.min !== undefined && props.min !== '') {
        next = Math.max(next, parseNumber(props.min));
    }
    if (props.max !== undefined && props.max !== '') {
        next = Math.min(next, parseNumber(props.max));
    }

    return next;
}

function resolveStep() {
    if (props.step === undefined || props.step === '') {
        return 1;
    }

    const parsed = Number(props.step);

    return Number.isNaN(parsed) ? 1 : parsed;
}

function onWheel(event) {
    if (props.type !== 'number') {
        return;
    }
    event.preventDefault();

    const direction = event.deltaY < 0 ? 1 : -1;
    const step = resolveStep();
    const current = parseNumber(event.target.value);
    const next = clampNumber(current + step * direction);

    event.target.value = String(next);
    emit('update:modelValue', next);
}

function resolveWidth(value) {
    if (value === null || value === undefined || value === '') {
        return undefined;
    }
    if (typeof value === 'number') {
        return `${value}px`;
    }

    return value;
}
</script>

<template>
    <div class="sr-input-field">
        <div
            class="sr-input__control"
            :style="{ width: resolveWidth(props.width) }"
        >
            <div
                v-if="props.label"
                class="sr-input__label"
            >
                {{ props.label }}
            </div>
            <input
                :type="props.type"
                :min="props.min"
                :max="props.max"
                :step="props.step"
                :value="props.modelValue"
                :class="['sr-input', { 'sr-input--labeled': Boolean(props.label), 'sr-input--append': Boolean($slots['append-inner']) }]"
                @input="onInput"
                @wheel="onWheel"
            />
            <span
                v-if="$slots['append-inner']"
                class="sr-input__append"
            >
                <slot name="append-inner" />
            </span>
        </div>
    </div>
</template>

<style scoped>
.sr-input-field {
    display: inline-flex;
    gap: 6px;
    align-items: center;
}

.sr-input__control {
    position: relative;
    display: inline-flex;
    width: 100%;
}

.sr-input {
    width: 100%;
    padding: 8px 14px;
}

.sr-input--labeled {
    padding-top: 12px;
}

.sr-input--append {
    padding-right: 36px;
}

.sr-input__label {
    position: absolute;
    top: -8px;
    left: 12px;

    padding: 0 6px;

    font-size: 10px;
    color: var(--ui-text-muted, var(--muted, var(--text)));
    text-transform: uppercase;
    letter-spacing: 0.08em;

    background: var(--ui-surface, var(--reader-surface, var(--surface)));
}

.sr-input__append {
    pointer-events: none;

    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);

    font-size: 12px;
    color: var(--ui-text-muted, var(--muted, var(--text)));
}
</style>
