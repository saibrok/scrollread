<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
    modelValue: {
        type: [String, Number],
        required: true,
    },
    items: {
        type: Array,
        default: () => [],
    },
    placeholder: {
        type: String,
        default: '',
    },
    id: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['update:modelValue', 'select']);

const isMenuOpen = ref(false);
const wrapper = ref(null);

const selectedItem = computed(() => props.items.find((item) => item.value === props.modelValue));
const selectedLabel = computed(() => {
    if (selectedItem.value) {
        return selectedItem.value.text;
    }

    if (props.placeholder) {
        return props.placeholder;
    }

    return props.items.length ? props.items[0].text : '';
});

function toggleMenu() {
    if (!props.items.length) {
        return;
    }

    isMenuOpen.value = !isMenuOpen.value;
}

function handleSelect(value) {
    emit('update:modelValue', value);
    emit('select', value);
    isMenuOpen.value = false;
}

function handleOutsideClick(event) {
    if (!isMenuOpen.value) {
        return;
    }

    const root = wrapper.value;

    if (root && !root.contains(event.target)) {
        isMenuOpen.value = false;
    }
}

onMounted(() => {
    document?.addEventListener('click', handleOutsideClick);
});

onBeforeUnmount(() => {
    document?.removeEventListener('click', handleOutsideClick);
});
</script>

<template>
    <div
        ref="wrapper"
        class="sr-select"
        :class="{ 'sr-select--open': isMenuOpen }"
    >
        <button
            :id="props.id || null"
            type="button"
            class="sr-select__trigger"
            v-bind="$attrs"
            @click="toggleMenu"
        >
            <span class="sr-select__text">{{ selectedLabel }}</span>
            <span class="sr-select__icon"></span>
        </button>

        <Transition name="ui-fade">
            <ul
                v-show="isMenuOpen"
                class="sr-select__menu"
            >
                <li
                    v-for="item in props.items"
                    :key="item.value ?? 'none'"
                    class="sr-select__menu-item"
                    :class="{ 'sr-select__menu-item--active': item.value === props.modelValue }"
                    @click="handleSelect(item.value)"
                >
                    {{ item.text }}
                </li>
            </ul>
        </Transition>
    </div>
</template>

<style scoped>
.sr-select {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.sr-select__trigger {
    cursor: pointer;

    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    padding: 10px 14px;

    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    color: var(--ui-text, var(--text));

    appearance: none;
    background: var(--ui-surface, var(--surface));
    border: 1px solid var(--ui-border, var(--border));
    border-radius: 12px;
    box-shadow: var(--ui-shadow, 0 10px 20px rgb(15 23 42 / 8%));

    transition:
        transform 0.15s ease,
        box-shadow 0.15s ease,
        border-color 0.15s ease,
        background 0.15s ease;
}

.sr-select__trigger:hover {
    transform: translateY(-1px);
    background: var(--ui-surface-hover, var(--bg-accent));
    border-color: var(--ui-border-hover, var(--accent));
}

.sr-select__trigger:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}

.sr-select__text {
    flex: 1;
    text-align: left;
}

.sr-select__icon {
    transform: rotate(45deg);

    width: 10px;
    height: 10px;

    border-right: 2px solid var(--ui-icon, var(--muted));
    border-bottom: 2px solid var(--ui-icon, var(--muted));

    transition: transform 0.15s ease;
}

.sr-select--open .sr-select__icon {
    transform: rotate(-135deg);
}

.sr-select__menu {
    position: absolute;
    z-index: 20;
    top: calc(100% + 6px);
    right: 0;
    left: 0;

    overflow-y: auto;

    max-height: 320px;
    margin: 0;
    padding: 6px;

    list-style: none;

    background: var(--ui-surface, var(--surface));
    border: 1px solid var(--ui-border, var(--border));
    border-radius: 14px;
    box-shadow: var(--ui-shadow, 0 16px 32px rgb(15 23 42 / 16%));
}

.sr-select__menu-item {
    cursor: pointer;

    padding: 10px 12px;

    font-size: 14px;

    border-radius: 10px;

    transition:
        background 0.15s ease,
        color 0.15s ease;
}

.sr-select__menu-item--active {
    color: #fff;
    background: var(--accent);
}

.sr-select__menu-item:not(.sr-select__menu-item--active):hover {
    background: var(--ui-surface-hover, var(--bg-accent));
}

.ui-fade-enter-active,
.ui-fade-leave-active {
    transition: opacity 0.12s ease;
}

.ui-fade-enter-from,
.ui-fade-leave-to {
    opacity: 0;
}
</style>
