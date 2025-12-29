<script setup>
import { computed } from 'vue';

import { ALIGN_OPTIONS, FONT_OPTIONS, MINIMAP_SCALE_OPTIONS } from '../utils/readerOptions';

import SrButton from '../../../ui/SrButton.vue';
import SrInput from '../../../ui/SrInput.vue';
import SrRange from '../../../ui/SrRange.vue';
import SrSelect from '../../../ui/SrSelect.vue';
import SrToggleButton from '../../../ui/SrToggleButton.vue';

const props = defineProps({
    settings: {
        type: Object,
        required: true,
    },
    isFullscreen: {
        type: Boolean,
        required: true,
    },
    isCompact: {
        type: Boolean,
        required: true,
    },
    showSpeedInBar: {
        type: Boolean,
        default: true,
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

const emit = defineEmits(['update', 'fullscreen', 'update-end', 'speed-multiplier', 'help']);

const fontOptions = FONT_OPTIONS;
const alignOptions = ALIGN_OPTIONS;
const minimapScaleOptions = MINIMAP_SCALE_OPTIONS;

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

function toggleMinimap() {
    const nextValue = !(props.settings.showMinimap !== false);

    emitUpdate('showMinimap', nextValue);
    emitUpdateEnd('showMinimap', nextValue);
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

const favoriteKeys = computed(() => (Array.isArray(props.settings.favorites) ? props.settings.favorites : []));

function isFavorite(key) {
    return favoriteKeys.value.includes(key);
}

function toggleFavorite(key) {
    if (isFavorite(key)) {
        const next = favoriteKeys.value.filter((item) => item !== key);

        emitUpdate('favorites', next);
        emitUpdateEnd('favorites', next);

        return;
    }
    const next = [...favoriteKeys.value, key];

    emitUpdate('favorites', next);
    emitUpdateEnd('favorites', next);
}
</script>

<template>
    <div class="reader-panel">
        <div class="reader-panel__bar">
            <div class="reader-panel__title">Настройки текста</div>

            <div
                v-if="props.showSpeedInBar"
                class="reader-panel__speed"
            >
                <label class="reader-panel__speed-label">Скорость</label>
                <SrToggleButton
                    class="reader-btn reader-panel__icon"
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
                <SrRange
                    :model-value="props.settings.speed"
                    min="100"
                    max="2000"
                    step="10"
                    @update:model-value="emitUpdate('speed', $event)"
                    @change="emitUpdateEnd('speed', $event)"
                />
                <div class="reader-panel__speed-value">{{ props.settings.speed }}</div>
                <SrToggleButton
                    class="reader-btn reader-panel__icon"
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

            <div class="separator"></div>

            <SrButton
                class="reader-btn reader-panel__icon"
                type="button"
                aria-label="Горячие клавиши"
                @click="emit('help')"
            >
                <span
                    class="material-icons"
                    aria-hidden="true"
                >
                    help_outline
                </span>
            </SrButton>
            <SrButton
                class="reader-btn reader-panel__icon"
                type="button"
                :variant="props.isFullscreen ? 'accent' : 'default'"
                aria-label="Полный экран"
                @click="emit('fullscreen')"
            >
                <span
                    class="material-icons"
                    aria-hidden="true"
                >
                    {{ props.isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}
                </span>
            </SrButton>
        </div>
        <div class="reader-panel__body">
            <section class="reader-group">
                <div class="reader-group__title">Темп</div>
                <div class="reader-group__grid">
                    <div class="reader-control">
                        <div class="reader-control__header">
                            <div class="reader-label-row">
                                <label
                                    class="reader-label"
                                    for="readerSpeed"
                                    >Скорость</label
                                >
                                <SrToggleButton
                                    class="reader-btn reader-panel__favorite"
                                    type="button"
                                    :active="isFavorite('speed')"
                                    active-variant="ghost"
                                    inactive-variant="ghost"
                                    aria-label="В избранное"
                                    @click="toggleFavorite('speed')"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        {{ isFavorite('speed') ? 'favorite' : 'favorite_border' }}
                                    </span>
                                </SrToggleButton>
                            </div>
                            <div class="reader-control__meta">
                                <div class="reader-value">
                                    <span>{{ props.settings.speed }}</span> зн/мин
                                </div>
                            </div>
                        </div>
                        <SrRange
                            id="readerSpeed"
                            :model-value="props.settings.speed"
                            min="100"
                            max="2000"
                            step="10"
                            @update:model-value="emitUpdate('speed', $event)"
                            @change="emitUpdateEnd('speed', $event)"
                        />
                    </div>
                    <div class="reader-control">
                        <div class="reader-control__header">
                            <div class="reader-label-row">
                                <label
                                    class="reader-label"
                                    for="startDelay"
                                    >Задержка</label
                                >
                                <SrToggleButton
                                    class="reader-btn reader-panel__favorite"
                                    type="button"
                                    :active="isFavorite('startDelay')"
                                    active-variant="ghost"
                                    inactive-variant="ghost"
                                    aria-label="В избранное"
                                    @click="toggleFavorite('startDelay')"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        {{ isFavorite('startDelay') ? 'favorite' : 'favorite_border' }}
                                    </span>
                                </SrToggleButton>
                            </div>
                            <div class="reader-control__meta">
                                <div class="reader-value">
                                    <span>{{ props.settings.startDelay }}</span> с
                                </div>
                            </div>
                        </div>
                        <SrInput
                            id="startDelay"
                            type="number"
                            min="0"
                            max="60"
                            step="1"
                            :model-value="props.settings.startDelay"
                            @update:model-value="handleDelayInput"
                        >
                            <template #append-inner>с</template>
                        </SrInput>
                    </div>
                    <div class="reader-control">
                        <div class="reader-control__header">
                            <div class="reader-label-row">
                                <label
                                    class="reader-label"
                                    for="speedMultiplier"
                                    >Множитель</label
                                >
                                <SrToggleButton
                                    class="reader-btn reader-panel__favorite"
                                    type="button"
                                    :active="isFavorite('speedMultiplier')"
                                    active-variant="ghost"
                                    inactive-variant="ghost"
                                    aria-label="В избранное"
                                    @click="toggleFavorite('speedMultiplier')"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        {{ isFavorite('speedMultiplier') ? 'favorite' : 'favorite_border' }}
                                    </span>
                                </SrToggleButton>
                            </div>
                            <div class="reader-control__meta">
                                <div class="reader-value">{{ multiplierLabel }}</div>
                            </div>
                        </div>
                        <div
                            id="speedMultiplier"
                            class="reader-panel__multipliers"
                        >
                            <SrToggleButton
                                class="reader-btn reader-panel__icon"
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
                                class="reader-btn reader-panel__icon"
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
                    </div>
                    <div></div>
                    <div class="reader-control">
                        <div class="reader-control__header">
                            <div class="reader-label-row">
                                <label class="reader-label">Время сессии</label>
                                <SrToggleButton
                                    class="reader-btn reader-panel__favorite"
                                    type="button"
                                    :active="isFavorite('sessionTime')"
                                    active-variant="ghost"
                                    inactive-variant="ghost"
                                    aria-label="В избранное"
                                    @click="toggleFavorite('sessionTime')"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        {{ isFavorite('sessionTime') ? 'favorite' : 'favorite_border' }}
                                    </span>
                                </SrToggleButton>
                            </div>
                            <div class="reader-control__meta">
                                <div class="reader-value">{{ props.sessionTimerText }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="reader-control">
                        <div class="reader-control__header">
                            <div class="reader-label-row">
                                <label class="reader-label">Оценка времени</label>
                                <SrToggleButton
                                    class="reader-btn reader-panel__favorite"
                                    type="button"
                                    :active="isFavorite('estimateTime')"
                                    active-variant="ghost"
                                    inactive-variant="ghost"
                                    aria-label="В избранное"
                                    @click="toggleFavorite('estimateTime')"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        {{ isFavorite('estimateTime') ? 'favorite' : 'favorite_border' }}
                                    </span>
                                </SrToggleButton>
                            </div>
                            <div class="reader-control__meta">
                                <div class="reader-value">{{ props.timerText }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="reader-group">
                <div class="reader-group__title">Текст</div>
                <div class="reader-group__grid">
                    <div class="reader-control">
                        <div class="reader-control__header">
                            <div class="reader-label-row">
                                <label
                                    class="reader-label"
                                    for="fontSize"
                                    >Размер</label
                                >
                                <SrToggleButton
                                    class="reader-btn reader-panel__favorite"
                                    type="button"
                                    :active="isFavorite('fontSize')"
                                    active-variant="ghost"
                                    inactive-variant="ghost"
                                    aria-label="В избранное"
                                    @click="toggleFavorite('fontSize')"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        {{ isFavorite('fontSize') ? 'favorite' : 'favorite_border' }}
                                    </span>
                                </SrToggleButton>
                            </div>
                            <div class="reader-control__meta">
                                <div class="reader-value">
                                    <span>{{ props.settings.fontSize }}</span> px
                                </div>
                            </div>
                        </div>
                        <SrRange
                            id="fontSize"
                            :model-value="props.settings.fontSize"
                            min="10"
                            max="100"
                            step="1"
                            @update:model-value="emitUpdate('fontSize', $event)"
                            @change="emitUpdateEnd('fontSize', $event)"
                        />
                    </div>
                    <div class="reader-control">
                        <div class="reader-control__header">
                            <div class="reader-label-row">
                                <label
                                    class="reader-label"
                                    for="lineHeight"
                                    >Интерлиньяж</label
                                >
                                <SrToggleButton
                                    class="reader-btn reader-panel__favorite"
                                    type="button"
                                    :active="isFavorite('lineHeight')"
                                    active-variant="ghost"
                                    inactive-variant="ghost"
                                    aria-label="В избранное"
                                    @click="toggleFavorite('lineHeight')"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        {{ isFavorite('lineHeight') ? 'favorite' : 'favorite_border' }}
                                    </span>
                                </SrToggleButton>
                            </div>
                            <div class="reader-control__meta">
                                <div class="reader-value">
                                    <span>{{ props.settings.lineHeight }}</span>
                                </div>
                            </div>
                        </div>
                        <SrRange
                            id="lineHeight"
                            :model-value="props.settings.lineHeight"
                            min="1"
                            max="2.4"
                            step="0.1"
                            @update:model-value="emitUpdate('lineHeight', $event)"
                            @change="emitUpdateEnd('lineHeight', $event)"
                        />
                    </div>
                    <div class="reader-control">
                        <div class="reader-control__header">
                            <div class="reader-label-row">
                                <label
                                    class="reader-label"
                                    for="paragraphGap"
                                    >Отступ абзаца</label
                                >
                                <SrToggleButton
                                    class="reader-btn reader-panel__favorite"
                                    type="button"
                                    :active="isFavorite('paragraphGap')"
                                    active-variant="ghost"
                                    inactive-variant="ghost"
                                    aria-label="В избранное"
                                    @click="toggleFavorite('paragraphGap')"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        {{ isFavorite('paragraphGap') ? 'favorite' : 'favorite_border' }}
                                    </span>
                                </SrToggleButton>
                            </div>
                            <div class="reader-control__meta">
                                <div class="reader-value">
                                    <span>{{ props.settings.paragraphGap }}</span> em
                                </div>
                            </div>
                        </div>
                        <SrRange
                            id="paragraphGap"
                            :model-value="props.settings.paragraphGap"
                            min="0"
                            max="2"
                            step="0.1"
                            @update:model-value="emitUpdate('paragraphGap', $event)"
                            @change="emitUpdateEnd('paragraphGap', $event)"
                        />
                    </div>
                    <div class="reader-control">
                        <div class="reader-control__header">
                            <div class="reader-label-row">
                                <label
                                    class="reader-label"
                                    for="indent"
                                    >Красная строка</label
                                >
                                <SrToggleButton
                                    class="reader-btn reader-panel__favorite"
                                    type="button"
                                    :active="isFavorite('indent')"
                                    active-variant="ghost"
                                    inactive-variant="ghost"
                                    aria-label="В избранное"
                                    @click="toggleFavorite('indent')"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        {{ isFavorite('indent') ? 'favorite' : 'favorite_border' }}
                                    </span>
                                </SrToggleButton>
                            </div>
                            <div class="reader-control__meta">
                                <div class="reader-value">
                                    <span>{{ props.settings.indent }}</span> em
                                </div>
                            </div>
                        </div>
                        <SrRange
                            id="indent"
                            :model-value="props.settings.indent"
                            min="0"
                            max="4"
                            step="0.1"
                            :disabled="props.settings.align === 'center'"
                            @update:model-value="emitUpdate('indent', $event)"
                            @change="emitUpdateEnd('indent', $event)"
                        />
                    </div>
                    <div class="reader-control">
                        <div class="reader-control__header">
                            <div class="reader-label-row">
                                <label
                                    class="reader-label"
                                    for="font"
                                    >Шрифт</label
                                >
                                <SrToggleButton
                                    class="reader-btn reader-panel__favorite"
                                    type="button"
                                    :active="isFavorite('font')"
                                    active-variant="ghost"
                                    inactive-variant="ghost"
                                    aria-label="В избранное"
                                    @click="toggleFavorite('font')"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        {{ isFavorite('font') ? 'favorite' : 'favorite_border' }}
                                    </span>
                                </SrToggleButton>
                            </div>
                        </div>
                        <SrSelect
                            id="font"
                            :model-value="props.settings.font"
                            :items="fontOptions"
                            @update:model-value="handleSelectUpdate('font', $event)"
                        />
                    </div>
                    <div class="reader-control">
                        <div class="reader-control__header">
                            <div class="reader-label-row">
                                <label
                                    class="reader-label"
                                    for="align"
                                    >Положение</label
                                >
                                <SrToggleButton
                                    class="reader-btn reader-panel__favorite"
                                    type="button"
                                    :active="isFavorite('align')"
                                    active-variant="ghost"
                                    inactive-variant="ghost"
                                    aria-label="В избранное"
                                    @click="toggleFavorite('align')"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        {{ isFavorite('align') ? 'favorite' : 'favorite_border' }}
                                    </span>
                                </SrToggleButton>
                            </div>
                        </div>
                        <SrSelect
                            id="align"
                            :model-value="props.settings.align"
                            :items="alignOptions"
                            @update:model-value="handleSelectUpdate('align', $event)"
                        />
                    </div>
                </div>
            </section>

            <section class="reader-group">
                <div class="reader-group__title">Окно</div>
                <div class="reader-group__grid">
                    <div class="reader-control">
                        <div class="reader-control__header">
                            <div class="reader-label-row">
                                <label
                                    class="reader-label"
                                    for="padding"
                                    >Отступы</label
                                >
                                <SrToggleButton
                                    class="reader-btn reader-panel__favorite"
                                    type="button"
                                    :active="isFavorite('padding')"
                                    active-variant="ghost"
                                    inactive-variant="ghost"
                                    aria-label="В избранное"
                                    @click="toggleFavorite('padding')"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        {{ isFavorite('padding') ? 'favorite' : 'favorite_border' }}
                                    </span>
                                </SrToggleButton>
                            </div>
                            <div class="reader-control__meta">
                                <div class="reader-value">
                                    <span>{{ props.settings.padding }}</span> px
                                </div>
                            </div>
                        </div>
                        <SrRange
                            id="padding"
                            :model-value="props.settings.padding"
                            min="0"
                            max="1000"
                            step="10"
                            @update:model-value="emitUpdate('padding', $event)"
                            @change="emitUpdateEnd('padding', $event)"
                        />
                    </div>
                    <div class="reader-control">
                        <div class="reader-control__header">
                            <div class="reader-label-row">
                                <label
                                    class="reader-label"
                                    for="overlaySize"
                                    >Размер окна</label
                                >
                                <SrToggleButton
                                    class="reader-btn reader-panel__favorite"
                                    type="button"
                                    :active="isFavorite('overlaySize')"
                                    active-variant="ghost"
                                    inactive-variant="ghost"
                                    aria-label="В избранное"
                                    @click="toggleFavorite('overlaySize')"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        {{ isFavorite('overlaySize') ? 'favorite' : 'favorite_border' }}
                                    </span>
                                </SrToggleButton>
                            </div>
                            <div class="reader-control__meta">
                                <div class="reader-value">
                                    <span>{{ props.settings.overlaySize }}</span> стр
                                </div>
                            </div>
                        </div>
                        <SrRange
                            id="overlaySize"
                            :model-value="props.settings.overlaySize"
                            min="1"
                            max="10"
                            step="1"
                            @update:model-value="emitUpdate('overlaySize', $event)"
                            @change="emitUpdateEnd('overlaySize', $event)"
                        />
                    </div>
                    <div class="reader-control">
                        <div class="reader-control__header">
                            <div class="reader-label-row">
                                <label
                                    class="reader-label"
                                    for="overlayOpacity"
                                    >Прозрачность</label
                                >
                                <SrToggleButton
                                    class="reader-btn reader-panel__favorite"
                                    type="button"
                                    :active="isFavorite('overlayOpacity')"
                                    active-variant="ghost"
                                    inactive-variant="ghost"
                                    aria-label="В избранное"
                                    @click="toggleFavorite('overlayOpacity')"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        {{ isFavorite('overlayOpacity') ? 'favorite' : 'favorite_border' }}
                                    </span>
                                </SrToggleButton>
                            </div>
                            <div class="reader-control__meta">
                                <div class="reader-value">
                                    <span>{{ props.settings.overlayOpacity }}</span
                                    >%
                                </div>
                            </div>
                        </div>
                        <SrRange
                            id="overlayOpacity"
                            :model-value="props.settings.overlayOpacity"
                            min="0"
                            max="100"
                            step="5"
                            @update:model-value="emitUpdate('overlayOpacity', $event)"
                            @change="emitUpdateEnd('overlayOpacity', $event)"
                        />
                    </div>
                </div>
            </section>

            <section class="reader-group">
                <div class="reader-group__title">Экран</div>
                <div class="reader-group__grid">
                    <div class="reader-control">
                        <div class="reader-control__header">
                            <div class="reader-label-row">
                                <label
                                    class="reader-label"
                                    for="brightness"
                                    >Яркость</label
                                >
                                <SrToggleButton
                                    class="reader-btn reader-panel__favorite"
                                    type="button"
                                    :active="isFavorite('brightness')"
                                    active-variant="ghost"
                                    inactive-variant="ghost"
                                    aria-label="В избранное"
                                    @click="toggleFavorite('brightness')"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        {{ isFavorite('brightness') ? 'favorite' : 'favorite_border' }}
                                    </span>
                                </SrToggleButton>
                            </div>
                            <div class="reader-control__meta">
                                <div class="reader-value">
                                    <span>{{ props.settings.brightness }}</span
                                    >%
                                </div>
                            </div>
                        </div>
                        <SrRange
                            id="brightness"
                            :model-value="props.settings.brightness"
                            min="50"
                            max="150"
                            step="5"
                            @update:model-value="emitUpdate('brightness', $event)"
                            @change="emitUpdateEnd('brightness', $event)"
                        />
                    </div>
                    <div class="reader-control">
                        <div class="reader-control__header">
                            <div class="reader-label-row">
                                <label
                                    class="reader-label"
                                    for="contrast"
                                    >Контраст</label
                                >
                                <SrToggleButton
                                    class="reader-btn reader-panel__favorite"
                                    type="button"
                                    :active="isFavorite('contrast')"
                                    active-variant="ghost"
                                    inactive-variant="ghost"
                                    aria-label="В избранное"
                                    @click="toggleFavorite('contrast')"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        {{ isFavorite('contrast') ? 'favorite' : 'favorite_border' }}
                                    </span>
                                </SrToggleButton>
                            </div>
                            <div class="reader-control__meta">
                                <div class="reader-value">
                                    <span>{{ props.settings.contrast }}</span
                                    >%
                                </div>
                            </div>
                        </div>
                        <SrRange
                            id="contrast"
                            :model-value="props.settings.contrast"
                            min="50"
                            max="150"
                            step="5"
                            @update:model-value="emitUpdate('contrast', $event)"
                            @change="emitUpdateEnd('contrast', $event)"
                        />
                    </div>
                    <div class="reader-control">
                        <div class="reader-control__header">
                            <div class="reader-label-row">
                                <label
                                    class="reader-label"
                                    for="sepia"
                                    >Сепия</label
                                >
                                <SrToggleButton
                                    class="reader-btn reader-panel__favorite"
                                    type="button"
                                    :active="isFavorite('sepia')"
                                    active-variant="ghost"
                                    inactive-variant="ghost"
                                    aria-label="В избранное"
                                    @click="toggleFavorite('sepia')"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        {{ isFavorite('sepia') ? 'favorite' : 'favorite_border' }}
                                    </span>
                                </SrToggleButton>
                            </div>
                            <div class="reader-control__meta">
                                <div class="reader-value">
                                    <span>{{ props.settings.sepia }}</span
                                    >%
                                </div>
                            </div>
                        </div>
                        <SrRange
                            id="sepia"
                            :model-value="props.settings.sepia"
                            min="0"
                            max="100"
                            step="5"
                            @update:model-value="emitUpdate('sepia', $event)"
                            @change="emitUpdateEnd('sepia', $event)"
                        />
                    </div>
                </div>
            </section>

            <section class="reader-group">
                <div class="reader-group__title">Миникарта</div>
                <div class="reader-group__grid">
                    <div class="reader-control">
                        <div class="reader-control__header">
                            <div class="reader-label-row">
                                <label
                                    class="reader-label"
                                    for="showMinimap"
                                    >Показывать</label
                                >
                                <SrToggleButton
                                    class="reader-btn reader-panel__favorite"
                                    type="button"
                                    :active="isFavorite('showMinimap')"
                                    active-variant="ghost"
                                    inactive-variant="ghost"
                                    aria-label="В избранное"
                                    @click="toggleFavorite('showMinimap')"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        {{ isFavorite('showMinimap') ? 'favorite' : 'favorite_border' }}
                                    </span>
                                </SrToggleButton>
                            </div>
                        </div>
                        <SrToggleButton
                            id="showMinimap"
                            class="reader-btn reader-panel__icon"
                            type="button"
                            aria-label="Показывать миникарту"
                            :active="props.settings.showMinimap !== false"
                            @click="toggleMinimap"
                        >
                            <span
                                class="material-icons"
                                aria-hidden="true"
                            >
                                chrome_reader_mode
                            </span>
                        </SrToggleButton>
                    </div>
                    <div class="reader-control">
                        <div class="reader-control__header">
                            <div class="reader-label-row">
                                <label
                                    class="reader-label"
                                    for="minimapWidth"
                                    >Ширина</label
                                >
                                <SrToggleButton
                                    class="reader-btn reader-panel__favorite"
                                    type="button"
                                    :active="isFavorite('minimapWidth')"
                                    active-variant="ghost"
                                    inactive-variant="ghost"
                                    aria-label="В избранное"
                                    @click="toggleFavorite('minimapWidth')"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        {{ isFavorite('minimapWidth') ? 'favorite' : 'favorite_border' }}
                                    </span>
                                </SrToggleButton>
                            </div>
                            <div class="reader-control__meta">
                                <div class="reader-value">
                                    <span>{{ props.settings.minimapWidth }}</span> px
                                </div>
                            </div>
                        </div>
                        <SrRange
                            id="minimapWidth"
                            :model-value="props.settings.minimapWidth"
                            min="40"
                            max="200"
                            step="5"
                            @update:model-value="emitUpdate('minimapWidth', $event)"
                            @change="emitUpdateEnd('minimapWidth', $event)"
                        />
                    </div>
                    <div class="reader-control">
                        <div class="reader-control__header">
                            <div class="reader-label-row">
                                <label
                                    class="reader-label"
                                    for="minimapScale"
                                    >Масштаб</label
                                >
                                <SrToggleButton
                                    class="reader-btn reader-panel__favorite"
                                    type="button"
                                    :active="isFavorite('minimapScale')"
                                    active-variant="ghost"
                                    inactive-variant="ghost"
                                    aria-label="В избранное"
                                    @click="toggleFavorite('minimapScale')"
                                >
                                    <span
                                        class="material-icons"
                                        aria-hidden="true"
                                    >
                                        {{ isFavorite('minimapScale') ? 'favorite' : 'favorite_border' }}
                                    </span>
                                </SrToggleButton>
                            </div>
                        </div>
                        <SrSelect
                            id="minimapScale"
                            :model-value="props.settings.minimapScale"
                            :items="minimapScaleOptions"
                            @update:model-value="handleSelectUpdate('minimapScale', $event)"
                        />
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped>
.reader-panel {
    position: relative;
    z-index: 10;

    display: flex;
    flex-direction: column;
    gap: 14px;

    padding-bottom: 16px;

    border-bottom: 1px solid var(--reader-border);
}

.reader-panel__bar {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
}

.reader-panel__title {
    font-size: 13px;
    color: var(--reader-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.12em;
}

.reader-panel__speed {
    display: flex;
    gap: 10px;
    align-items: center;
}

.reader-panel__speed-label {
    font-size: 11px;
    color: var(--reader-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    white-space: nowrap;
}

.reader-panel__speed .sr-range {
    min-width: 140px;
    max-width: 240px;
}

.reader-panel__speed-value {
    font-size: 12px;
    color: var(--reader-text);
    white-space: nowrap;
}

.reader-panel__multipliers {
    display: flex;
    gap: 10px;
    align-items: center;
}

/* .reader-panel__icon {
    padding: 6px 8px;
    font-size: 12px;
} */

.reader-panel__icon .material-icons {
    font-size: 20px;
}

.reader-panel__body {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.reader-group {
    display: flex;
    flex-direction: column;
    gap: 10px;

    padding: 12px;

    background: var(--reader-surface);
    border: 1px solid var(--reader-border);
    border-radius: 14px;
}

.reader-group__title {
    font-size: 11px;
    color: var(--reader-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.12em;
}

.reader-group__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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

.reader-panel__favorite {
    padding: 2px;
}

.reader-panel__favorite .material-icons {
    font-size: 16px;
}
</style>
