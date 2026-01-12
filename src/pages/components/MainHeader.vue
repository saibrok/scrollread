<script setup>
import { computed } from 'vue';

import { useTheme } from '../../composables/useTheme';
import { getPaletteOptions, THEME_TONE_OPTIONS } from '../../utils/themes';

import SrSelect from '../../ui/SrSelect.vue';

const { themeSettings } = useTheme();

const paletteOptions = computed(() => getPaletteOptions(themeSettings.themeTone));
</script>

<template>
    <header class="page-header">
        <div class="brand">
            <div class="brand-title">ScrollRead</div>
            <div class="brand-subtitle">Онлайн телесуфлер с контролем темпа чтения</div>
        </div>
        <div class="header-theme">
            <div class="header-theme__control">
                <div class="label">Тон</div>
                <SrSelect
                    :model-value="themeSettings.themeTone"
                    :items="THEME_TONE_OPTIONS"
                    @update:model-value="(value) => (themeSettings.themeTone = value)"
                />
            </div>
            <div class="header-theme__control">
                <div class="label">Цветовая схема</div>
                <SrSelect
                    :model-value="themeSettings.themePalette"
                    :items="paletteOptions"
                    @update:model-value="(value) => (themeSettings.themePalette = value)"
                />
            </div>
        </div>
    </header>
</template>

<style scoped>
.page-header {
    gap: 24px;
    align-items: flex-start;
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

.label {
    font-size: 13px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

@media (max-width: 900px) {
    .page-header {
        flex-direction: column;
        align-items: stretch;
    }

    .header-theme {
        width: 100%;
    }
}
</style>
