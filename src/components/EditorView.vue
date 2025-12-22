<script setup>
import UiButton from '../ui/UiButton.vue';
import UiRange from '../ui/UiRange.vue';
import UiSelect from '../ui/UiSelect.vue';

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
    theme: {
        type: String,
        required: true,
    },
    canStart: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['update:text', 'update:speed', 'update:theme', 'start']);

function onTextInput(event) {
    emit('update:text', event.target.value);
}
</script>

<template>
    <div class="page">
        <header>
            <div>
                <div class="title">Teleprompter</div>
                <div class="subtitle">Черновик настроек и текста</div>
            </div>
            <div class="footer-note">Сохраняются только настройки</div>
        </header>

        <section class="card">
            <div class="editor">
                <div class="label">Текст</div>
                <textarea
                    :value="props.text"
                    placeholder="Вставьте текст, который будете читать"
                    @input="onTextInput"
                ></textarea>
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
                    <UiRange
                        :model-value="props.speed"
                        min="100"
                        max="2000"
                        step="100"
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

                <div class="control">
                    <div class="label">Тема интерфейса</div>
                    <UiSelect
                        :model-value="props.theme"
                        @update:model-value="emit('update:theme', $event)"
                    >
                        <option value="system">Системная</option>
                        <option value="light">Светлая</option>
                        <option value="dark">Темная</option>
                    </UiSelect>
                </div>

                <UiButton
                    class="start"
                    :disabled="!props.canStart"
                    @click="emit('start')"
                >
                    НАЧАТЬ
                </UiButton>
            </div>
        </section>
    </div>
</template>
