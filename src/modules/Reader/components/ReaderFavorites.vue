<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import { FAVORITE_GROUPS, normalizeFavorites } from '../utils/favorites';
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
    speedMultiplier: {
        type: Number,
        default: 1,
    },
    timerText: {
        type: String,
        required: true,
    },
    sessionTimerText: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['update-setting', 'speed-multiplier']);

const favoritesRoot = ref(null);
const openFavoriteKey = ref(null);

const speedMultiplierLabel = computed(() => {
    if (props.speedMultiplier === 2) {
        return 'x2';
    }
    if (props.speedMultiplier === 0.5) {
        return 'x0.5';
    }

    return 'x1';
});

const favoriteMap = computed(() => normalizeFavorites(props.settings.favorites));

function getOptionLabel(options, value) {
    const match = options.find((item) => item.value === value);

    return match ? match.text : `${value}`;
}

const favoriteConfig = computed(() => ({
    speed: {
        key: 'speed',
        label: 'Скорость',
        icon: 'speed',
        value: `${props.settings.speed} зн/мин`,
        type: 'range',
        min: 100,
        max: 2000,
        step: 10,
        model: props.settings.speed,
    },
    startDelay: {
        key: 'startDelay',
        label: 'Задержка',
        icon: 'timer',
        value: `${props.settings.startDelay} с`,
        type: 'number',
        min: 0,
        max: 60,
        step: 1,
        model: props.settings.startDelay,
    },
    speedMultiplier: {
        key: 'speedMultiplier',
        label: 'Множитель',
        icon: 'fast_forward',
        value: speedMultiplierLabel.value,
        type: 'multiplier',
    },
    sessionTime: {
        key: 'sessionTime',
        label: 'Время сессии',
        icon: 'timelapse',
        value: props.sessionTimerText,
        type: 'readonly',
    },
    estimateTime: {
        key: 'estimateTime',
        label: 'Оценка времени',
        icon: 'schedule',
        value: props.timerText,
        type: 'readonly',
    },
    fontSize: {
        key: 'fontSize',
        label: 'Размер',
        icon: 'format_size',
        value: `${props.settings.fontSize} px`,
        type: 'range',
        min: 10,
        max: 100,
        step: 1,
        model: props.settings.fontSize,
    },
    lineHeight: {
        key: 'lineHeight',
        label: 'Интерлиньяж',
        icon: 'format_line_spacing',
        value: `${props.settings.lineHeight}`,
        type: 'range',
        min: 1,
        max: 2.4,
        step: 0.1,
        model: props.settings.lineHeight,
    },
    paragraphGap: {
        key: 'paragraphGap',
        label: 'Отступ абзаца',
        icon: 'format_indent_increase',
        value: `${props.settings.paragraphGap} em`,
        type: 'range',
        min: 0,
        max: 2,
        step: 0.1,
        model: props.settings.paragraphGap,
    },
    indent: {
        key: 'indent',
        label: 'Красная строка',
        icon: 'format_indent_increase',
        value: `${props.settings.indent} em`,
        type: 'range',
        min: 0,
        max: 4,
        step: 0.1,
        model: props.settings.indent,
        disabled: props.settings.align === 'center',
    },
    font: {
        key: 'font',
        label: 'Шрифт',
        icon: 'font_download',
        value: getOptionLabel(FONT_OPTIONS, props.settings.font),
        type: 'select',
        model: props.settings.font,
        options: FONT_OPTIONS,
    },
    align: {
        key: 'align',
        label: 'Положение',
        icon: 'format_align_left',
        value: getOptionLabel(ALIGN_OPTIONS, props.settings.align),
        type: 'select',
        model: props.settings.align,
        options: ALIGN_OPTIONS,
    },
    padding: {
        key: 'padding',
        label: 'Отступы',
        icon: 'padding',
        value: `${props.settings.padding} px`,
        type: 'range',
        min: 0,
        max: 1000,
        step: 10,
        model: props.settings.padding,
    },
    overlaySize: {
        key: 'overlaySize',
        label: 'Размер окна',
        icon: 'crop_free',
        value: `${props.settings.overlaySize} стр`,
        type: 'range',
        min: 1,
        max: 10,
        step: 1,
        model: props.settings.overlaySize,
    },
    overlayOpacity: {
        key: 'overlayOpacity',
        label: 'Прозрачность',
        icon: 'opacity',
        value: `${props.settings.overlayOpacity}%`,
        type: 'range',
        min: 0,
        max: 100,
        step: 5,
        model: props.settings.overlayOpacity,
    },
    brightness: {
        key: 'brightness',
        label: 'Яркость',
        icon: 'brightness_6',
        value: `${props.settings.brightness}%`,
        type: 'range',
        min: 50,
        max: 150,
        step: 5,
        model: props.settings.brightness,
    },
    contrast: {
        key: 'contrast',
        label: 'Контраст',
        icon: 'contrast',
        value: `${props.settings.contrast}%`,
        type: 'range',
        min: 50,
        max: 150,
        step: 5,
        model: props.settings.contrast,
    },
    sepia: {
        key: 'sepia',
        label: 'Сепия',
        icon: 'filter_vintage',
        value: `${props.settings.sepia}%`,
        type: 'range',
        min: 0,
        max: 100,
        step: 5,
        model: props.settings.sepia,
    },
    showMinimap: {
        key: 'showMinimap',
        label: 'Миникарта',
        icon: 'map',
        value: props.settings.showMinimap !== false ? 'Вкл' : 'Выкл',
        type: 'toggle',
        model: props.settings.showMinimap !== false,
    },
    minimapWidth: {
        key: 'minimapWidth',
        label: 'Ширина миникарты',
        icon: 'view_sidebar',
        value: `${props.settings.minimapWidth} px`,
        type: 'range',
        min: 40,
        max: 200,
        step: 5,
        model: props.settings.minimapWidth,
    },
    minimapScale: {
        key: 'minimapScale',
        label: 'Масштаб миникарты',
        icon: 'zoom_in',
        value: getOptionLabel(MINIMAP_SCALE_OPTIONS, props.settings.minimapScale),
        type: 'select',
        model: props.settings.minimapScale,
        options: MINIMAP_SCALE_OPTIONS,
    },
}));

const favoriteGroups = computed(() =>
    FAVORITE_GROUPS.map((group) => ({
        ...group,
        items: group.keys.map((key) => favoriteConfig.value[key]).filter((item) => item && favoriteMap.value[item.key]),
    })).filter((group) => group.items.length),
);

function toggleFavoritePopover(key) {
    openFavoriteKey.value = openFavoriteKey.value === key ? null : key;
}

function emitSetting(key, value) {
    let nextValue = value;

    if (key === 'startDelay') {
        const parsed = Number(value);

        if (Number.isNaN(parsed)) {
            nextValue = 0;
        } else {
            nextValue = Math.min(60, Math.max(0, parsed));
        }
    }

    emit('update-setting', { key, value: nextValue });
}

function toggleSpeedMultiplier(value) {
    const next = props.speedMultiplier === value ? 1 : value;

    emit('speed-multiplier', next);
}

function handleOutsideClick(event) {
    if (!openFavoriteKey.value) {
        return;
    }
    if (favoritesRoot.value && favoritesRoot.value.contains(event.target)) {
        return;
    }
    openFavoriteKey.value = null;
}

onMounted(() => {
    document?.addEventListener('click', handleOutsideClick);
});

onBeforeUnmount(() => {
    document?.removeEventListener('click', handleOutsideClick);
});
</script>

<template>
    <div
        ref="favoritesRoot"
        class="reader-favorites"
    >
        <div
            v-for="group in favoriteGroups"
            :key="group.id"
            class="reader-favorites__group"
        >
            <div class="reader-favorites__title">{{ group.title }}</div>
            <div class="reader-favorites__list">
                <div
                    v-for="item in group.items"
                    :key="item.key"
                    class="reader-favorite"
                >
                    <SrButton
                        class="reader-favorite__button"
                        type="button"
                        @click.stop="toggleFavoritePopover(item.key)"
                    >
                        <span
                            class="material-icons"
                            aria-hidden="true"
                        >
                            {{ item.icon }}
                        </span>
                        <span class="reader-favorite__value">{{ item.value }}</span>
                    </SrButton>
                    <div
                        v-if="openFavoriteKey === item.key"
                        class="reader-favorite__popover"
                        @click.stop
                    >
                        <div class="reader-favorite__label">{{ item.label }}</div>
                        <div class="reader-favorite__control">
                            <template v-if="item.type === 'range'">
                                <SrRange
                                    :model-value="item.model"
                                    :min="item.min"
                                    :max="item.max"
                                    :step="item.step"
                                    :disabled="item.disabled"
                                    @update:model-value="emitSetting(item.key, $event)"
                                />
                            </template>
                            <template v-else-if="item.type === 'number'">
                                <SrInput
                                    type="number"
                                    :min="item.min"
                                    :max="item.max"
                                    :step="item.step"
                                    :model-value="item.model"
                                    @update:model-value="emitSetting(item.key, $event)"
                                >
                                    <template #append-inner>с</template>
                                </SrInput>
                            </template>
                            <template v-else-if="item.type === 'select'">
                                <SrSelect
                                    :model-value="item.model"
                                    :items="item.options"
                                    @update:model-value="emitSetting(item.key, $event)"
                                />
                            </template>
                            <template v-else-if="item.type === 'toggle'">
                                <SrToggleButton
                                    class="reader-btn"
                                    :active="item.model"
                                    @click="emitSetting(item.key, !item.model)"
                                >
                                    {{ item.model ? 'Вкл' : 'Выкл' }}
                                </SrToggleButton>
                            </template>
                            <template v-else-if="item.type === 'multiplier'">
                                <div class="reader-favorite__multipliers">
                                    <SrToggleButton
                                        class="reader-btn reader-favorite__multiplier-btn"
                                        type="button"
                                        aria-label="Замедлить x0.5"
                                        :active="props.speedMultiplier === 0.5"
                                        @click="toggleSpeedMultiplier(0.5)"
                                    >
                                        <span
                                            class="material-icons"
                                            aria-hidden="true"
                                        >
                                            fast_rewind
                                        </span>
                                    </SrToggleButton>
                                    <SrToggleButton
                                        class="reader-btn reader-favorite__multiplier-btn"
                                        type="button"
                                        aria-label="Ускорить x2"
                                        :active="props.speedMultiplier === 2"
                                        @click="toggleSpeedMultiplier(2)"
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
                            <template v-else-if="item.type === 'readonly'">
                                <div class="reader-favorite__readonly">{{ item.value }}</div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.reader-favorites {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    justify-content: center;
}

.reader-favorites__group {
    position: relative;

    display: flex;
    flex-direction: column;
    gap: 6px;

    padding: 8px;

    border: 1px solid var(--reader-border);
    border-radius: var(--ui-radius);
}

.reader-favorites__title {
    position: absolute;
    top: -8px;
    left: 8px;

    padding: 2px;

    font-size: 10px;
    color: var(--reader-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;

    background-color: var(--reader-surface);
}

.reader-favorites__list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
}

.reader-favorite {
    position: relative;
}

.reader-favorite__button.sr-button {
    cursor: pointer;

    display: inline-flex;
    gap: 6px;
    align-items: center;

    padding: 6px;

    font-size: 12px;
    color: var(--reader-text);
    letter-spacing: normal;

    background: transparent;
    border: 1px solid var(--reader-border);
    border-radius: var(--ui-radius-sm);
}

.reader-favorite__button .material-icons {
    font-size: 16px;
}

.reader-favorite__value {
    white-space: nowrap;
}

.reader-favorite__popover {
    position: absolute;
    z-index: 40;
    top: calc(100% + 8px);
    left: 0;

    display: flex;
    flex-direction: column;
    gap: 10px;

    min-width: 220px;
    padding: 12px;

    background: var(--reader-surface);
    border: 1px solid var(--reader-border);
    border-radius: var(--ui-radius);
    box-shadow: 0 12px 32px rgb(0 0 0 / 18%);
}

.reader-favorite__label {
    font-size: 11px;
    color: var(--reader-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.reader-favorite__control {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.reader-favorite__readonly {
    font-size: 16px;
    color: var(--reader-text);
}

.reader-favorite__multipliers {
    display: flex;
    gap: 10px;
    align-items: center;
}

.reader-favorite__multiplier-btn {
    padding: 6px 8px;
}

.reader-favorite__multipliers .material-icons {
    font-size: 18px;
}

.reader-btn .material-icons {
    font-size: 20px;
    line-height: 1;
}
</style>
