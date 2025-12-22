<script setup>
import SrButton from '../ui/SrButton.vue';
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

const themeOptions = [
    { value: 'system', text: 'Как в системе' },
    { value: 'dark-gray', text: 'Dark Gray' },
    { value: 'light-gray', text: 'Light Gray' },
    { value: 'sepia', text: 'Sepia' },
    { value: 'paper', text: 'Paper' },
];

function onTextInput(event) {
    emit('update:text', event.target.value);
}
</script>

<template>
    <div class="page">
        <header>
            <div>
                <div class="title">ScrollRead</div>
                <div class="subtitle">Телесуфлёр с контролем темпа чтения</div>
                <div class="subtitle">Читайте без спешки, сбивок и потери строки</div>
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
                    <SrSelect
                        :model-value="props.theme"
                        :items="themeOptions"
                        @update:model-value="emit('update:theme', $event)"
                    />
                </div>

                <SrButton
                    class="start"
                    :disabled="!props.canStart"
                    @click="emit('start')"
                >
                    НАЧАТЬ
                </SrButton>
            </div>
        </section>
    </div>
</template>
