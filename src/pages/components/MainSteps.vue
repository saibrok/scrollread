<script setup>
import SrCard from '../../ui/SrCard.vue';
</script>

<template>
    <SrCard
        as="section"
        class="section"
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

<style scoped>
.section {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.section-title {
    font-size: 22px;
    font-weight: 600;
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

@media (max-width: 900px) {
    .steps {
        grid-template-columns: 1fr;
    }
}
</style>
