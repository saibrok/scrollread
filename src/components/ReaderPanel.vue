<script setup>
import { ref } from 'vue';

import SrRange from '../ui/SrRange.vue';
import SrSelect from '../ui/SrSelect.vue';

const props = defineProps({
    settings: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['update', 'toggle']);

const isOpen = ref(true);

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

function emitUpdate(key, value) {
    emit('update', { key, value });
}

function togglePanel() {
    isOpen.value = !isOpen.value;
    emit('toggle', isOpen.value);
}
</script>

<template>
    <div class="reader-panel">
        <div class="reader-panel__bar">
            <div class="reader-panel__title">Настройки текста</div>
            <button
                type="button"
                class="reader-panel__toggle"
                @click="togglePanel"
            >
                {{ isOpen ? 'Свернуть' : 'Развернуть' }}
            </button>
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
                        <SrRange
                            id="readerSpeed"
                            :model-value="props.settings.speed"
                            min="100"
                            max="2000"
                            step="100"
                            @update:model-value="emitUpdate('speed', $event)"
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
                            step="2"
                            @update:model-value="emitUpdate('fontSize', $event)"
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
                            @update:model-value="emitUpdate('indent', $event)"
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
                            @update:model-value="emitUpdate('font', $event)"
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
                            @update:model-value="emitUpdate('align', $event)"
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
                                <span>{{ props.settings.brightness }}</span>%
                            </div>
                        </div>
                        <SrRange
                            id="brightness"
                            :model-value="props.settings.brightness"
                            min="50"
                            max="150"
                            step="5"
                            @update:model-value="emitUpdate('brightness', $event)"
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
                                <span>{{ props.settings.contrast }}</span>%
                            </div>
                        </div>
                        <SrRange
                            id="contrast"
                            :model-value="props.settings.contrast"
                            min="50"
                            max="150"
                            step="5"
                            @update:model-value="emitUpdate('contrast', $event)"
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
                                <span>{{ props.settings.sepia }}</span>%
                            </div>
                        </div>
                        <SrRange
                            id="sepia"
                            :model-value="props.settings.sepia"
                            min="0"
                            max="100"
                            step="5"
                            @update:model-value="emitUpdate('sepia', $event)"
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
                                <span>{{ props.settings.overlayOpacity }}</span>%
                            </div>
                        </div>
                        <SrRange
                            id="overlayOpacity"
                            :model-value="props.settings.overlayOpacity"
                            min="0"
                            max="100"
                            step="5"
                            @update:model-value="emitUpdate('overlayOpacity', $event)"
                        />
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>
