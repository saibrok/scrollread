<script setup>
import { computed } from 'vue';

import SrRange from '../ui/SrRange.vue';
import SrSelect from '../ui/SrSelect.vue';

import { THEME_TONE_OPTIONS, getPaletteOptions } from '../utils/themes';

const props = defineProps({
    settings: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['update']);

const fontOptions = [
    { value: "'Rubik', 'Segoe UI', Arial, sans-serif", text: 'Rubik' },
    { value: "'PT Sans', 'Segoe UI', Arial, sans-serif", text: 'PT Sans' },
    { value: "'PT Serif', 'Times New Roman', serif", text: 'PT Serif' },
    { value: "'Noto Sans', 'Segoe UI', Arial, sans-serif", text: 'Noto Sans' },
    { value: "'Noto Serif', 'Times New Roman', serif", text: 'Noto Serif' },
    { value: "'Merriweather', 'Times New Roman', serif", text: 'Merriweather' },
    { value: "'Montserrat', 'Segoe UI', Arial, sans-serif", text: 'Montserrat' },
];

const alignOptions = [
    { value: 'left', text: 'Слева' },
    { value: 'center', text: 'По центру' },
    { value: 'justify', text: 'На всю ширину' },
];

const paletteOptions = computed(() => getPaletteOptions(props.settings.themeTone));

function emitUpdate(key, value) {
    emit('update', { key, value });
}
</script>

<template>
    <div class="reader-panel">
        <div class="reader-control">
            <label
                class="reader-label"
                for="readerSpeed"
                >Скорость</label
            >
            <SrRange
                id="readerSpeed"
                :model-value="props.settings.speed"
                min="100"
                max="2000"
                step="100"
                @update:model-value="emitUpdate('speed', $event)"
            />
            <div class="reader-value">
                <span>{{ props.settings.speed }}</span> знаков/мин
            </div>
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="fontSize"
                >Размер</label
            >
            <SrRange
                id="fontSize"
                :model-value="props.settings.fontSize"
                min="10"
                max="100"
                step="2"
                @update:model-value="emitUpdate('fontSize', $event)"
            />
            <div class="reader-value">
                <span>{{ props.settings.fontSize }}</span> px
            </div>
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="lineHeight"
                >Интерлиньяж</label
            >
            <SrRange
                id="lineHeight"
                :model-value="props.settings.lineHeight"
                min="1"
                max="2.4"
                step="0.1"
                @update:model-value="emitUpdate('lineHeight', $event)"
            />
            <div class="reader-value">
                <span>{{ props.settings.lineHeight }}</span>
            </div>
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="paragraphGap"
                >Отступ абзаца</label
            >
            <SrRange
                id="paragraphGap"
                :model-value="props.settings.paragraphGap"
                min="0"
                max="2"
                step="0.1"
                @update:model-value="emitUpdate('paragraphGap', $event)"
            />
            <div class="reader-value">
                <span>{{ props.settings.paragraphGap }}</span> em
            </div>
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="indent"
                >Красная строка</label
            >
            <SrRange
                id="indent"
                :model-value="props.settings.indent"
                min="0"
                max="4"
                step="0.1"
                @update:model-value="emitUpdate('indent', $event)"
            />
            <div class="reader-value">
                <span>{{ props.settings.indent }}</span> em
            </div>
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="font"
                >Шрифт</label
            >
            <SrSelect
                id="font"
                :model-value="props.settings.font"
                :items="fontOptions"
                @update:model-value="emitUpdate('font', $event)"
            />
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="align"
                >Положение</label
            >
            <SrSelect
                id="align"
                :model-value="props.settings.align"
                :items="alignOptions"
                @update:model-value="emitUpdate('align', $event)"
            />
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="padding"
                >Отступы</label
            >
            <SrRange
                id="padding"
                :model-value="props.settings.padding"
                min="0"
                max="1000"
                step="10"
                @update:model-value="emitUpdate('padding', $event)"
            />
            <div class="reader-value">
                <span>{{ props.settings.padding }}</span> px
            </div>
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="themeTone"
                >Тон</label
            >
            <SrSelect
                id="themeTone"
                :model-value="props.settings.themeTone"
                :items="THEME_TONE_OPTIONS"
                @update:model-value="emitUpdate('themeTone', $event)"
            />
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="themePalette"
                >Цветовая схема</label
            >
            <SrSelect
                id="themePalette"
                :model-value="props.settings.themePalette"
                :items="paletteOptions"
                @update:model-value="emitUpdate('themePalette', $event)"
            />
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="brightness"
                >Яркость</label
            >
            <SrRange
                id="brightness"
                :model-value="props.settings.brightness"
                min="50"
                max="150"
                step="5"
                @update:model-value="emitUpdate('brightness', $event)"
            />
            <div class="reader-value">
                <span>{{ props.settings.brightness }}</span
                >%
            </div>
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="contrast"
                >Контраст</label
            >
            <SrRange
                id="contrast"
                :model-value="props.settings.contrast"
                min="50"
                max="150"
                step="5"
                @update:model-value="emitUpdate('contrast', $event)"
            />
            <div class="reader-value">
                <span>{{ props.settings.contrast }}</span
                >%
            </div>
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="sepia"
                >Сепия</label
            >
            <SrRange
                id="sepia"
                :model-value="props.settings.sepia"
                min="0"
                max="100"
                step="5"
                @update:model-value="emitUpdate('sepia', $event)"
            />
            <div class="reader-value">
                <span>{{ props.settings.sepia }}</span
                >%
            </div>
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="overlaySize"
                >Размер окна</label
            >
            <SrRange
                id="overlaySize"
                :model-value="props.settings.overlaySize"
                min="1"
                max="10"
                step="1"
                @update:model-value="emitUpdate('overlaySize', $event)"
            />
            <div class="reader-value">
                <span>{{ props.settings.overlaySize }}</span> строк(и)
            </div>
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="overlayOpacity"
                >Прозрачность</label
            >
            <SrRange
                id="overlayOpacity"
                :model-value="props.settings.overlayOpacity"
                min="0"
                max="100"
                step="5"
                @update:model-value="emitUpdate('overlayOpacity', $event)"
            />
            <div class="reader-value">
                <span>{{ props.settings.overlayOpacity }}</span
                >%
            </div>
        </div>
    </div>
</template>
