<template>
    <section class="section">
        <div class="section-title">Для кого подходит</div>
        <div class="use-cases">
            <div class="use-case">Видеоблогеры и стримеры</div>
            <div class="use-case">Преподаватели и лекторы</div>
            <div class="use-case">Спикеры на конференциях</div>
            <div class="use-case">Маркетинговые и продуктовые команды</div>
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

.use-cases {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
}

.use-case {
    padding: 14px 16px;

    font-size: 14px;
    font-weight: 600;

    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
}

@media (max-width: 900px) {
    .use-cases {
        grid-template-columns: 1fr;
    }
}
</style>
