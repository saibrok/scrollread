<script setup>
import SrButton from '../../ui/SrButton.vue';
</script>

<template>
    <section
        class="hero reveal"
        style="

    --delay: 0.05s"
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
</template>
