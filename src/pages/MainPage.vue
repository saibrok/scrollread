<script setup>
import EditorWorkspace from '../modules/Editor/EditorWorkspace.vue';
import MainFaq from './components/MainFaq.vue';
import MainFeatures from './components/MainFeatures.vue';
import MainFooter from './components/MainFooter.vue';
import MainHeader from './components/MainHeader.vue';
import MainHero from './components/MainHero.vue';
import MainSteps from './components/MainSteps.vue';
import MainUseCases from './components/MainUseCases.vue';

const emit = defineEmits(['start']);
</script>

<template>
    <div class="page">
        <MainHeader />
        <MainHero @start="emit('start')" />
        <EditorWorkspace @start="emit('start')" />
        <MainFeatures />
        <MainSteps />
        <MainUseCases />
        <MainFaq />
        <MainFooter />
    </div>
</template>

<style>
.card {
    display: grid;
    grid-template-columns: 1.4fr 0.9fr;
    gap: 24px;

    padding: 28px;

    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    box-shadow: var(--shadow);
}

.page-header {
    gap: 24px;
    align-items: flex-start;
}

.header-theme {
    display: flex;
    gap: 12px;
    min-width: 220px;
}

.header-theme__control {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 150px;
}

.text-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.label {
    font-size: 13px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.text-panel-saves {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.text-panel-saves__select {
    flex: 1;
    min-width: 220px;
}

.text-panel-saves__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.controls {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.control {
    display: flex;
    flex-direction: column;
    gap: 10px;

    padding: 16px;

    background: var(--bg-accent);
    border: 1px solid var(--border);
    border-radius: 16px;
}

.value {
    font-size: 28px;
    font-weight: 600;
}

.stat-line {
    display: flex;
    gap: 12px;
    justify-content: space-between;

    font-size: 14px;
    color: var(--muted);
}

.range-row {
    display: flex;
    gap: 10px;
    align-items: center;

    font-size: 14px;
    color: var(--muted);
}

.meta {
    font-size: 14px;
    color: var(--muted);
}

.start {
    margin-top: auto;
}

.support-button {
    position: fixed;
    z-index: 30;
    right: 24px;
    bottom: 24px;
}

.page-footer {
    display: flex;
    flex-direction: column;
    gap: 6px;

    margin-top: auto;
    padding-top: 6px;
}

.brand {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.brand-title {
    font-size: 22px;
    font-weight: 600;
}

.brand-subtitle {
    font-size: 14px;
    color: var(--muted);
}

.hero {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 24px;

    padding: 28px;

    background: linear-gradient(135deg, rgb(47 94 245 / 12%), rgb(47 94 245 / 2%));
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
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;

    margin-bottom: 12px;
}

.hero__note {
    font-size: 13px;
    color: var(--muted);
}

.hero__panel {
    display: flex;
    flex-direction: column;
    gap: 12px;

    padding: 20px;

    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
}

.hero__panel-title {
    font-size: 16px;
    font-weight: 600;
}

.hero__list {
    display: grid;
    gap: 10px;

    margin: 0;
    padding: 0;

    font-size: 14px;
    color: var(--muted);
    list-style: none;
}

.hero__list li {
    position: relative;
    padding-left: 18px;
}

.hero__list li::before {
    content: '•';
    position: absolute;
    left: 0;
    color: var(--accent);
}

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

.faq {
    display: grid;
    gap: 10px;
}

.reveal {
    transform: translateY(12px);
    opacity: 0;
    animation: fade-up 0.6s ease forwards;
    animation-delay: var(--delay, 0s);
}

@keyframes fade-up {
    from {
        transform: translateY(12px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@media (max-width: 900px) {
    .page-header {
        flex-direction: column;
        align-items: stretch;
    }

    .header-theme {
        width: 100%;
    }

    .card {
        grid-template-columns: 1fr;
    }

    .hero {
        grid-template-columns: 1fr;
    }

    .feature-grid {
        grid-template-columns: 1fr;
    }

    .steps {
        grid-template-columns: 1fr;
    }

    .use-cases {
        grid-template-columns: 1fr;
    }

    .text-panel-saves__actions {
        justify-content: flex-start;
        width: 100%;
    }

    .sr-textarea {
        min-height: 100px !important;
    }
}

@media (prefers-reduced-motion: reduce) {
    .reveal {
        transform: none;
        opacity: 1;
        animation: none;
    }
}
</style>
