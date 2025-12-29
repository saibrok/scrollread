<script setup>
import SrButton from '../../ui/SrButton.vue';

function openSupport() {
    window.open('https://dalink.to/saibrok', '_blank', 'noopener,noreferrer');
}
</script>

<template>
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
        <SrButton
            class="support-button"
            @click="openSupport"
        >
            Поддержать проект
        </SrButton>
    </footer>
</template>
