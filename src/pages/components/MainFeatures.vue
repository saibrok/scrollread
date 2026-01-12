<template>
    <section
        id="features"
        class="section"
    >
        <div class="section-title">Преимущества ScrollRead</div>
        <div class="section-lead">Все, что нужно для уверенного чтения с экрана.</div>
        <div class="feature-grid">
            <div class="feature-card">
                <div class="feature-title">Точное время чтения</div>
                <div class="feature-text">Скорость задается в знаках в минуту, а оценка времени помогает заранее рассчитать длительность.</div>
            </div>
            <div class="feature-card">
                <div class="feature-title">Сохранение текстов</div>
                <div class="feature-text">Храните тексты локально, быстро возвращайтесь к нужному сценарию.</div>
            </div>
            <div class="feature-card">
                <div class="feature-title">Гибкая настройка</div>
                <div class="feature-text">Подберите шрифт, размер, цветовую схему и оформление под себя.</div>
            </div>
        </div>
    </section>
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

.section-lead {
    font-size: 14px;
    color: var(--muted);
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
}

.feature-card {
    display: flex;
    flex-direction: column;
    gap: 10px;

    padding: 18px;

    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
}

.feature-title {
    font-weight: 600;
}

.feature-text {
    font-size: 14px;
    line-height: 1.5;
    color: var(--muted);
}

@media (max-width: 900px) {
    .feature-grid {
        grid-template-columns: 1fr;
    }
}
</style>
