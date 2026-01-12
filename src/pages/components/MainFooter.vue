<script setup>
import SrButton from '../../ui/SrButton.vue';

function openSupport() {
    window.open('https://dalink.to/saibrok', '_blank', 'noopener,noreferrer');
}
</script>

<template>
    <footer class="page-footer">
        <SrButton
            class="support-button"
            @click="openSupport"
        >
            Поддержать проект
        </SrButton>
    </footer>
</template>

<style scoped>
.page-footer {
    display: flex;
    flex-direction: column;
    gap: 6px;

    margin-top: auto;
    padding-top: 6px;
}

.support-button {
    position: fixed;
    z-index: 30;
    right: 24px;
    bottom: 24px;
}
</style>
