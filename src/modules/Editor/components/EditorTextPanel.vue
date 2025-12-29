<script setup>
import SrButton from '../../../ui/SrButton.vue';
import SrSelect from '../../../ui/SrSelect.vue';
import SrTextarea from '../../../ui/SrTextarea.vue';

const props = defineProps({
    text: {
        type: String,
        required: true,
    },
    saveItems: {
        type: Array,
        required: true,
    },
    selectedSaveId: {
        type: String,
        required: true,
    },
    canSave: {
        type: Boolean,
        required: true,
    },
    canLoad: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['update:text', 'save', 'load', 'select-save', 'delete-save']);
</script>

<template>
    <div class="text-panel">
        <SrTextarea
            :model-value="props.text"
            placeholder="Вставьте текст, который будете читать"
            @update:model-value="emit('update:text', $event)"
        />
        <div class="text-panel-saves">
            <div class="label">Сохранения</div>
            <div class="text-panel-saves__select">
                <SrSelect
                    :model-value="props.selectedSaveId"
                    :items="props.saveItems"
                    placeholder="Выберите сохранение"
                    :disabled="!props.saveItems.length"
                    @update:model-value="emit('select-save', $event)"
                />
            </div>
            <div class="text-panel-saves__actions">
                <SrButton
                    variant="accent"
                    :disabled="!props.canSave"
                    @click="emit('save')"
                >
                    Сохранить
                </SrButton>
                <SrButton
                    variant="default"
                    :disabled="!props.canLoad"
                    @click="emit('load')"
                >
                    Загрузить
                </SrButton>
                <SrButton
                    variant="default"
                    :disabled="!props.canLoad"
                    @click="emit('delete-save')"
                >
                    Удалить
                </SrButton>
            </div>
        </div>
    </div>
</template>
