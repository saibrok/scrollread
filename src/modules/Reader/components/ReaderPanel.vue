<script setup>
import { onMounted, ref, watch } from 'vue';

import SrButton from '../../../ui/SrButton.vue';
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
    speedMultiplierLabel: {
        type: String,
        default: '',
    },
    speedMultiplier: {
        type: Number,
        default: 1,
    },
});

const emit = defineEmits(['update', 'toggle', 'fullscreen', 'update-end', 'speed-multiplier']);

const isOpen = ref(true);

const fontOptions = [
    { value: "'EB Garamond', 'Times New Roman', serif", text: 'EB Garamond' },
    { value: "'Fira Sans', 'Segoe UI', Arial, sans-serif", text: 'Fira Sans' },
    { value: "'IBM Plex Sans', 'Segoe UI', Arial, sans-serif", text: 'IBM Plex Sans' },
    { value: "'IBM Plex Serif', 'Times New Roman', serif", text: 'IBM Plex Serif' },
    { value: "'Inter', 'Segoe UI', Arial, sans-serif", text: 'Inter' },
    { value: "'Lora', 'Times New Roman', serif", text: 'Lora' },
    { value: "'Merriweather', 'Times New Roman', serif", text: 'Merriweather' },
    { value: "'Montserrat', 'Segoe UI', Arial, sans-serif", text: 'Montserrat' },
    { value: "'Noto Sans', 'Segoe UI', Arial, sans-serif", text: 'Noto Sans' },
    { value: "'Noto Serif', 'Times New Roman', serif", text: 'Noto Serif' },
    { value: "'Open Sans', 'Segoe UI', Arial, sans-serif", text: 'Open Sans' },
    { value: "'Oswald', 'Segoe UI', Arial, sans-serif", text: 'Oswald' },
    { value: "'Playfair Display', 'Times New Roman', serif", text: 'Playfair Display' },
    { value: "'PT Sans Narrow', 'PT Sans', 'Segoe UI', Arial, sans-serif", text: 'PT Sans Narrow' },
    { value: "'PT Sans', 'Segoe UI', Arial, sans-serif", text: 'PT Sans' },
    { value: "'PT Serif', 'Times New Roman', serif", text: 'PT Serif' },
    { value: "'Roboto Condensed', 'Arial Narrow', 'Segoe UI', Arial, sans-serif", text: 'Roboto Condensed' },
    { value: "'Roboto Mono', 'Courier New', monospace", text: 'Roboto Mono' },
    { value: "'Roboto Slab', 'Times New Roman', serif", text: 'Roboto Slab' },
    { value: "'Roboto', 'Segoe UI', Arial, sans-serif", text: 'Roboto' },
    { value: "'Rubik', 'Segoe UI', Arial, sans-serif", text: 'Rubik' },
    { value: "'Vollkorn', 'Times New Roman', serif", text: 'Vollkorn' },
];

const alignOptions = [
    { value: 'left', text: 'Слева' },
    { value: 'center', text: 'По центру' },
    { value: 'justify', text: 'На всю ширину' },
];

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

function toggleMinimap() {
    const nextValue = !(props.settings.showMinimap !== false);

    emitUpdate('showMinimap', nextValue);
    emitUpdateEnd('showMinimap', nextValue);
}

function toggleMultiplier(value) {
    const nextMultiplier = props.speedMultiplier === value ? 1 : value;

    emit('speed-multiplier', nextMultiplier);
}

function togglePanel() {
    isOpen.value = !isOpen.value;
    emitUpdate('panelOpen', isOpen.value);
    emit('toggle', isOpen.value);
}

defineExpose({ togglePanel });

onMounted(() => {
    if (typeof props.settings.panelOpen === 'boolean') {
        isOpen.value = props.settings.panelOpen;
    }
});

watch(
    () => props.settings.panelOpen,
    (value) => {
        if (typeof value === 'boolean') {
            isOpen.value = value;
        }
    },
);
</script>

<template>
    <div class="reader-panel">
        <div class="reader-panel__bar">
            <div class="reader-panel__title">Настройки текста</div>

            <div
                v-if="props.showSpeedInBar && !isOpen"
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

            <SrButton
                v-if="props.speedMultiplierLabel"
                class="reader-panel__multiplier"
                type="button"
                aria-hidden="true"
                @click.prevent
            >
                {{ props.speedMultiplierLabel }}
            </SrButton>

            <div class="separator"></div>

            <SrToggleButton
                v-if="!props.isCompact"
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

            <SrButton
                class="reader-btn reader-panel__icon"
                type="button"
                :aria-label="isOpen ? 'Свернуть настройки' : 'Развернуть настройки'"
                @click="togglePanel"
            >
                <span
                    class="material-icons"
                    aria-hidden="true"
                >
                    {{ isOpen ? 'expand_less' : 'expand_more' }}
                </span>
            </SrButton>
        </div>
        <div
            v-show="isOpen"
            class="reader-panel__body"
        >
            <section class="reader-group">
                <div class="reader-group__title">Темп</div>
                <div class="reader-group__grid">
                    <div class="reader-control">
                        <div class="reader-control__header">
                            <label
                                class="reader-label"
                                for="readerSpeed"
                                >Скорость</label
                            >
                            <div class="reader-value">
                                <span>{{ props.settings.speed }}</span> зн/мин
                            </div>
                        </div>
                        <div class="reader-panel__speed">
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
                </div>
            </section>
            <section class="reader-group">
                <div class="reader-group__title">Текст</div>
                <div class="reader-group__grid">
                    <div class="reader-control">
                        <div class="reader-control__header">
                            <label
                                class="reader-label"
                                for="fontSize"
                                >Размер</label
                            >
                            <div class="reader-value">
                                <span>{{ props.settings.fontSize }}</span> px
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
                            <label
                                class="reader-label"
                                for="lineHeight"
                                >Интерлиньяж</label
                            >
                            <div class="reader-value">
                                <span>{{ props.settings.lineHeight }}</span>
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
                            <label
                                class="reader-label"
                                for="paragraphGap"
                                >Отступ абзаца</label
                            >
                            <div class="reader-value">
                                <span>{{ props.settings.paragraphGap }}</span> em
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
                            <label
                                class="reader-label"
                                for="indent"
                                >Красная строка</label
                            >
                            <div class="reader-value">
                                <span>{{ props.settings.indent }}</span> em
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
                            <label
                                class="reader-label"
                                for="font"
                                >Шрифт</label
                            >
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
                            <label
                                class="reader-label"
                                for="align"
                                >Положение</label
                            >
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
                            <label
                                class="reader-label"
                                for="padding"
                                >Отступы</label
                            >
                            <div class="reader-value">
                                <span>{{ props.settings.padding }}</span> px
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
                            <label
                                class="reader-label"
                                for="overlaySize"
                                >Размер окна</label
                            >
                            <div class="reader-value">
                                <span>{{ props.settings.overlaySize }}</span> стр
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
                            <label
                                class="reader-label"
                                for="overlayOpacity"
                                >Прозрачность</label
                            >
                            <div class="reader-value">
                                <span>{{ props.settings.overlayOpacity }}</span
                                >%
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
                            <label
                                class="reader-label"
                                for="brightness"
                                >Яркость</label
                            >
                            <div class="reader-value">
                                <span>{{ props.settings.brightness }}</span
                                >%
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
                            <label
                                class="reader-label"
                                for="contrast"
                                >Контраст</label
                            >
                            <div class="reader-value">
                                <span>{{ props.settings.contrast }}</span
                                >%
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
                            <label
                                class="reader-label"
                                for="sepia"
                                >Сепия</label
                            >
                            <div class="reader-value">
                                <span>{{ props.settings.sepia }}</span
                                >%
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
        </div>
    </div>
</template>
