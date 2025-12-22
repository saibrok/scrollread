<script setup>
import { computed } from 'vue';

import { getPaletteOptions, THEME_TONE_OPTIONS } from '../utils/themes';

import SrButton from '../ui/SrButton.vue';
import SrModal from '../ui/SrModal.vue';
import SrRange from '../ui/SrRange.vue';
import SrSelect from '../ui/SrSelect.vue';

const props = defineProps({
    text: {
        type: String,
        required: true,
    },
    stats: {
        type: Object,
        required: true,
    },
    speed: {
        type: Number,
        required: true,
    },
    timeRange: {
        type: String,
        required: true,
    },
    themeTone: {
        type: String,
        required: true,
    },
    themePalette: {
        type: String,
        required: true,
    },
    canStart: {
        type: Boolean,
        required: true,
    },
    saveItems: {
        type: Array,
        required: true,
    },
    selectedSaveId: {
        type: String,
        required: true,
    },
    saveConfirmOpen: {
        type: Boolean,
        required: true,
    },
    loadConfirmOpen: {
        type: Boolean,
        required: true,
    },
    deleteConfirmOpen: {
        type: Boolean,
        required: true,
    },
    canSave: {
        type: Boolean,
        required: true,
    },
    canLoad: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits([
    'update:text',
    'update:speed',
    'update:theme-tone',
    'update:theme-palette',
    'start',
    'save',
    'load',
    'select-save',
    'close-save-confirm',
    'confirm-save-overwrite',
    'confirm-save-new',
    'close-load-confirm',
    'confirm-load-replace',
    'delete-save',
    'close-delete-confirm',
    'confirm-delete-save',
]);

const paletteOptions = computed(() => getPaletteOptions(props.themeTone));

function onTextInput(event) {
    emit('update:text', event.target.value);
}

function openSupport() {
    window.open('https://dalink.to/saibrok', '_blank', 'noopener,noreferrer');
}

</script>

<template>
    <div class="page">
        <header class="page-header">
            <div>
                <h1 class="title">ScrollRead</h1>
            </div>
            <div class="header-theme">
                <div class="header-theme__control">
                    <div class="label">Тон</div>
                    <SrSelect
                        :model-value="props.themeTone"
                        :items="THEME_TONE_OPTIONS"
                        @update:model-value="emit('update:theme-tone', $event)"
                    />
                </div>
                <div class="header-theme__control">
                    <div class="label">Цветовая схема</div>
                    <SrSelect
                        :model-value="props.themePalette"
                        :items="paletteOptions"
                        @update:model-value="emit('update:theme-palette', $event)"
                    />
                </div>
            </div>
        </header>

        <section class="card">
            <div class="editor">
                <div class="label">Текст</div>
                <textarea
                    :value="props.text"
                    placeholder="Вставьте текст, который будете читать"
                    @input="onTextInput"
                ></textarea>
                <div class="editor-saves">
                    <div class="label">Сохранения</div>
                    <div class="editor-saves__select">
                        <SrSelect
                            :model-value="props.selectedSaveId"
                            :items="props.saveItems"
                            placeholder="Выберите сохранение"
                            @update:model-value="emit('select-save', $event)"
                        />
                    </div>
                    <div class="editor-saves__actions">
                        <SrButton
                            variant="accent"
                            :disabled="!props.canSave"
                            @click="emit('save')"
                        >
                            Сохранить
                        </SrButton>
                        <SrButton
                            variant="default"
                            :disabled="!props.canLoad"
                            @click="emit('load')"
                        >
                            Загрузить
                        </SrButton>
                        <SrButton
                            variant="default"
                            :disabled="!props.canLoad"
                            @click="emit('delete-save')"
                        >
                            Удалить
                        </SrButton>
                    </div>
                </div>
            </div>

            <div class="controls">
                <div class="control">
                    <div class="label">Статистика</div>
                    <div class="stat-line">
                        Всего слов: <strong>{{ props.stats.words }}</strong>
                    </div>
                    <div class="stat-line">
                        Всего символов: <strong>{{ props.stats.chars }}</strong>
                    </div>
                    <div class="stat-line">
                        Без пробелов: <strong>{{ props.stats.charsNoSpaces }}</strong>
                    </div>
                </div>

                <div class="control">
                    <div class="label">Скорость</div>
                    <SrRange
                        :model-value="props.speed"
                        min="100"
                        max="2000"
                        step="50"
                        @update:model-value="emit('update:speed', $event)"
                    />
                    <div class="range-row">
                        <strong>{{ props.speed }}</strong>
                        знаков/мин
                    </div>
                    <div class="meta">
                        Оценка времени: <span>{{ props.timeRange }}</span>
                    </div>
                </div>

                <SrButton
                    class="start"
                    :disabled="!props.canStart"
                    variant="accent"
                    @click="emit('start')"
                >
                    НАЧАТЬ
                </SrButton>
            </div>
        </section>

        <SrModal
            :open="props.saveConfirmOpen"
            card-class="sr-modal-card--compact"
            @close="emit('close-save-confirm')"
        >
            <div class="sr-modal-header">
                <div>Сохранение текста</div>
            </div>
            <div class="sr-modal-text">Выберите действие для выбранного сохранения.</div>
            <div class="sr-modal-actions">
                <SrButton
                    variant="default"
                    @click="emit('close-save-confirm')"
                >
                    Отмена
                </SrButton>
                <SrButton
                    variant="default"
                    @click="emit('confirm-save-new')"
                >
                    Новое сохранение
                </SrButton>
                <SrButton
                    variant="accent"
                    @click="emit('confirm-save-overwrite')"
                >
                    Перезаписать
                </SrButton>
            </div>
        </SrModal>

        <SrModal
            :open="props.loadConfirmOpen"
            card-class="sr-modal-card--compact"
            @close="emit('close-load-confirm')"
        >
            <div class="sr-modal-header">
                <div>Загрузка текста</div>
            </div>
            <div class="sr-modal-text">В тексте есть данные. Заменить содержимое?</div>
            <div class="sr-modal-actions">
                <SrButton
                    variant="default"
                    @click="emit('close-load-confirm')"
                >
                    Отмена
                </SrButton>
                <SrButton
                    variant="accent"
                    @click="emit('confirm-load-replace')"
                >
                    Заменить
                </SrButton>
            </div>
        </SrModal>

        <SrModal
            :open="props.deleteConfirmOpen"
            card-class="sr-modal-card--compact"
            @close="emit('close-delete-confirm')"
        >
            <div class="sr-modal-header">
                <div>Удаление сохранения</div>
            </div>
            <div class="sr-modal-text">Удалить выбранное сохранение без возможности восстановления?</div>
            <div class="sr-modal-actions">
                <SrButton
                    variant="default"
                    @click="emit('close-delete-confirm')"
                >
                    Отмена
                </SrButton>
                <SrButton
                    variant="accent"
                    @click="emit('confirm-delete-save')"
                >
                    Удалить
                </SrButton>
            </div>
        </SrModal>
        <footer class="page-footer">
            <div class="subtitle">ScrollRead создаётся как рабочий инструмент — без рекламы и подписок.</div>
            <div class="subtitle">Он бесплатный и остаётся таким благодаря вашей поддержке.</div>
            <div class="subtitle">
                Если ScrollRead помогает вам в работе, донат — лучший способ сказать
                <a
                    href="https://dalink.to/saibrok"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    «спасибо»
                </a>
                и ускорить развитие проекта.
            </div>
            <div class="subtitle">
                Идеи, запросы на функции и обратную связь можно писать в
                <a
                    href="https://t.me/saibrok"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Telegram
                </a>
                .
            </div>
        </footer>
        <SrButton
            class="support-button"
            @click="openSupport"
        >
            Поддержать проект
        </SrButton>
    </div>
</template>

