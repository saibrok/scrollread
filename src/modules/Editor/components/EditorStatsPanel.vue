<script setup>
import { computed } from 'vue';

import { countChars, countWords } from '../../../utils/text';

const props = defineProps({
    text: {
        type: String,
        required: true,
    },
});

const stats = computed(() => {
    return {
        words: countWords(props.text),
        chars: countChars(props.text, true),
        charsNoSpaces: countChars(props.text, false),
    };
});
</script>

<template>
    <div class="control">
        <div class="label">Статистика</div>
        <div class="stat-line">
            Всего слов: <strong>{{ stats.words }}</strong>
        </div>
        <div class="stat-line">
            Всего символов: <strong>{{ stats.chars }}</strong>
        </div>
        <div class="stat-line">
            Без пробелов: <strong>{{ stats.charsNoSpaces }}</strong>
        </div>
    </div>
</template>

<style scoped>
.control {
    display: flex;
    flex-direction: column;
    gap: 10px;

    padding: 16px;

    background: var(--bg-accent);
    border: 1px solid var(--border);
    border-radius: 16px;
}

.label {
    font-size: 13px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.stat-line {
    display: flex;
    gap: 12px;
    justify-content: space-between;

    font-size: 14px;
    color: var(--muted);
}
</style>
