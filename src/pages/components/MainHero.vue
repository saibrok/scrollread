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
    <section
        class="hero reveal"
        style="--delay: 0.05s"
    >
        <div class="hero__content">
            <h1 class="hero__title">Онлайн телесуфлер, который держит темп чтения</h1>
            <p class="hero__lead">
                Вставьте текст, выберите скорость и начните читать без рывков. ScrollRead считает время, ведет текст по экрану и помогает сохранять уверенный
                ритм.
            </p>
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
            <div class="hero__note">Без регистрации, рекламы и подписок.</div>
            <div
                v-if="errorMessage"
                class="hero__note"
            >
                {{ errorMessage }}
            </div>
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
</template>
