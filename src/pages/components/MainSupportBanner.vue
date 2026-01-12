<template>
    <section class="support-banner">
        <div class="support-banner__title">ScrollRead создаётся как рабочий инструмент — без рекламы, регистрации и подписок.</div>
        <div class="support-banner__text">Он бесплатный и остаётся таким благодаря вашей поддержке.</div>
        <div class="support-banner__text">
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
        <div class="support-banner__text support-banner__text--accent">
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
    </section>
</template>

<style scoped>
.support-banner {
    display: flex;
    flex-direction: column;
    gap: 8px;

    padding: 20px 24px;

    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    box-shadow: var(--shadow);
}

.support-banner__title {
    font-weight: 600;
}

.support-banner__text {
    font-size: 14px;
    color: var(--muted);
}

.support-banner__text--accent {
    color: var(--reader-text);
}
</style>
