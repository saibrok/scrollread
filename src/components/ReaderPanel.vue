<script setup>
import SrRange from '../ui/SrRange.vue';
import SrSelect from '../ui/SrSelect.vue';

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

const themeOptions = [
    { value: 'system', text: 'Как в системе' },
    { value: 'dark-gray', text: 'Dark Gray' },
    { value: 'light-gray', text: 'Light Gray' },
    { value: 'sepia', text: 'Sepia' },
    { value: 'paper', text: 'Paper' },
];

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
                for="readerFontSize"
                >Размер</label
            >
            <SrRange
                id="readerFontSize"
                :model-value="props.settings.readerFontSize"
                min="10"
                max="100"
                step="2"
                @update:model-value="emitUpdate('readerFontSize', $event)"
            />
            <div class="reader-value">
                <span>{{ props.settings.readerFontSize }}</span> px
            </div>
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="readerLineHeight"
                >Интерлиньяж</label
            >
            <SrRange
                id="readerLineHeight"
                :model-value="props.settings.readerLineHeight"
                min="1"
                max="2.4"
                step="0.1"
                @update:model-value="emitUpdate('readerLineHeight', $event)"
            />
            <div class="reader-value">
                <span>{{ props.settings.readerLineHeight }}</span>
            </div>
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="readerParagraphGap"
                >Отступ абзаца</label
            >
            <SrRange
                id="readerParagraphGap"
                :model-value="props.settings.readerParagraphGap"
                min="0"
                max="2"
                step="0.1"
                @update:model-value="emitUpdate('readerParagraphGap', $event)"
            />
            <div class="reader-value">
                <span>{{ props.settings.readerParagraphGap }}</span> em
            </div>
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="readerFont"
                >Шрифт</label
            >
            <SrSelect
                id="readerFont"
                :model-value="props.settings.readerFont"
                :items="fontOptions"
                @update:model-value="emitUpdate('readerFont', $event)"
            />
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="readerAlign"
                >Положение</label
            >
            <SrSelect
                id="readerAlign"
                :model-value="props.settings.readerAlign"
                :items="alignOptions"
                @update:model-value="emitUpdate('readerAlign', $event)"
            />
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="readerPadding"
                >Отступы</label
            >
            <SrRange
                id="readerPadding"
                :model-value="props.settings.readerPadding"
                min="0"
                max="1500"
                step="10"
                @update:model-value="emitUpdate('readerPadding', $event)"
            />
            <div class="reader-value">
                <span>{{ props.settings.readerPadding }}</span> px
            </div>
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="readerTheme"
                >Тема</label
            >
            <SrSelect
                id="readerTheme"
                :model-value="props.settings.theme"
                :items="themeOptions"
                @update:model-value="emitUpdate('theme', $event)"
            />
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="readerBrightness"
                >Яркость</label
            >
            <SrRange
                id="readerBrightness"
                :model-value="props.settings.readerBrightness"
                min="50"
                max="150"
                step="5"
                @update:model-value="emitUpdate('readerBrightness', $event)"
            />
            <div class="reader-value">
                <span>{{ props.settings.readerBrightness }}</span
                >%
            </div>
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="readerContrast"
                >Контраст</label
            >
            <SrRange
                id="readerContrast"
                :model-value="props.settings.readerContrast"
                min="50"
                max="150"
                step="5"
                @update:model-value="emitUpdate('readerContrast', $event)"
            />
            <div class="reader-value">
                <span>{{ props.settings.readerContrast }}</span
                >%
            </div>
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="readerSepia"
                >Сепия</label
            >
            <SrRange
                id="readerSepia"
                :model-value="props.settings.readerSepia"
                min="0"
                max="100"
                step="5"
                @update:model-value="emitUpdate('readerSepia', $event)"
            />
            <div class="reader-value">
                <span>{{ props.settings.readerSepia }}</span
                >%
            </div>
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="readerOverlaySize"
                >Размер окна</label
            >
            <SrRange
                id="readerOverlaySize"
                :model-value="props.settings.readerOverlaySize"
                min="1"
                max="10"
                step="1"
                @update:model-value="emitUpdate('readerOverlaySize', $event)"
            />
            <div class="reader-value">
                <span>{{ props.settings.readerOverlaySize }}</span> строк(и)
            </div>
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="readerOverlayOpacity"
                >Прозрачность</label
            >
            <SrRange
                id="readerOverlayOpacity"
                :model-value="props.settings.readerOverlayOpacity"
                min="0"
                max="100"
                step="5"
                @update:model-value="emitUpdate('readerOverlayOpacity', $event)"
            />
            <div class="reader-value">
                <span>{{ props.settings.readerOverlayOpacity }}</span
                >%
            </div>
        </div>
    </div>
</template>
