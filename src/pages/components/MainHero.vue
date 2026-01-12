<script setup>
import { ref } from 'vue';

import { useTextStore } from '../../composables/useTextStore';
import { fetchDemoText } from '../../services/fishText';

import SrButton from '../../ui/SrButton.vue';

const emit = defineEmits(['start']);

const { text } = useTextStore();
const isLoading = ref(false);
const errorMessage = ref('');

async function handleDemoClick() {
    if (isLoading.value) {
        return;
    }

    isLoading.value = true;
    errorMessage.value = '';

    try {
        text.value = await fetchDemoText();
        emit('start');
    } catch (error) {
        errorMessage.value = 'Не удалось получить демо-текст. Попробуйте еще раз.';
        console.error(error);
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <section class="hero">
        <div class="hero__content">
            <h1 class="hero__title">Онлайн телесуфлер</h1>
            <p class="hero__lead">
                Вставьте текст, выберите скорость и начните читать. ScrollRead считает время, ведет текст по экрану и помогает сохранять заданный темп.
            </p>

            <div
                v-if="errorMessage"
                class="hero__note"
            >
                {{ errorMessage }}
            </div>
        </div>
        <div class="hero__actions">
            <SrButton
                as="a"
                class="hero__cta"
                variant="accent"
                href="#editor"
                :disabled="isLoading"
                @click.prevent="handleDemoClick"
            >
                {{ isLoading ? 'Генерируем...' : 'Демо' }}
            </SrButton>
        </div>
    </section>
</template>

<style scoped>
.hero {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 24px;

    padding: 28px;

    background: var(--surface);
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
    align-items: end;
    justify-content: end;
}

.hero__note {
    font-size: 13px;
    color: var(--muted);
}

@media (max-width: 900px) {
    .hero {
        grid-template-columns: 1fr;
    }
}
</style>
