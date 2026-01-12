<script setup>
import EditorWorkspace from '../modules/Editor/EditorWorkspace.vue';
import MainFaq from './components/MainFaq.vue';
import MainFeatures from './components/MainFeatures.vue';
import MainFooter from './components/MainFooter.vue';
import MainHeader from './components/MainHeader.vue';
import MainHero from './components/MainHero.vue';
import MainSteps from './components/MainSteps.vue';
import MainSupportBanner from './components/MainSupportBanner.vue';
import MainUseCases from './components/MainUseCases.vue';

const emit = defineEmits(['start']);
</script>

<template>
    <div class="page">
        <MainHeader />
        <MainHero
            class="reveal"
            style="--delay: 0.05s"
            @start="emit('start')"
        />
        <MainSupportBanner
            class="reveal"
            style="--delay: 0.1s"
        />
        <EditorWorkspace
            class="reveal"
            style="--delay: 0.15s"
            @start="emit('start')"
        />
        <MainFeatures
            class="reveal"
            style="--delay: 0.2s"
        />
        <MainSteps
            class="reveal"
            style="--delay: 0.25s"
        />
        <MainUseCases
            class="reveal"
            style="--delay: 0.3s"
        />
        <MainFaq
            class="reveal"
            style="--delay: 0.35s"
        />
        <MainFooter />
    </div>
</template>

<style>
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

@media (prefers-reduced-motion: reduce) {
    .reveal {
        transform: none;
        opacity: 1;
        animation: none;
    }
}
</style>
