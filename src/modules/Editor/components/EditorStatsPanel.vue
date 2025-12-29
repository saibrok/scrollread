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
