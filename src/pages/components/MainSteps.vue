<script setup>
import SrCard from '../../ui/SrCard.vue';
</script>

<template>
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
</template>
