<script setup>
import { computed } from 'vue';

import { getPaletteOptions, THEME_TONE_OPTIONS } from '../utils/themes';

import SrButton from '../ui/SrButton.vue';
import SrCard from '../ui/SrCard.vue';
import SrExpansionPanel from '../ui/SrExpansionPanel.vue';
import SrModal from '../ui/SrModal.vue';
import SrRange from '../ui/SrRange.vue';
import SrSelect from '../ui/SrSelect.vue';
import SrTextarea from '../ui/SrTextarea.vue';

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

function openSupport() {
    window.open('https://dalink.to/saibrok', '_blank', 'noopener,noreferrer');
}
</script>

<template>
    <div class="page">
        <header class="page-header">
            <div class="brand">
                <div class="brand-title">ScrollRead</div>
                <div class="brand-subtitle">Онлайн телесуфлер с контролем темпа чтения</div>
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

        <section
            class="hero reveal"
            style="--delay: 0.05s"
        >
            <div class="hero__content">
                <h1 class="hero__title">Онлайн телесуфлер, который держит темп чтения</h1>
                <p class="hero__lead">
                    Вставьте текст, выберите скорость и начните читать без рывков. ScrollRead считает время, ведет текст по экрану и помогает сохранять
                    уверенный ритм.
                </p>
                <div class="hero__actions">
                    <SrButton
                        as="a"
                        class="hero__cta"
                        variant="accent"
                        href="#editor"
                    >
                        Попробовать
                    </SrButton>
                    <SrButton
                        as="a"
                        class="hero__link"
                        variant="default"
                        href="#features"
                    >
                        Возможности
                    </SrButton>
                </div>
                <div class="hero__note">Без регистрации, рекламы и подписок.</div>
            </div>
            <div class="hero__panel">
                <div class="hero__panel-title">Что внутри</div>
                <ul class="hero__list">
                    <li>Точное время прокрутки и темп чтения</li>
                    <li>Сохранение текстов в браузере</li>
                    <li>Гибкие настройки шрифта, оформления и цвета</li>
                    <li>Полноэкранный режим для выступлений и записи</li>
                </ul>
            </div>
        </section>

        <section
            id="editor"
            class="card reveal"
            style="--delay: 0.1s"
        >
            <div class="text-panel">
                <SrTextarea
                    :model-value="props.text"
                    placeholder="Вставьте текст, который будете читать"
                    @update:model-value="emit('update:text', $event)"
                />
                <div class="text-panel-saves">
                    <div class="label">Сохранения</div>
                    <div class="text-panel-saves__select">
                        <SrSelect
                            :model-value="props.selectedSaveId"
                            :items="props.saveItems"
                            placeholder="Выберите сохранение"
                            :disabled="!props.saveItems.length"
                            @update:model-value="emit('select-save', $event)"
                        />
                    </div>
                    <div class="text-panel-saves__actions">
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
                    <div class="range-row">
                        <strong>{{ props.speed }}</strong>
                        знаков/мин
                    </div>
                    <div class="meta">
                        Оценка времени: <span>{{ props.timeRange }}</span>
                    </div>
                    <SrRange
                        :model-value="props.speed"
                        min="100"
                        max="2000"
                        step="10"
                        @update:model-value="emit('update:speed', $event)"
                    />
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

        <section
            id="features"
            class="section reveal"
            style="--delay: 0.15s"
        >
            <div class="section-title">Преимущества ScrollRead</div>
            <div class="section-lead">Все, что нужно для уверенного чтения с экрана.</div>
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-title">Точное время чтения</div>
                    <div class="feature-text">Скорость задается в знаках в минуту, а оценка времени помогает заранее рассчитать длительность.</div>
                </div>
                <div class="feature-card">
                    <div class="feature-title">Сохранение текстов</div>
                    <div class="feature-text">Храните тексты локально, быстро возвращайтесь к нужному сценарию.</div>
                </div>
                <div class="feature-card">
                    <div class="feature-title">Гибкая настройка</div>
                    <div class="feature-text">Подберите шрифт, размер, цветовую схему и оформление под себя.</div>
                </div>
            </div>
        </section>

        <SrCard
            as="section"
            class="section reveal"
            style="--delay: 0.2s"
            variant="alt"
        >
            <div class="section-title">Как это работает</div>
            <div class="steps">
                <div class="step-card">
                    <div class="step-number">01</div>
                    <div class="step-title">Вставьте текст</div>
                    <div class="step-text">Скопируйте сценарий, речь или заметки прямо в поле.</div>
                </div>
                <div class="step-card">
                    <div class="step-number">02</div>
                    <div class="step-title">Настройте скорость</div>
                    <div class="step-text">Подберите темп чтения и оцените длительность.</div>
                </div>
                <div class="step-card">
                    <div class="step-number">03</div>
                    <div class="step-title">Читайте в режиме суфлера</div>
                    <div class="step-text">Запускайте полноэкранный режим и держите ритм.</div>
                </div>
            </div>
        </SrCard>

        <section
            class="section reveal"
            style="--delay: 0.25s"
        >
            <div class="section-title">Для кого подходит</div>
            <div class="use-cases">
                <div class="use-case">Видеоблогеры и стримеры</div>
                <div class="use-case">Преподаватели и лекторы</div>
                <div class="use-case">Спикеры на конференциях</div>
                <div class="use-case">Маркетинговые и продуктовые команды</div>
            </div>
        </section>

        <section
            id="faq"
            class="section reveal"
            style="--delay: 0.3s"
        >
            <div class="section-title">Часто задаваемые вопросы</div>
            <div class="faq">
                <SrExpansionPanel title="Нужно ли регистрироваться или устанавливать приложение?">
                    Нет. ScrollRead работает в браузере и запускается сразу.
                </SrExpansionPanel>
                <SrExpansionPanel title="Где хранятся мои тексты?">
                    Сохранения остаются в локальном хранилище браузера и не отправляются на сервер.
                </SrExpansionPanel>
                <SrExpansionPanel title="Можно ли пользоваться на телефоне или планшете?">
                    Да, интерфейс адаптивен и подходит для мобильных устройств.
                </SrExpansionPanel>
                <SrExpansionPanel title="Как рассчитывается скорость чтения?">
                    Скорость задается в знаках в минуту, а оценка времени считается автоматически.
                </SrExpansionPanel>
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

<style scoped>
.card {
    display: grid;
    grid-template-columns: 1.4fr 0.9fr;
    gap: 24px;

    padding: 28px;

    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    box-shadow: var(--shadow);
}

.page-header {
    gap: 24px;
    align-items: flex-start;
}

.header-theme {
    display: flex;
    gap: 12px;
    min-width: 220px;
}

.header-theme__control {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 150px;
}

.text-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.label {
    font-size: 13px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.text-panel-saves {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.text-panel-saves__select {
    flex: 1;
    min-width: 220px;
}

.text-panel-saves__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.controls {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.control {
    display: flex;
    flex-direction: column;
    gap: 10px;

    padding: 16px;

    background: var(--bg-accent);
    border: 1px solid var(--border);
    border-radius: 16px;
}

.value {
    font-size: 28px;
    font-weight: 600;
}

.stat-line {
    display: flex;
    gap: 12px;
    justify-content: space-between;

    font-size: 14px;
    color: var(--muted);
}

.range-row {
    display: flex;
    gap: 10px;
    align-items: center;

    font-size: 14px;
    color: var(--muted);
}

.meta {
    font-size: 14px;
    color: var(--muted);
}

.start {
    margin-top: auto;
}

.support-button {
    position: fixed;
    z-index: 30;
    right: 24px;
    bottom: 24px;
}

.page-footer {
    display: flex;
    flex-direction: column;
    gap: 6px;

    margin-top: auto;
    padding-top: 6px;
}

.brand {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.brand-title {
    font-size: 22px;
    font-weight: 600;
}

.brand-subtitle {
    font-size: 14px;
    color: var(--muted);
}

.hero {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 24px;

    padding: 28px;

    background: linear-gradient(135deg, rgb(47 94 245 / 12%), rgb(47 94 245 / 2%));
    border: 1px solid var(--border);
    border-radius: 24px;
    box-shadow: var(--shadow);
}

.hero__title {
    margin: 0 0 12px;
    font-size: 34px;
}

.hero__lead {
    margin: 0 0 18px;
    font-size: 16px;
    line-height: 1.5;
    color: var(--muted);
}

.hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;

    margin-bottom: 12px;
}

.hero__note {
    font-size: 13px;
    color: var(--muted);
}

.hero__panel {
    display: flex;
    flex-direction: column;
    gap: 12px;

    padding: 20px;

    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
}

.hero__panel-title {
    font-size: 16px;
    font-weight: 600;
}

.hero__list {
    display: grid;
    gap: 10px;

    margin: 0;
    padding: 0;

    font-size: 14px;
    color: var(--muted);
    list-style: none;
}

.hero__list li {
    position: relative;
    padding-left: 18px;
}

.hero__list li::before {
    content: '•';
    position: absolute;
    left: 0;
    color: var(--accent);
}

.section {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.section-title {
    font-size: 22px;
    font-weight: 600;
}

.section-lead {
    font-size: 14px;
    color: var(--muted);
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
}

.feature-card {
    display: flex;
    flex-direction: column;
    gap: 10px;

    padding: 18px;

    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
}

.feature-title {
    font-weight: 600;
}

.feature-text {
    font-size: 14px;
    line-height: 1.5;
    color: var(--muted);
}

.steps {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
}

.step-card {
    display: flex;
    flex-direction: column;
    gap: 8px;

    padding: 18px;

    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
}

.step-number {
    font-size: 12px;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: 0.12em;
}

.step-title {
    font-weight: 600;
}

.step-text {
    font-size: 14px;
    line-height: 1.5;
    color: var(--muted);
}

.use-cases {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
}

.use-case {
    padding: 14px 16px;

    font-size: 14px;
    font-weight: 600;

    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
}

.faq {
    display: grid;
    gap: 10px;
}

.reveal {
    transform: translateY(12px);
    opacity: 0;
    animation: fade-up 0.6s ease forwards;
    animation-delay: var(--delay, 0s);
}

@keyframes fade-up {
    from {
        transform: translateY(12px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@media (max-width: 900px) {
    .page-header {
        flex-direction: column;
        align-items: stretch;
    }

    .header-theme {
        width: 100%;
    }

    .card {
        grid-template-columns: 1fr;
    }

    .hero {
        grid-template-columns: 1fr;
    }

    .feature-grid {
        grid-template-columns: 1fr;
    }

    .steps {
        grid-template-columns: 1fr;
    }

    .use-cases {
        grid-template-columns: 1fr;
    }

    .text-panel-saves__actions {
        justify-content: flex-start;
        width: 100%;
    }

    :deep(.sr-textarea) {
        min-height: 100px !important;
    }
}

@media (prefers-reduced-motion: reduce) {
    .reveal {
        transform: none;
        opacity: 1;
        animation: none;
    }
}
</style>
