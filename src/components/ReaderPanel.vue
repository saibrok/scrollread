<script setup>
import UiRange from '../ui/UiRange.vue';
import UiSelect from '../ui/UiSelect.vue';

const props = defineProps({
    settings: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['update']);

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
            <UiRange
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
            <UiRange
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
            <UiRange
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
            <UiRange
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
            <UiSelect
                id="readerFont"
                :model-value="props.settings.readerFont"
                @update:model-value="emitUpdate('readerFont', $event)"
            >
                <option value="'Rubik', 'Segoe UI', Arial, sans-serif">Rubik</option>
                <option value="'PT Sans', 'Segoe UI', Arial, sans-serif">PT Sans</option>
                <option value="'PT Serif', 'Times New Roman', serif">PT Serif</option>
                <option value="'Noto Sans', 'Segoe UI', Arial, sans-serif">Noto Sans</option>
                <option value="'Noto Serif', 'Times New Roman', serif">Noto Serif</option>
                <option value="'Merriweather', 'Times New Roman', serif">Merriweather</option>
                <option value="'Montserrat', 'Segoe UI', Arial, sans-serif">Montserrat</option>
            </UiSelect>
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="readerAlign"
                >Положение</label
            >
            <UiSelect
                id="readerAlign"
                :model-value="props.settings.readerAlign"
                @update:model-value="emitUpdate('readerAlign', $event)"
            >
                <option value="left">Слева</option>
                <option value="center">По центру</option>
                <option value="justify">На всю ширину</option>
            </UiSelect>
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="readerPadding"
                >Отступы</label
            >
            <UiRange
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
            <UiSelect
                id="readerTheme"
                :model-value="props.settings.readerTheme"
                @update:model-value="emitUpdate('readerTheme', $event)"
            >
                <option value="dark-gray">Dark Gray</option>
                <option value="light-gray">Light Gray</option>
                <option value="sepia">Sepia</option>
                <option value="paper">Paper</option>
            </UiSelect>
        </div>
        <div class="reader-control">
            <label
                class="reader-label"
                for="readerBrightness"
                >Яркость</label
            >
            <UiRange
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
            <UiRange
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
            <UiRange
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
            <UiRange
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
            <UiRange
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
