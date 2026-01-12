<script setup>
import { computed } from 'vue';

import { normalizeFavorites } from '../utils/favorites';
import { ALIGN_OPTIONS, FONT_OPTIONS, MINIMAP_SCALE_OPTIONS } from '../utils/readerOptions';
import { buildReaderSettingsSchema } from '../utils/readerSettingsSchema';

import SrInput from '../../../ui/SrInput.vue';
import SrRange from '../../../ui/SrRange.vue';
import SrSelect from '../../../ui/SrSelect.vue';
import SrToggleButton from '../../../ui/SrToggleButton.vue';

const props = defineProps({
    settings: {
        type: Object,
        required: true,
    },
    speedMultiplier: {
        type: Number,
        default: 1,
    },
    timerText: {
        type: String,
        default: '',
    },
    sessionTimerText: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['update', 'update-end', 'speed-multiplier']);

function emitUpdate(key, value) {
    emit('update', { key, value });
}

function emitUpdateEnd(key, value) {
    emit('update-end', { key, value });
}

function handleSelectUpdate(key, value) {
    emitUpdate(key, value);
    emitUpdateEnd(key, value);
}

function clampDelay(value) {
    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
        return 0;
    }

    return Math.min(60, Math.max(0, parsed));
}

function handleDelayInput(value) {
    const nextValue = clampDelay(value);

    emitUpdate('startDelay', nextValue);
    emitUpdateEnd('startDelay', nextValue);
}

function toggleMultiplier(value) {
    const nextMultiplier = props.speedMultiplier === value ? 1 : value;

    emit('speed-multiplier', nextMultiplier);
}

const multiplierLabel = computed(() => {
    if (props.speedMultiplier === 2) {
        return 'x2';
    }
    if (props.speedMultiplier === 0.5) {
        return 'x0.5';
    }

    return 'x1';
});

const favoriteMap = computed(() => normalizeFavorites(props.settings.favorites));

const settingsGroups = computed(() =>
    buildReaderSettingsSchema({
        settings: props.settings,
        multiplierLabel: multiplierLabel.value,
        timerText: props.timerText,
        sessionTimerText: props.sessionTimerText,
        options: {
            fonts: FONT_OPTIONS,
            align: ALIGN_OPTIONS,
            minimapScale: MINIMAP_SCALE_OPTIONS,
        },
    }),
);

function isFavorite(key) {
    return Boolean(favoriteMap.value[key]);
}

function toggleFavorite(key) {
    const next = { ...favoriteMap.value, [key]: !favoriteMap.value[key] };

    emitUpdate('favorites', next);
    emitUpdateEnd('favorites', next);
}

function handleRangeUpdate(item, value) {
    emitUpdate(item.key, value);
}

function handleRangeChange(item, value) {
    emitUpdateEnd(item.key, value);
}

function handleNumberUpdate(item, value) {
    if (item.key === 'startDelay') {
        handleDelayInput(value);

        return;
    }

    emitUpdate(item.key, value);
    emitUpdateEnd(item.key, value);
}

function handleSelect(item, value) {
    handleSelectUpdate(item.key, value);
}

function handleToggle(item) {
    const current = item.toggleDefaultTrue ? props.settings[item.key] !== false : Boolean(props.settings[item.key]);
    const nextValue = !current;

    emitUpdate(item.key, nextValue);
    emitUpdateEnd(item.key, nextValue);
}
</script>

<template>
    <div class="reader-settings">
        <div class="reader-settings__body">
            <section
                v-for="group in settingsGroups"
                :key="group.id"
                class="reader-group"
            >
                <div class="reader-group__title">{{ group.title }}</div>
                <div class="reader-group__grid">
                    <div
                        v-for="item in group.items"
                        :key="item.key"
                        class="reader-control"
                    >
                        <div class="reader-control__header">
                            <div class="reader-label-row">
                                <SrToggleButton
                                    v-if="item.favorite !== false"
                                    class="reader-btn reader-settings__favorite"
                                    type="button"
                                    :active="isFavorite(item.key)"
                                    active-variant="ghost"
                                    inactive-variant="ghost"
                                    aria-label="В избранное"
                                    @click="toggleFavorite(item.key)"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        {{ isFavorite(item.key) ? 'favorite' : 'favorite_border' }}
                                    </span>
                                </SrToggleButton>
                                <label
                                    class="reader-label"
                                    :for="item.controlId || null"
                                >
                                    {{ item.label }}
                                </label>
                            </div>
                            <div
                                v-if="item.meta !== undefined && item.meta !== null"
                                class="reader-control__meta"
                            >
                                <div class="reader-value">{{ item.meta }}</div>
                            </div>
                        </div>
                        <template v-if="item.type === 'range'">
                            <SrRange
                                :id="item.controlId"
                                :model-value="props.settings[item.key]"
                                :min="item.min"
                                :max="item.max"
                                :step="item.step"
                                :disabled="item.disabled"
                                @update:model-value="handleRangeUpdate(item, $event)"
                                @change="handleRangeChange(item, $event)"
                            />
                        </template>
                        <template v-else-if="item.type === 'number'">
                            <SrInput
                                :id="item.controlId"
                                type="number"
                                :min="item.min"
                                :max="item.max"
                                :step="item.step"
                                :model-value="props.settings[item.key]"
                                @update:model-value="handleNumberUpdate(item, $event)"
                            >
                                <template
                                    v-if="item.appendInner"
                                    #append-inner
                                >
                                    {{ item.appendInner }}
                                </template>
                            </SrInput>
                        </template>
                        <template v-else-if="item.type === 'select'">
                            <SrSelect
                                :id="item.controlId"
                                :model-value="props.settings[item.key]"
                                :items="item.options"
                                @update:model-value="handleSelect(item, $event)"
                            />
                        </template>
                        <template v-else-if="item.type === 'toggle'">
                            <SrToggleButton
                                :id="item.controlId"
                                class="reader-btn reader-settings__icon"
                                type="button"
                                :aria-label="item.ariaLabel"
                                :active="item.active"
                                @click="handleToggle(item)"
                            >
                                <span
                                    class="material-icons"
                                    aria-hidden="true"
                                >
                                    {{ item.icon }}
                                </span>
                            </SrToggleButton>
                        </template>
                        <template v-else-if="item.type === 'multiplier'">
                            <div
                                :id="item.controlId"
                                class="reader-settings__multipliers"
                            >
                                <SrToggleButton
                                    class="reader-btn reader-settings__icon"
                                    type="button"
                                    aria-label="Замедлить x0.5"
                                    :active="props.speedMultiplier === 0.5"
                                    @click="toggleMultiplier(0.5)"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        fast_rewind
                                    </span>
                                </SrToggleButton>
                                <SrToggleButton
                                    class="reader-btn reader-settings__icon"
                                    type="button"
                                    aria-label="Ускорить x2"
                                    :active="props.speedMultiplier === 2"
                                    @click="toggleMultiplier(2)"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        fast_forward
                                    </span>
                                </SrToggleButton>
                            </div>
                        </template>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped>
.reader-settings {
    position: relative;
    z-index: 10;

    display: flex;
    flex-direction: column;
    gap: 14px;

    padding-bottom: 16px;

    border-bottom: 1px solid var(--reader-border);
}

.reader-settings__multipliers {
    display: flex;
    gap: 10px;
    align-items: center;
}

/* .reader-settings__icon {
    padding: 6px 8px;
    font-size: 12px;
} */

.reader-settings__icon .material-icons {
    font-size: 20px;
}

.reader-settings__body {
    display: flex;
    flex-direction: column;
}

.reader-group {
    position: relative;

    display: flex;
    flex-direction: column;
    gap: 10px;

    margin-top: 12px;
    padding: 12px;

    background: var(--reader-surface);
    border: 1px solid var(--reader-border);
    border-radius: 14px;
}

.reader-group__title {
    position: absolute;
    top: -5px;

    padding: 0 8px;

    font-size: 10px;
    color: var(--reader-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.12em;

    background: var(--reader-surface);
}

.reader-group__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.reader-control {
    display: flex;
    flex-direction: column;
    gap: 8px;

    font-size: 12px;
    color: var(--reader-text-muted);
}

.reader-control__header {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
}

.reader-label-row {
    display: inline-flex;
    gap: 6px;
    align-items: center;
}

.reader-control__meta {
    display: inline-flex;
    gap: 8px;
    align-items: center;
}

.reader-label {
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.reader-control input[type='range'],
.reader-control select {
    width: 100%;
}

.reader-value {
    font-size: 12px;
    color: var(--reader-text);
    white-space: nowrap;
}

.reader-settings__favorite {
    padding: 2px;
}

.reader-settings__favorite .material-icons {
    font-size: 16px;
}
</style>
